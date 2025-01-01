import { Suggestion, SuggestResponse } from '@/types/search'
import { NextResponse } from 'next/server'

interface OgSuggestion {
  axistype_id: string
  nrResults: number
  display_searchterm: string
  axisName: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  const response = await fetch(`https://www.chanel.com/api/us/suggest?locale=en_US&language=en_US&q=${query}`, {
    headers: {
      'content-type': 'application/json',
      'accept-language': 'en,fr;q=0.9,fr-FR;q=0.8,en-US;q=0.7,ar;q=0.6,ja;q=0.5,zh-CN;q=0.4,zh;q=0.3',
      priority: 'u=1, i',
      referer: 'https://www.chanel.com/us/fashion/shoes/c/1x1x5/',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  })
  const responseBody = await response.json()

  if (responseBody?.data?.suggestions?.length) {
    // transform the response to match the expected format
    responseBody.data.suggestions = responseBody.data.suggestions
      .map(
        (suggestion: OgSuggestion): Suggestion => ({
          axistypeId: suggestion.axistype_id,
          nrResults: suggestion.nrResults,
          displaySearchterm: suggestion.display_searchterm,
          axisName: suggestion.axisName,
        })
      )
      .sort((a: Suggestion, b: Suggestion) => b.nrResults - a.nrResults)
  }
  return NextResponse.json(responseBody as SuggestResponse)
}
