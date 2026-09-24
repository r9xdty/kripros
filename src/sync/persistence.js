// Device-side storage for the offline copy of a user's data.
//
// Everything lives under a per-user prefix so two accounts on the same
// device never see each other's data. Large tables are split into buckets
// by id; only buckets that changed are rewritten.
import { TABLES, TABLE_NAMES } from './schema';

const VERSION = 'v1';

const hashId = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

export const bucketOf = (table, id) => hashId(String(id)) % TABLES[table].buckets;

export const createPersistence = (storage, userId) => {
  const prefix = `kripros:${VERSION}:${userId}`;
  const tableKey = (table, bucket) => `${prefix}:table:${table}:${bucket}`;
  const outboxKey = `${prefix}:outbox`;
  const metaKey = `${prefix}:meta`;

  const allKeys = () => {
    const keys = [outboxKey, metaKey];
    for (const table of TABLE_NAMES) {
      for (let b = 0; b < TABLES[table].buckets; b++) keys.push(tableKey(table, b));
    }
    return keys;
  };

  const parse = (value, fallback) => {
    if (value == null) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  return {
    async load() {
      const entries = await storage.multiGet(allKeys());
      const values = Object.fromEntries(entries);
      const tables = {};
      for (const table of TABLE_NAMES) {
        tables[table] = {};
        for (let b = 0; b < TABLES[table].buckets; b++) {
          Object.assign(tables[table], parse(values[tableKey(table, b)], {}));
        }
      }
      return {
        tables,
        outbox: parse(values[outboxKey], {}),
        meta: parse(values[metaKey], {}),
      };
    },

    // Rewrites only the buckets that contain one of `changedIds`
    // (or the whole table when `changedIds` is omitted).
    async saveTable(table, rows, changedIds) {
      const count = TABLES[table].buckets;
      const dirty = new Set(
        changedIds ? changedIds.map((id) => bucketOf(table, id)) : [...Array(count).keys()],
      );
      const buckets = new Map([...dirty].map((b) => [b, {}]));
      for (const [id, row] of Object.entries(rows)) {
        const b = bucketOf(table, id);
        if (buckets.has(b)) buckets.get(b)[id] = row;
      }
      await storage.multiSet([...buckets].map(([b, data]) => [tableKey(table, b), JSON.stringify(data)]));
    },

    saveOutbox(outbox) {
      return storage.setItem(outboxKey, JSON.stringify(outbox));
    },

    saveMeta(meta) {
      return storage.setItem(metaKey, JSON.stringify(meta));
    },

    clear() {
      return storage.multiRemove(allKeys());
    },
  };
};

// Simple in-memory storage with the AsyncStorage API, used by tests and by
// the dev-only demo mode.
export const createMemoryStorage = () => {
  const map = new Map();
  return {
    map,
    async getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    async setItem(key, value) {
      map.set(key, value);
    },
    async removeItem(key) {
      map.delete(key);
    },
    async multiGet(keys) {
      return keys.map((key) => [key, map.has(key) ? map.get(key) : null]);
    },
    async multiSet(pairs) {
      for (const [key, value] of pairs) map.set(key, value);
    },
    async multiRemove(keys) {
      for (const key of keys) map.delete(key);
    },
  };
};
