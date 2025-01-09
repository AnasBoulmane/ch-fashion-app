import { MemCache } from './types'
import { CacheAdapter } from './types'

export const createMemCacheAdapter = (memCache: MemCache): CacheAdapter =>
  Object.freeze({
    get: async <T>(key: string): Promise<T | undefined> => {
      if (memCache.has(key)) {
        Promise.resolve().then(() => {
          console.log('Cache hit (mem) for:', key)
          console.log('Cache size:', memCache.size())
        })
        return memCache.get(key)
      }
    },

    set: async <T>(key: string, value: T): Promise<void> => {
      return memCache.set(key, value)
    },
  }) as CacheAdapter
