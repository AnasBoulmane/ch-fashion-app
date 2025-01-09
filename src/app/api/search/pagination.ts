import { Product, SearchResponse } from '@/types/search'
import { PaginationBoundaries } from './types'

export const calculatePaginationBoundaries = (
  frontendPage: number,
  desiredPageSize: number,
  backendPageSize: number
): PaginationBoundaries => {
  const totalOffset = frontendPage * desiredPageSize
  return {
    frontendPage,
    desiredPageSize,
    startPage: Math.floor(totalOffset / backendPageSize),
    endPage: Math.floor((totalOffset + desiredPageSize - 1) / backendPageSize),
    startOffset: totalOffset % backendPageSize,
    endOffset: (totalOffset + desiredPageSize) % backendPageSize,
  }
}

export const sliceProducts = (
  products: Product[],
  pageIndex: number,
  { startPage, endPage, startOffset, endOffset }: PaginationBoundaries
): Product[] => {
  if (pageIndex === startPage) return products.slice(startOffset)
  if (pageIndex === endPage && endOffset > 0) return products.slice(0, endOffset)
  return products
}

/**
 * Aggregate multiple search responses into a single response
 * @param responses List of search responses
 * @param boundaries Pagination boundaries
 * @returns Aggregated search response
 */
export const aggregateResponses = (responses: SearchResponse[], boundaries: PaginationBoundaries): SearchResponse => {
  const [firstResponse] = responses

  if (!firstResponse?.data?.landingAxisSearchData?.productListData) {
    console.error('Invalid response format:', firstResponse, boundaries)
    throw new Error('Invalid response format')
  }

  const combinedProducts = responses
    .map((response) => response.data.landingAxisSearchData?.productListData.products || [])
    .map((products, index) => sliceProducts(products, index + boundaries.startPage, boundaries))
    .flat()
    .slice(0, boundaries.desiredPageSize)

  const pagination = firstResponse.data.landingAxisSearchData.productListData.pagination
  const totalResults = pagination.totalNumberOfResults

  console.log('Combined products:', {
    totalResults,
    currentPage: boundaries.frontendPage,
    combinedProducts: combinedProducts.length,
    numberOfPages: Math.floor(totalResults / boundaries.desiredPageSize),
    originalNumberOfPages: firstResponse.data.landingAxisSearchData.productListData.pagination.numberOfPages,
  })

  // Update pagination in first response
  const productListData = {
    ...firstResponse.data.landingAxisSearchData.productListData,
    products: combinedProducts,
    pagination: {
      ...pagination,
      totalNumberOfResults: totalResults,
      currentPage: boundaries.frontendPage,
      numberOfPages: Math.floor(totalResults / boundaries.desiredPageSize),
    },
  }

  return {
    ...firstResponse,
    data: {
      ...firstResponse.data,
      landingAxisSearchData: {
        ...firstResponse.data.landingAxisSearchData,
        productListData,
      },
    },
  }
}
