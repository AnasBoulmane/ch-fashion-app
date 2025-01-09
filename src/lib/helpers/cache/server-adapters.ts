import { createMemCacheAdapter } from './mem-adapter'
import { createMemoryCache } from './mem-store'
import { RedisService } from './redis-store'
import { CacheAdapter } from './types'

const MEM_CACHE_SIZE = 5 * 1024 * 1024 // 5MB
const memCache = createMemoryCache(MEM_CACHE_SIZE)

export const memCacheAdapter = createMemCacheAdapter(memCache)

export const redisCacheAdapter: CacheAdapter = Object.freeze({
  async get<T>(key: string): Promise<T | undefined> {
    const dbResult = await RedisService.get<T>(key)
    if (dbResult) {
      console.log('Cache hit (db) for:', key)
      memCache.set(key, dbResult)
      return dbResult
    }
  },

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    RedisService.set<T>(key, value, ttl ? { px: ttl } : undefined)
  },
}) as CacheAdapter

export const SERVER_CACHE_ADAPTERS = Object.freeze([
  memCacheAdapter, // P1: Check memory cache first
  redisCacheAdapter, // P2: Redis is fast but costly
]) as CacheAdapter[]
