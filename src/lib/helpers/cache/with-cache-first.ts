import { getDBCache } from './idb-store'
import { generateKey } from './key-gen'
import { createMemoryCache } from './mem-store'

const memCache = createMemoryCache()
const dbCache = getDBCache()
const TTL = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fetcher<T> = (...args: any[]) => Promise<T | undefined>

export function withCacheFirst<R, T extends Fetcher<R>>(baseKey: string, fetcher: T, options?: { ttl?: number }): T {
  const { ttl } = options || { ttl: TTL }
  return (async (...args: unknown[]) => {
    const key = generateKey([baseKey, args])
    // P1: Check memory cache
    if (memCache.has(key)) {
      Promise.resolve().then(() => {
        console.log('Cache hit (mem) for:', key)
        console.log('Cache size:', memCache.size())
        console.log('Cache weight:', memCache.memoryWeight())
      })
      return memCache.get(key)
    }
    // P2: Check IndexedDB
    const dbResult = await dbCache.get(key, ttl)
    if (dbResult) {
      console.log('Cache hit (db) for:', key)
      memCache.set(key, dbResult)
      return dbResult
    }

    const result = await fetcher(...args)
    memCache.set(key, result)
    dbCache.set(key, result)
    return result
  }) as T
}
