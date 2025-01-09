import { memCacheAdapter } from './client-adapters'
import { RedisService } from './redis-store'
import { CacheAdapter } from './types'

export const redisCacheAdapter: CacheAdapter = Object.freeze({
  async get<T>(key: string): Promise<T | undefined> {
    const dbResult = await RedisService.get<T>(key)
    if (dbResult) {
      console.log('Cache hit (db) for:', key)
      memCacheAdapter.set(key, dbResult)
      return dbResult
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    RedisService.set<T>(key, value)
  },
}) as CacheAdapter

export const SERVER_CACHE_ADAPTERS = Object.freeze([
  memCacheAdapter, // P1: Check memory cache first
  redisCacheAdapter,
]) as CacheAdapter[]
