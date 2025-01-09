import { createHash } from 'crypto'
import { NextResponse } from 'next/server'

const DEFAULT_CACHE_HEADER = {
  'Content-Type': 'application/json',
  'Cache-Control': 'max-age=10', // 10 seconds
  'CDN-Cache-Control': 'max-age=60, stale-while-revalidate=1728000', // 1 minute cache with 20 days stale
  'Vercel-CDN-Cache-Control': 'max-age=21600, stale-while-revalidate=1728000', // 6 hours cache with 20 days stale
}

export function EdgeJsonResponse<T>(
  response: T,
  options: {
    status?: number
    headers?: Record<string, string>
    request?: Request
  } = {}
) {
  const status = options.status || 200
  const etag = createHash('sha256').update(JSON.stringify(response)).digest('hex')

  if (etag === options?.request?.headers.get('If-None-Match')) {
    return new NextResponse(null, { status: 304 })
  }

  const headers = Object.assign(DEFAULT_CACHE_HEADER, options.headers, { ETag: etag })
  return NextResponse.json(response, { ...options, status, headers })
}
