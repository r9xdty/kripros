// In-memory stand-in for Supabase that mimics the behaviour of the SQL
// migration: last-write-wins on updated_at, server-assigned cursor with
// microsecond precision, soft deletes and foreign keys. Used by the tests
// and by the development-only demo mode; `offline`, `reject` and
// `beforeUpsert` let tests simulate failures.
import { SyncError } from './engine';

const FOREIGN_KEYS = {
  transactions: { category_id: 'categories', template_id: 'saving_templates', goal_id: 'goals' },
};

export const createMemoryRemote = () => {
  const db = {};
  let tick = Date.now();
  let micros = 0;
  const table = (name) => (db[name] = db[name] || {});

  const nextServerTimestamp = () => {
    tick += 1;
    micros = (micros + 137) % 1000;
    const iso = new Date(tick).toISOString(); // ...sss Z
    return `${iso.slice(0, -1)}${String(micros).padStart(3, '0')}+00:00`;
  };

  const server = {
    db,
    offline: false,
    calls: { upsert: 0, pull: 0 },
    reject: null, // (table, row) => string | null
    beforeUpsert: null, // async hook to simulate latency

    write(name, row) {
      const existing = table(name)[row.id];
      if (existing && Date.parse(row.updated_at) < Date.parse(existing.updated_at)) return existing;
      const next = {
        ...existing,
        ...row,
        created_at: existing?.created_at ?? row.created_at,
        server_updated_at: nextServerTimestamp(),
      };
      table(name)[row.id] = next;
      return next;
    },

    async upsert(name, rows) {
      server.calls.upsert++;
      if (server.beforeUpsert) await server.beforeUpsert(name, rows);
      if (server.offline) throw new SyncError('network', 'Network request failed');
      // Validate the whole batch first: a statement is atomic.
      for (const row of rows) {
        const reason = server.reject?.(name, row);
        if (reason) throw new SyncError('rejected', reason);
        for (const [column, parent] of Object.entries(FOREIGN_KEYS[name] || {})) {
          if (row[column] && !table(parent)[row[column]]) {
            throw new SyncError('rejected', `foreign key ${column}`);
          }
        }
      }
      return rows.map((row) => ({ ...server.write(name, row) }));
    },

    async pull(name, { since, excludeDeleted, offset, limit }) {
      server.calls.pull++;
      if (server.offline) throw new SyncError('network', 'Network request failed');
      const toMs = (ts) => Date.parse(ts.replace(/(\.\d{3})\d+/, '$1'));
      return Object.values(table(name))
        .filter((row) => !since || toMs(row.server_updated_at) >= toMs(since))
        .filter((row) => !excludeDeleted || !row.deleted_at)
        .sort((a, b) => (a.server_updated_at < b.server_updated_at ? -1 : a.server_updated_at > b.server_updated_at ? 1 : a.id < b.id ? -1 : 1))
        .slice(offset, offset + limit)
        .map((row) => ({ ...row }));
    },
  };
  return server;
};
