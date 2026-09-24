// Device storage for the app's data. Large tables are split into buckets by
// id; only buckets that changed are rewritten.
import { TABLES, TABLE_NAMES } from './schema';

const PREFIX = 'kripros:v2';

const hashId = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

export const bucketOf = (table, id) => hashId(String(id)) % TABLES[table].buckets;

export const createPersistence = (storage) => {
  const tableKey = (table, bucket) => `${PREFIX}:table:${table}:${bucket}`;

  const allKeys = () => {
    const keys = [];
    for (const table of TABLE_NAMES) {
      for (let b = 0; b < TABLES[table].buckets; b++) keys.push(tableKey(table, b));
    }
    return keys;
  };

  const parse = (value) => {
    if (value == null) return {};
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  return {
    async load() {
      const values = Object.fromEntries(await storage.multiGet(allKeys()));
      const tables = {};
      for (const table of TABLE_NAMES) {
        tables[table] = {};
        for (let b = 0; b < TABLES[table].buckets; b++) {
          Object.assign(tables[table], parse(values[tableKey(table, b)]));
        }
      }
      return tables;
    },

    // Storage entries for the buckets that contain one of `changedIds`
    // (or for the whole table when `changedIds` is omitted).
    tableEntries(table, rows, changedIds) {
      const count = TABLES[table].buckets;
      const dirty = new Set(changedIds ? changedIds.map((id) => bucketOf(table, id)) : [...Array(count).keys()]);
      const buckets = new Map([...dirty].map((b) => [b, {}]));
      for (const [id, row] of Object.entries(rows)) {
        const b = bucketOf(table, id);
        if (buckets.has(b)) buckets.get(b)[id] = row;
      }
      return [...buckets].map(([b, data]) => [tableKey(table, b), JSON.stringify(data)]);
    },

    write(entries) {
      return storage.multiSet(entries);
    },

    clear() {
      return storage.multiRemove(allKeys());
    },
  };
};

// In-memory storage with the AsyncStorage API, used by the tests.
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
