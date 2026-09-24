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
