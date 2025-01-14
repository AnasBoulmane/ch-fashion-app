import { CLIENT_CACHE_ADAPTERS } from './client-adapters'
import { generateKey } from './key-gen'
import { CacheAdapter } from './types'

const TTL = 1000 * 60 * 60 * 3 // 3 hours in milliseconds (default=half the edge cache lifetime)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fetcher<T> = (...args: any[]) => Promise<T | undefined>
type Options = {
  ttl?: number
  adapters?: CacheAdapter[]
}

/**
 * A higher-order function that wraps a fetcher function with a cache-first strategy
 * returning the cached value if it exists, otherwise fetching the data and caching it
 **/
export function withCacheFirst<R, T extends Fetcher<R>>(baseKey: string, fetcher: T, options?: Options): T {
  const { adapters, ttl } = Object.assign({ ttl: TTL, adapters: CLIENT_CACHE_ADAPTERS }, options)
  return (async (...args: unknown[]) => {
    const key = generateKey([baseKey, args])
    // Check each adapter in order
    for (const adapter of adapters) {
      const result = await adapter.get<R>(key)
      if (result) {
        return result
      }
    }
    // If no cache hit, fetch the data
    const result = await fetcher(...args)
    // Set the result in each adapter
    for (const adapter of adapters) {
      adapter.set(key, result, ttl)
    }
    return result
  }) as T
}
