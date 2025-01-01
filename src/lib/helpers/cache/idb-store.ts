import { openDB, type IDBPDatabase } from 'idb';

let dbInstance: Promise<IDBPDatabase> | null = null;

const getDB = async () => {
  if (!dbInstance) {
    dbInstance = openDB('api-cache', 1, {
      upgrade(db) {
        db.createObjectStore('responses')
      },
    });
  }
  return dbInstance
};

export const getDBCache = () => {
  return {
    get: async <T>(key: string, ttl?: number): Promise<T | undefined> => {
      const db = await getDB()
      const tx = db.transaction('responses', 'readonly')
      const entry = await tx.objectStore('responses').get(key)
      if (!entry || (ttl && Date.now() - entry.timestamp > ttl)) return; // item expired or not found
      return entry?.value
    },

    set: async <T>(key: string, value: T): Promise<void> => {
      const db = await getDB()
      const tx = db.transaction('responses', 'readwrite')
      await tx.objectStore('responses').put(
        {
          value,
          timestamp: Date.now()
        },
        key
      )
    }
  };
};