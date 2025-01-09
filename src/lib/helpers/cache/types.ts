export interface CacheAdapter {
  get: <T>(key: string) => Promise<T | undefined>
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>
}

export interface MemCache {
  get: <T>(key: string) => T | undefined
  set: <T>(key: string, value: T) => void
  has: (key: string) => boolean
  delete: (key: string) => void
  size: () => number
  memoryWeight: () => string
  garbageCollect: (size?: number) => string
}
