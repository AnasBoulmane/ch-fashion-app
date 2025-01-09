export interface SearchParams {
  query: string | null
  filter: string | null
  axis: string | null
  page: number
  size: number
}

export interface PaginationBoundaries {
  frontendPage: number
  desiredPageSize: number
  startPage: number
  endPage: number
  startOffset: number
  endOffset: number
}

export interface CacheConfig {
  ttl: number
  key: string
}
