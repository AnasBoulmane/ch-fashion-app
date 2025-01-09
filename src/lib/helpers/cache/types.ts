export interface CacheAdapter {
  get: <T>(key: string, ttl?: number) => Promise<T | undefined>
  set: <T>(key: string, value: T) => Promise<void>
}
