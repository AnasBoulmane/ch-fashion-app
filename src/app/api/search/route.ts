import { SearchResponse } from '@/types/search'
import { NextResponse } from 'next/server'
import { fetchAggregatedSearch, fetchSearchPage } from './search'
import { SearchParams } from './types'
import { EdgeJsonResponse } from '@/lib/helpers/cache/edge-response'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      query: searchParams.get('q'),
      filter: searchParams.get('filter'),
      axis: searchParams.get('axis'),
      page: parseInt(searchParams.get('page') || '0', 10),
      size: parseInt(searchParams.get('size') || '27', 10),
    }

    const response = await handleSearch(params)
    return EdgeJsonResponse(response, { request })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 })
  }
}

const handleSearch = async (params: SearchParams): Promise<SearchResponse> => {
  // try to determine the page size from the first page
  const firstResponse = await fetchSearchPage({ ...params, backendPage: params.page + 1 })
  const backendPageSize = firstResponse?.data?.landingAxisSearchData?.productListData?.pagination?.pageSize || 6
  // aggregate multiple pages if necessary to match the frontend page size
  // if the backend page size is already equal to the frontend page size, it will reuse
  // the first response from cache and update the pagination for uniformity
  return fetchAggregatedSearch(params, backendPageSize)
}
