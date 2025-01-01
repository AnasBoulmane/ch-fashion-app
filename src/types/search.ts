
export interface Suggestion {
  axistypeId: string
  nrResults: number
  displaySearchterm: string
  axisName: string
}

export interface SuggestResponse {
  data: {
    suggestions: Suggestion[]
  }
  success: boolean
  timestamp: string
}

export type AxisType = "fashion" | "eyewear" | "fragrance" | "jewelry" | "makeup" | "skincare" | "watches"

export interface Product {
  code: string
  link: string
  name: string
  description: string
  axisType: AxisType
  // Price related fields
  price: string | null
  priceLabel: string
  priceMention: boolean
  displayPrice: boolean
  displayPriceMention: string
  disclaimerPrice: boolean
  // Product metadata
  productTypeGroup: string | null
  isPermanent: boolean
  sellableOnline: boolean
  // Image handling
  imageData: {
    baseUrl: string
    path: string
    assetType: string
    cloudinaryTransformation: string | null
  }
  // Variant handling
  shadeActive: boolean
  shadeName: string
  totalShades?: number
  hexColors?: Array<{
    sku: string
    shadeName: string
    hexvalues: string[]
  }>
  numberOfVariants: number
  // Analytics & tracking
  analytics: {
    onClick: {
      eventLabel: string | null
    }
  }
  tracking: {
    fabric?: string | null
    color?: string | null
    productLine?: string | null
  }
  refFshCode: string
}

export interface Filter {
  name: string
  genericName: string
  visible: boolean
  nonLocalizedFilterName: string
  nonLocalizedName: string
  specialFacet: boolean
  code: string
  priceFacet: boolean
  values: Array<{
    name: string
    code: string
    filter: string
    count: number
    selected: boolean
  }>
}

export interface SearchResponse {
  data: {
    // Core search data
    redirectURL: string
    axisMap: Record<AxisType, string> | null
    landingAxisSearchData?: {
      axisName: string
      axisType: AxisType
      productListData: {
        products: Product[]
        facets: Filter[]
        pagination: {
          totalNumberOfResults: number
          currentPage: number
          numberOfPages: number
        }
      }
    }
    // Feature flags
    isNewPriceDisplayForFSH: boolean
    isNameDisplayedForFSH: boolean
    isPearlSearchEnabled?: boolean
    // Additional content
    searchOverlayPulsContents?: string[]
    // No results handling
    noResultAxis: {
      [K in AxisType]?: string
    } | null
  }
  success: boolean
  timestamp: string
}
