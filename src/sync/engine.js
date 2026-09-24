// Offline-first sync engine.
//
// The device copy is the source of truth for the UI: every change is applied
// locally at once, persisted, and queued in an "outbox". Whenever the device
// is online, `sync()` pushes the outbox to Supabase and then pulls anything
// that changed on the server (e.g. from another phone) since the last pull.
//
// Conflicts are resolved with last-write-wins on `updated_at`; the server
// enforces it (see kripros_touch in the migration) and returns the canonical
// row, which replaces the local one. Deletions are soft (`deleted_at`) so
// they reach other devices, and are dropped from the device once synced.
import {
  PUSH_ORDER,
  TABLES,
  TABLE_NAMES,
  hasSoftDelete,
  normalizeRow,
  toPushPayload,
  withDefaults,
} from './schema';

export class SyncError extends Error {
  // kind: 'network' | 'auth' | 'server' → try again later
  //       'rejected'                    → this particular row is invalid
  constructor(kind, message, cause) {
    super(message);
    this.name = 'SyncError';
    this.kind = kind;
    this.cause = cause;
  }
}

class AbortedError extends Error {}

const keyOf = (table, id) => `${table}:${id}`;

// Supabase timestamps carry microseconds, which not every JS engine parses.
export const toMillis = (ts) => {
  if (!ts) return 0;
  const trimmed = String(ts).replace(/(\.\d{3})\d+/, '$1');
  const ms = Date.parse(trimmed);
  return Number.isNaN(ms) ? 0 : ms;
};

const emptyDirty = () => ({ tables: new Map(), outbox: false, meta: false, all: false });

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

export class SyncEngine {
  constructor({
    userId,
    remote,
    persistence,
    now = () => new Date(),
    newId,
    maxAttempts = 5,
    overlapMs = 60_000,
    pageSize = 1000,
    pushBatchSize = 200,
    onError = () => {},
  }) {
    this.userId = userId;
    this.remote = remote;
    this.persistence = persistence;
    this.now = now;
    this.newId = newId;
    this.maxAttempts = maxAttempts;
    this.overlapMs = overlapMs;
    this.pageSize = pageSize;
    this.pushBatchSize = pushBatchSize;
    this.onError = onError;

    this.tables = Object.fromEntries(TABLE_NAMES.map((t) => [t, {}]));
    this.outbox = {};
    this.meta = { cursors: {}, lastSyncedAt: null };
    this.status = { state: 'idle', lastError: null };
    this.listeners = new Set();
    this.writes = Promise.resolve();
    this.dirty = emptyDirty();
    this.flushScheduled = false;
    this.running = null;
    this.rerun = false;
    this.destroyed = false;
    this.snapshot = this.buildSnapshot();
  }

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------

  async init() {
    const loaded = await this.persistence.load();
    this.tables = { ...this.tables, ...loaded.tables };
    this.outbox = loaded.outbox || {};
    this.meta = { cursors: {}, lastSyncedAt: null, ...loaded.meta };
    this.emit();
  }

  destroy() {
    this.destroyed = true;
    this.listeners.clear();
  }

  // Resolves once every pending write has reached storage.
  flush() {
    return this.writes;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  hasLocalData() {
    return TABLE_NAMES.some((t) => Object.keys(this.tables[t]).length > 0);
  }

  // ------------------------------------------------------------------
  // Local changes
  // ------------------------------------------------------------------

  upsert(table, values) {
    return this.upsertMany(table, [values])[0];
  }

  // Applies several changes to one table with a single state update and a
  // single storage write (used for bulk imports).
  upsertMany(table, valuesList) {
    if (!TABLES[table]?.push) throw new Error(`Table ${table} is read-only`);
    const changed = {};
    for (const values of valuesList) {
      const id = table === 'profiles' ? this.userId : values.id ?? this.newId();
      const existing = changed[id] || this.tables[table][id];
      const updatedAt = this.nextTimestamp(existing?.updated_at);
      let row = { ...existing, ...values, id, updated_at: updatedAt };
      if (!existing) row = withDefaults(table, { created_at: updatedAt, ...row });
      if (TABLES[table].columns.includes('user_id')) row.user_id = this.userId;
      changed[id] = row;
    }
    this.setRows(table, changed, []);
    this.enqueue(Object.keys(changed).map((id) => keyOf(table, id)));
    this.emit();
    return Object.values(changed);
  }

  remove(table, id) {
    if (!this.tables[table][id]) return;
    this.upsert(table, { id, deleted_at: this.now().toISOString() });
  }

  // Gives rows that the server rejected another chance.
  retryFailed() {
    const outbox = { ...this.outbox };
    for (const key of Object.keys(outbox)) {
      if (outbox[key].attempts >= this.maxAttempts) outbox[key] = { ...outbox[key], attempts: 0 };
    }
    this.outbox = outbox;
    this.markDirty({ outbox: true });
    this.emit();
  }

  // Timestamps must strictly increase per row, otherwise two quick edits in
  // the same millisecond would look identical to the sync logic.
  nextTimestamp(previous) {
    let ms = this.now().getTime();
    const prev = toMillis(previous);
    if (ms <= prev) ms = prev + 1;
    return new Date(ms).toISOString();
  }

  enqueue(keys) {
    const outbox = { ...this.outbox };
    for (const key of keys) {
      const [table, ...rest] = key.split(':');
      outbox[key] = { table, id: rest.join(':'), attempts: 0 };
    }
    this.outbox = outbox;
    this.markDirty({ outbox: true });
  }

  // ------------------------------------------------------------------
  // Sync
  // ------------------------------------------------------------------

  sync() {
    if (this.running) {
      this.rerun = true;
      return this.running;
    }
    this.running = (async () => {
      let result;
      do {
        this.rerun = false;
        result = await this.runOnce();
      } while (this.rerun && result.ok && !this.destroyed);
      return result;
    })().finally(() => {
      this.running = null;
    });
    return this.running;
  }

  async runOnce() {
    this.setStatus({ state: 'syncing' });
    try {
      await this.push();
      await this.pull();
      this.meta = { ...this.meta, lastSyncedAt: this.now().toISOString() };
      this.markDirty({ meta: true });
      this.setStatus({ state: 'idle', lastError: null });
      return { ok: true };
    } catch (error) {
      if (error instanceof AbortedError) return { ok: false, aborted: true };
      const kind = error instanceof SyncError ? error.kind : 'server';
      if (kind !== 'network') this.onError(error);
      this.setStatus({ state: kind === 'network' ? 'offline' : 'error', lastError: error.message });
      return { ok: false, error };
    }
  }

  checkAlive() {
    if (this.destroyed) throw new AbortedError();
  }

  async push() {
    this.dropOrphans();
    for (const table of PUSH_ORDER) {
      const ids = Object.values(this.outbox)
        .filter((entry) => entry.table === table && entry.attempts < this.maxAttempts)
        .map((entry) => entry.id)
        .filter((id) => this.tables[table][id]);
      if (ids.length === 0) continue;

      for (const batch of chunk(ids, this.pushBatchSize)) {
        const rows = batch.map((id) => toPushPayload(table, this.tables[table][id]));
        try {
          const returned = await this.remote.upsert(table, rows);
          this.checkAlive();
          this.applyPushResult(table, rows, returned);
        } catch (error) {
          if (error instanceof AbortedError) throw error;
          if (!(error instanceof SyncError) || error.kind !== 'rejected') throw error;
          // One bad row fails the whole batch; retry one by one so the
          // valid rows still go through.
          for (const row of rows) {
            try {
              const returned = await this.remote.upsert(table, [row]);
              this.checkAlive();
              this.applyPushResult(table, [row], returned);
            } catch (rowError) {
              if (rowError instanceof AbortedError) throw rowError;
              if (!(rowError instanceof SyncError) || rowError.kind !== 'rejected') throw rowError;
              this.markAttempt(table, row, rowError);
            }
          }
        }
      }
    }
  }

  // Queue entries whose row is gone (e.g. the app stopped between two
  // writes in an older version) can never be pushed; drop them.
  dropOrphans() {
    const orphans = Object.keys(this.outbox).filter((key) => {
      const { table, id } = this.outbox[key];
      return !this.tables[table]?.[id];
    });
    if (orphans.length === 0) return;
    const outbox = { ...this.outbox };
    for (const key of orphans) delete outbox[key];
    this.outbox = outbox;
    this.markDirty({ outbox: true });
    this.emit();
  }

  applyPushResult(table, pushedRows, returnedRows) {
    const returned = new Map((returnedRows || []).map((r) => [r.id, normalizeRow(table, r)]));
    const changed = {};
    const removed = [];
    const outbox = { ...this.outbox };

    for (const pushed of pushedRows) {
      const current = this.tables[table][pushed.id];
      // Edited again while the request was in flight: keep it queued.
      if (!current || current.updated_at !== pushed.updated_at) continue;
      delete outbox[keyOf(table, pushed.id)];
      const server = returned.get(pushed.id);
      if (!server) continue;
      if (server.deleted_at) removed.push(pushed.id);
      else changed[pushed.id] = server;
    }

    this.outbox = outbox;
    this.setRows(table, changed, removed);
    this.markDirty({ outbox: true });
    this.emit();
  }

  markAttempt(table, row, error) {
    const key = keyOf(table, row.id);
    const entry = this.outbox[key];
    const current = this.tables[table][row.id];
    if (!entry || !current || current.updated_at !== row.updated_at) return;
    this.outbox = { ...this.outbox, [key]: { ...entry, attempts: entry.attempts + 1, lastError: error.message } };
    this.markDirty({ outbox: true });
    this.emit();
  }

  async pull() {
    for (const table of TABLE_NAMES) {
      const cursor = this.meta.cursors[table] || null;
      let since = cursor ? new Date(toMillis(cursor) - this.overlapMs).toISOString() : null;
      // Only a device that holds nothing of this table can skip tombstones.
      const excludeDeleted = !cursor && hasSoftDelete(table) && Object.keys(this.tables[table]).length === 0;
      let offset = 0;

      for (;;) {
        const rows = await this.remote.pull(table, { since, excludeDeleted, offset, limit: this.pageSize });
        this.checkAlive();
        this.applyPulledRows(table, rows);

        // Save the cursor after every page (pages arrive oldest first), so an
        // interrupted download resumes instead of starting over.
        let maxSeen = this.meta.cursors[table] || null;
        for (const row of rows) {
          if (toMillis(row.server_updated_at) > toMillis(maxSeen)) maxSeen = row.server_updated_at;
        }
        if (maxSeen !== (this.meta.cursors[table] || null)) {
          this.meta = { ...this.meta, cursors: { ...this.meta.cursors, [table]: maxSeen } };
          this.markDirty({ meta: true });
        }

        if (rows.length < this.pageSize) break;
        // Page by timestamp rather than by offset: a row edited on another
        // device while we page moves to the end instead of shifting later
        // pages and being skipped. Rows sharing the boundary timestamp are
        // fetched again and ignored as already known.
        const last = rows[rows.length - 1].server_updated_at;
        if (last === since) {
          offset += rows.length; // a whole page with one timestamp
        } else {
          since = last;
          offset = 0;
        }
      }
    }
  }

  applyPulledRows(table, rows) {
    if (rows.length === 0) return;
    const changed = {};
    const removed = [];
    let outbox = this.outbox;

    for (const raw of rows) {
      const key = keyOf(table, raw.id);
      const entry = outbox[key];
      if (entry) {
        // A pending local edit wins until it has been pushed; the push
        // response then carries the server's final decision. A row the
        // server keeps rejecting is replaced by the server's copy.
        if (entry.attempts < this.maxAttempts) continue;
        outbox = { ...outbox };
        delete outbox[key];
      }
      const local = this.tables[table][raw.id];
      // The overlap window re-delivers recent rows; skip what we already have.
      if (local && local.server_updated_at === raw.server_updated_at && !entry) continue;
      const row = normalizeRow(table, raw);
      if (row.deleted_at) {
        if (local) removed.push(row.id);
      } else changed[row.id] = row;
    }

    const outboxChanged = outbox !== this.outbox;
    if (outboxChanged) {
      this.outbox = outbox;
      this.markDirty({ outbox: true });
    }
    if (!outboxChanged && removed.length === 0 && Object.keys(changed).length === 0) return;
    this.setRows(table, changed, removed);
    this.emit();
  }

  // ------------------------------------------------------------------
  // Internals
  // ------------------------------------------------------------------

  setRows(table, changed, removedIds) {
    const ids = [...Object.keys(changed), ...removedIds];
    if (ids.length === 0) return;
    const rows = { ...this.tables[table], ...changed };
    for (const id of removedIds) delete rows[id];
    this.tables = { ...this.tables, [table]: rows };
    this.markDirty({ table, ids });
  }

  // Changes are collected and written in one storage call per tick, so a
  // row and its outbox entry are saved together: stopping the app between
  // two separate writes could otherwise leave a change that is never sent.
  markDirty({ table, ids, outbox, meta }) {
    if (this.destroyed) return;
    if (table) {
      const set = this.dirty.tables.get(table) || new Set();
      for (const id of ids) set.add(id);
      this.dirty.tables.set(table, set);
    }
    if (outbox) this.dirty.outbox = true;
    if (meta) this.dirty.meta = true;
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    this.writes = this.writes
      .then(() => this.writeDirty())
      .catch((error) => {
        // Rewrite everything with the next change.
        this.dirty.all = true;
        this.onError(error);
      });
  }

  async writeDirty() {
    this.flushScheduled = false;
    const dirty = this.dirty;
    this.dirty = emptyDirty();
    const entries = [];
    const tables = dirty.all ? TABLE_NAMES.map((t) => [t, undefined]) : [...dirty.tables].map(([t, ids]) => [t, [...ids]]);
    for (const [table, ids] of tables) entries.push(...this.persistence.tableEntries(table, this.tables[table], ids));
    if (dirty.all || dirty.outbox) entries.push(this.persistence.outboxEntry(this.outbox));
    if (dirty.all || dirty.meta) entries.push(this.persistence.metaEntry(this.meta));
    if (entries.length) await this.persistence.write(entries);
  }

  setStatus(patch) {
    this.status = { ...this.status, ...patch };
    this.emit();
  }

  buildSnapshot() {
    let pending = 0;
    let failed = 0;
    for (const entry of Object.values(this.outbox)) {
      if (entry.attempts >= this.maxAttempts) failed++;
      else pending++;
    }
    return {
      tables: this.tables,
      pending,
      failed,
      status: this.status,
      lastSyncedAt: this.meta.lastSyncedAt,
    };
  }

  emit() {
    if (this.destroyed) return;
    this.snapshot = this.buildSnapshot();
    for (const listener of this.listeners) listener(this.snapshot);
  }
}
