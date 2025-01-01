type CacheEntry<T> = {
  value: T;
  timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MemoryStore = Map<string, CacheEntry<any>>;

export const createMemoryCache = () => {
  const store: MemoryStore = new Map();

  return {
    get: <T>(key: string): T | undefined => {
      return store.get(key)?.value;
    },

    set: <T>(key: string, value: T): void => {
      store.set(key, {
        value,
        timestamp: Date.now()
      });
    },

    has: (key: string): boolean => {
      return store.has(key);
    },

    delete: (key: string): void => {
      store.delete(key);
    },

    size: () => store.size,

    memoryWeight: () => {
      let total = 0;
      for (const value of store.values()) {
        total += JSON.stringify(value).length;
      }
      return `${(total / 1024).toFixed(2)} KB`;
    }
  };
};