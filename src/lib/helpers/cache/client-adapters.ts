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

export const CLIENT_CACHE_ADAPTERS = Object.freeze([
  memCacheAdapter, // P1: Check memory cache first
  // dbCacheAdapter, // P2: Check IndexedDB next
]) as CacheAdapter[]
