import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const size = searchParams.get('size') || '27'
  const page = searchParams.get('page')
  const filter = searchParams.get('filter')
  const axis = searchParams.get('axis')

  const params = new URLSearchParams({
    q: query ?? '',
    page: page?.toString() ?? '1',
    size: size?.toString() ?? '27',
  });
  if (filter) params.append('filter', filter);
  if (axis) params.append('axis', axis);

  const response = await fetch(
    `https://www.chanel.com/api/us/search?cat=true&elementtype=product&language=en_US&locale=en_US&currency=USD&${params.toString()}`,
    {
      headers: {
        'content-type': 'application/json',
        'accept-language': 'en,fr;q=0.9,fr-FR;q=0.8,en-US;q=0.7,ar;q=0.6,ja;q=0.5,zh-CN;q=0.4,zh;q=0.3',
        'priority': 'u=1, i',
        'referer': 'https://www.chanel.com/us/fashion/shoes/c/1x1x5/',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    }
  )
  const responseBody = await response.json()
  return NextResponse.json(responseBody)
}