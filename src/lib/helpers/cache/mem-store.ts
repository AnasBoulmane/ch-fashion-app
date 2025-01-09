import { MemCache } from './types'

type CacheEntry<T> = {
  value: T
  timestamp: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MemoryStore = Map<string, CacheEntry<any>>

const DEFAULT_CACHE_SIZE = 5 * 1024 * 1024 // 5MB

export const createMemoryCache = (cacheSize: number = DEFAULT_CACHE_SIZE): MemCache => {
  const store: MemoryStore = new Map()

  /**
   * Clear out any old entries in the cache to prevent cache to grow indefinitely
   * This is a simple garbage collection mechanism that removes older entries when the cache size exceeds a certain threshold
   * @param size - The maximum size of the cache once garbage collection is complete (in bytes) default is 5MB
   **/
  const garbageCollect = (size: number = cacheSize) => {
    const entries = Array.from(store.entries())
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    let total = 0
    for (const [key, entry] of sortedEntries) {
      total += JSON.stringify(entry).length
      if (total > size) {
        store.delete(key)
      }
    }
    return `${(total / 1024).toFixed(2)} KB`
  }

  return {
    get: <T>(key: string): T | undefined => {
      return store.get(key)?.value
    },

    set: <T>(key: string, value: T): void => {
      store.set(key, {
        value,
        timestamp: Date.now(),
      })
      setTimeout(() => console.log('Cache weight:', garbageCollect()))
    },

    has: (key: string): boolean => {
      return store.has(key)
    },

    delete: (key: string): void => {
      store.delete(key)
    },

    size: () => store.size,

    memoryWeight: () => {
      let total = 0
      for (const value of store.values()) {
        total += JSON.stringify(value).length
      }
      return `${(total / 1024).toFixed(2)} KB`
    },

    garbageCollect,
  }
}
