import { SearchResponse, SuggestResponse } from '@/types/search'
import { withCacheFirst } from '../helpers/cache/with-cache-first'

export async function baseFetchSuggestions(query: string): Promise<SuggestResponse> {
  const response = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions')
  }
  return response.json()
}

export const fetchSuggestions = withCacheFirst('suggest', baseFetchSuggestions)

export async function baseFetchSearchResults(
  query: string,
  filter = '',
  axis = '',
  page = 0,
  size = 27
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    size: size.toString(),
  });
  if (filter) params.append('filter', filter);
  if (axis) params.append('axis', axis);

  const response = await fetch(`/api/search?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch search results')
  }
  return response.json()
}

// export const fetchSearchResults = withCacheFirst('search', baseFetchSearchResults)
export const fetchSearchResults = baseFetchSearchResults
