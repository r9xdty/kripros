// All data lives on the device. The store keeps it in memory for the UI and
// writes changes to AsyncStorage in the background.
import { SETTINGS_ID, TABLE_NAMES, withDefaults } from './schema';

const emptyTables = () => Object.fromEntries(TABLE_NAMES.map((t) => [t, {}]));
const emptyDirty = () => ({ tables: new Map(), all: false });

export class LocalStore {
  constructor({ persistence, newId, now = () => new Date(), onError = () => {} }) {
    this.persistence = persistence;
    this.newId = newId;
    this.now = now;
    this.onError = onError;
    this.tables = emptyTables();
    this.listeners = new Set();
    this.writes = Promise.resolve();
    this.dirty = emptyDirty();
    this.flushScheduled = false;
    this.snapshot = { tables: this.tables };
  }

  async init() {
    this.tables = { ...emptyTables(), ...(await this.persistence.load()) };
    this.emit();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  isEmpty() {
    return TABLE_NAMES.every((t) => Object.keys(this.tables[t]).length === 0);
  }

  // Resolves once every pending write has reached storage.
  flush() {
    return this.writes;
  }

  upsert(table, values) {
    return this.upsertMany(table, [values])[0];
  }

  // Applies several changes to one table with a single update and write.
  upsertMany(table, valuesList) {
    const changed = {};
    const now = this.now().toISOString();
    for (const values of valuesList) {
      const id = table === 'settings' ? SETTINGS_ID : values.id ?? this.newId();
      const existing = changed[id] || this.tables[table][id];
      let row = { ...existing, ...values, id, updated_at: now };
      if (!existing) row = withDefaults(table, { created_at: now, ...row });
      changed[id] = row;
    }
    this.setRows(table, changed, []);
    this.emit();
    return Object.values(changed);
  }

  remove(table, id) {
    if (!this.tables[table][id]) return;
    this.setRows(table, {}, [id]);
    this.emit();
  }

  // Deletes everything, on the device too.
  async reset() {
    await this.writes;
    this.dirty = emptyDirty();
    this.tables = emptyTables();
    this.emit();
    this.writes = this.writes.then(() => this.persistence.clear()).catch((error) => this.onError(error));
    await this.writes;
  }

  setRows(table, changed, removedIds) {
    const ids = [...Object.keys(changed), ...removedIds];
    if (ids.length === 0) return;
    const rows = { ...this.tables[table], ...changed };
    for (const id of removedIds) delete rows[id];
    this.tables = { ...this.tables, [table]: rows };
    this.markDirty(table, ids);
  }

  // Changes are collected and written in one storage call per tick.
  markDirty(table, ids) {
    const set = this.dirty.tables.get(table) || new Set();
    for (const id of ids) set.add(id);
    this.dirty.tables.set(table, set);
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
    const tables = dirty.all ? TABLE_NAMES.map((t) => [t, undefined]) : [...dirty.tables].map(([t, ids]) => [t, [...ids]]);
    const entries = [];
    for (const [table, ids] of tables) entries.push(...this.persistence.tableEntries(table, this.tables[table], ids));
    if (entries.length) await this.persistence.write(entries);
  }

  emit() {
    this.snapshot = { tables: this.tables };
    for (const listener of this.listeners) listener(this.snapshot);
  }
}
