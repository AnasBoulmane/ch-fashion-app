import { getDBCache } from './idb-store'
import { createMemoryCache } from './mem-store'
import { CacheAdapter } from './types'

const memCache = createMemoryCache()
const dbCache = getDBCache()

export const memCacheAdapter: CacheAdapter = Object.freeze({
  get: async <T>(key: string): Promise<T | undefined> => {
    if (memCache.has(key)) {
      Promise.resolve().then(() => {
        console.log('Cache hit (mem) for:', key)
        console.log('Cache size:', memCache.size())
        console.log('Cache weight:', memCache.garbageCollect())
      })
      return memCache.get(key)
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    return memCache.set(key, value)
  },
}) as CacheAdapter

export const dbCacheAdapter: CacheAdapter = Object.freeze({
  get: async <T>(key: string, ttl?: number): Promise<T | undefined> => {
    return undefined
    const dbResult: T | undefined = await dbCache.get(key, ttl)
    if (dbResult) {
      console.log('Cache hit (db) for:', key)
      memCache.set(key, dbResult)
      return dbResult
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    return dbCache.set(key, value)
  },
}) as CacheAdapter

export const CLIENT_CACHE_ADAPTERS = Object.freeze([
  memCacheAdapter, // P1: Check memory cache first
  dbCacheAdapter, // P2: Check IndexedDB next
]) as CacheAdapter[]
