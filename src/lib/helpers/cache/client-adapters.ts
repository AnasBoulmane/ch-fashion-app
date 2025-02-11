import { getDBCache } from './idb-store'
import { createMemCacheAdapter } from './mem-adapter'
import { createMemoryCache } from './mem-store'
import { CacheAdapter } from './types'

const MEM_CACHE_SIZE = 500 * 1024 // 500KB
const memCache = createMemoryCache(MEM_CACHE_SIZE)
const dbCache = getDBCache()

export const memCacheAdapter = createMemCacheAdapter(memCache)

export const dbCacheAdapter: CacheAdapter = Object.freeze({
  async get<T>(key: string): Promise<T | undefined> {
    const dbResult: T | undefined = await dbCache.get(key)
    if (dbResult) {
      console.log('Cache hit (db) for:', key)
      memCache.set(key, dbResult)
      return dbResult
    }
  },

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return dbCache.set(key, value, ttl)
  },
} as CacheAdapter)

// the client side should not need a programatic cache layer like this
// given all the layers of caching that are already in place in server side and edge caching
// this is a good example of a the adapter pattern
export const CLIENT_CACHE_ADAPTERS = Object.freeze([
  memCacheAdapter, // P1: Check memory cache first
  // dbCacheAdapter, // P2: Check IndexedDB next
]) as CacheAdapter[]
