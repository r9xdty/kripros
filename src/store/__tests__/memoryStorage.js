// In-memory storage with the AsyncStorage API for tests.
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
