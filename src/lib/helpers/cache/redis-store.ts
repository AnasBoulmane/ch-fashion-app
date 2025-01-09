import { Redis, SetCommandOptions } from '@upstash/redis'

console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL)

const writeClient = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
  automaticDeserialization: true,
  retry: {
    retries: 3,
  },
})

const readClient = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN!,
  automaticDeserialization: true,
  latencyLogging: true,
  retry: {
    retries: 1, // Fewer retries for reads
  },
})

export class RedisService {
  static async set<TData>(key: string, value: TData, opts?: SetCommandOptions): Promise<'OK' | TData | null> {
    return writeClient.set(key, value, opts)
  }

  static async get<TData>(key: string): Promise<TData | null> {
    return readClient.get(key)
  }
}
