import { SearchResponse } from '@/types/search'
import { API_BASE_URL, HEADERS } from './constants'
import { SearchParams } from './types'
import { aggregateResponses, calculatePaginationBoundaries } from './pagination'
import { withCacheFirst } from '@/lib/helpers/cache/with-cache-first'
import { SERVER_CACHE_ADAPTERS } from '@/lib/helpers/cache/server-adapters'

/**
 * Fetch search results from the backend API
 * Supports caching with a cache-first strategy
 * @param url URL to fetch
 * @returns Search response
 */
const fetcher = withCacheFirst(
  'search',
  async (url: string) => {
    console.log('fetchChanelSearch', url)
    const response = await fetch(url, { headers: HEADERS })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} `)
    }
    return {
      data: await response.json(),
      success: response.ok,
      timestamp: new Date().toISOString(),
    }
  },
  {
    adapters: SERVER_CACHE_ADAPTERS,
  }
)

/**
 * Fetch a single page of search results
 * @param params Search parameters
 * @returns Search response
 */
export async function fetchSearchPage(params: SearchParams & { backendPage: number }): Promise<SearchResponse> {
  const url = buildUrl(params)
  return fetcher(url)
}

/**
 * Fetch multiple pages and aggregate the results
 * @param params Search parameters
 * @returns Aggregated search response
 */
export async function fetchAggregatedSearch(params: SearchParams, backendPageSize: number): Promise<SearchResponse> {
  const boundaries = calculatePaginationBoundaries(params.page, params.size, backendPageSize)
  const pagePromises = Array.from({ length: boundaries.endPage - boundaries.startPage + 1 }, (_, i) =>
    fetchSearchPage({ ...params, size: backendPageSize, backendPage: boundaries.startPage + i + 1 })
  )

  const responses = await Promise.all(pagePromises)
  return aggregateResponses(responses, boundaries)
}

const createURLSearchParams = (params: SearchParams & { backendPage: number }): URLSearchParams => {
  const searchParams = new URLSearchParams({
    cat: 'true',
    elementtype: 'product',
    language: 'en_US',
    locale: 'en_US',
    currency: 'USD',
    text: params.query ?? '',
    page: params.backendPage.toString(),
    size: params.size.toString(),
  })

  if (params.filter) searchParams.append('filter', params.filter)
  if (params.axis) searchParams.append('axis', params.axis)

  return searchParams
}

const buildUrl = (params: SearchParams & { backendPage: number }) => {
  return `${API_BASE_URL}/${!!params.axis ? 'axis/' : ''}search?${createURLSearchParams(params)}`
}
