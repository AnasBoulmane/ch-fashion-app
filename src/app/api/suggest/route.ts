import { EdgeJsonResponse } from '@/lib/helpers/cache/edge-response'
import { withCacheFirst } from '@/lib/helpers/cache/with-cache-first'
import { Suggestion, SuggestResponse } from '@/types/search'
import { HEADERS } from '../search/constants'
import { SERVER_CACHE_ADAPTERS } from '@/lib/helpers/cache/server-adapters'

interface OgSuggestion {
  axistype_id: string
  nrResults: number
  display_searchterm: string
  axisName: string
}

const fetcher = withCacheFirst(
  'suggest',
  async (url: string) => {
    console.log('backend suggest api call:', url)
    const response = await fetch(url, {
      headers: HEADERS,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} `)
    }
    return await response.json()
  },
  {
    ttl: 1000 * 60 * 60 * 24 * 40, // 40 days in milliseconds
    adapters: SERVER_CACHE_ADAPTERS,
  }
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  let responseBody = await fetcher(`https://www.chanel.com/api/us/suggest?locale=en_US&language=en_US&q=${query}`)
  // If there are suggestions, transform the response
  if (responseBody?.data?.suggestions?.length) {
    // transform the response to match the expected format
    const suggestions = responseBody.data.suggestions
      .map(
        (suggestion: OgSuggestion): Suggestion => ({
          axistypeId: suggestion.axistype_id,
          nrResults: suggestion.nrResults,
          displaySearchterm: suggestion.display_searchterm,
          axisName: suggestion.axisName,
        })
      )
      .sort((a: Suggestion, b: Suggestion) => b.nrResults - a.nrResults)
    // update the response body
    responseBody = { ...responseBody, data: { suggestions } }
  }

  return EdgeJsonResponse(responseBody as SuggestResponse, { request })
}
