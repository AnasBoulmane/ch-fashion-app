import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { debounce, DebouncedFunc, throttle } from 'lodash'
import { AxisType, Filter, Product, Suggestion } from '@/types/search'
import { fetchSearchResults, fetchSuggestions } from '../api'

export type SearchState = {
  // Search related
  term: string
  history: string[]
  suggestions: Suggestion[]

  // Results
  availableAxisTypes: AxisType[]
  activeAxisType: AxisType
  products: Product[]
  totalCount: number

  // UI State
  isLoading: boolean
  isSearching: boolean
  isOverlayOpen: boolean
  isFilterDrawerOpen: boolean

  // Filters
  filters: Filter[]
  filtersQuery: string

  // Pagination
  page: number
  pageCount: number
}

export type SearchActions = {
  // Core search actions
  setTerm: (term: string) => void
  search: DebouncedFunc<(term: string, axisType?: string, filtersQuery?: string) => Promise<void>>
  getSuggestions: DebouncedFunc<(term: string) => Promise<void>>
  clearHistory: () => void

  // UI actions
  toggleFilterDrawer: () => void
  loadMore: () => Promise<void>
}

/**
 * store a generated request id to be able to abort it
 * when a new request is made
 */
let currentRequestId: string | null = null
const updateRequestId = () => (currentRequestId = Math.random().toString(36).substring(2, 15))

export const useSearchStore = create<SearchState & SearchActions>()(
  devtools((set, get) => ({
    // Initial state
    term: '',
    history: [],
    suggestions: [],
    availableAxisTypes: [],
    activeAxisType: null,
    products: [],
    totalCount: 0,

    // UI State
    isLoading: false,
    isSearching: false,
    isFilterDrawerOpen: false,

    // Filters
    filters: [],
    filtersQuery: '',

    // Pagination
    page: 0,
    pageCount: 0,

    // Core search functionality
    setTerm: (term) => {
      set({ term })
      // Trigger suggestions when term length >= 2
      if (term.length >= 2) {
        get().getSuggestions(term)
      } else {
        set({ suggestions: [] })
      }
    },

    // Debounced suggestions fetcher
    getSuggestions: debounce(async (term: string) => {
      try {
        // generate a new request id, aborting the previous one
        const requestId = updateRequestId()
        const { data } = await fetchSuggestions(term.trim().toLowerCase())
        // Check if request is still valid, otherwise ignore
        if (requestId !== currentRequestId) return
        set({
          isSearching: false,
          suggestions: data?.suggestions || [],
        })
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        set({ suggestions: [] })
      }
    }, 300),

    search: throttle(async (term, axisType, filtersQuery = '') => {
      if (!term || term.length < 2) return
      const store = get()
      // Cancel any pending suggestions
      store.getSuggestions.cancel()
      // generate a new request id, aborting the previous one
      const requestId = updateRequestId()
      // Reset products, loading state and set search term
      set({ term, filtersQuery, isSearching: true, isLoading: true, products: [] })

      try {
        // Perform search with current filters and price range
        const { data } = await fetchSearchResults(term, filtersQuery, axisType)
        // Check if search data is available
        if (!data.landingAxisSearchData) throw new Error('No search data found')
        // Check if request is still valid, otherwise ignore
        if (requestId !== currentRequestId) return
        const isSearchingInAxis = axisType !== undefined
        set({
          availableAxisTypes: isSearchingInAxis
            ? store.availableAxisTypes
            : data.axisMap
              ? (Object.keys(data.axisMap) as AxisType[])
              : [],
          activeAxisType: data.landingAxisSearchData.axisType,
          products: data.landingAxisSearchData.productListData.products,
          filters: (data.landingAxisSearchData.productListData.facets || []).filter((f) => f.code && f.values?.length),
          totalCount: data.landingAxisSearchData.productListData.pagination.totalNumberOfResults,
          page: data.landingAxisSearchData.productListData.pagination.currentPage,
          pageCount: data.landingAxisSearchData.productListData.pagination.numberOfPages,
          isSearching: true,
          isLoading: false,
          term,
          filtersQuery,
          history: updateSearchHistory(store.history, term),
          suggestions: [],
        })
      } catch (error) {
        console.error('Search failed:', error)
        set({
          isSearching: true,
          isLoading: false,
          products: [],
          totalCount: 0,
        })
      }
    }, 300),

    // History management
    clearHistory: () => set({ history: [] }),

    // UI actions
    toggleFilterDrawer: () =>
      set((state) => ({
        isFilterDrawerOpen: !state.isFilterDrawerOpen,
      })),

    // Pagination
    loadMore: async () => {
      const store = get()
      const { term, filtersQuery, page, activeAxisType } = store
      const nextPage = page + 1
      // Set loading state, in case of cached data the promise will prevent flickering UI
      Promise.resolve().then(() => set({ isLoading: true }))

      try {
        const { data } = await fetchSearchResults(term, filtersQuery, activeAxisType, nextPage)
        // Check if search data is available
        if (!data.landingAxisSearchData) throw new Error('No search data found')

        set({
          products: [...store.products, ...data.landingAxisSearchData.productListData.products],
          totalCount: data.landingAxisSearchData.productListData.pagination.totalNumberOfResults,
          page: data.landingAxisSearchData.productListData.pagination.currentPage,
          pageCount: data.landingAxisSearchData.productListData.pagination.numberOfPages,
          isLoading: false,
        })
      } catch (error) {
        console.error('Failed to load more results:', error)
        set({ isLoading: false })
      }
    },
  }))
)

// Helper functions
const updateSearchHistory = (history: string[], term: string) => {
  const newHistory = history.filter((t) => t !== term)
  newHistory.unshift(term)
  return newHistory.slice(0, 3) // Keep last 3 searches
}

export const selectIsSearchLoading = (state: SearchState) => state.isLoading && state.isSearching
export const selectHasMoreResults = (state: SearchState) => state.page < state.pageCount
export const selectHasMoreAxisTypes = (state: SearchState) => state.isSearching && state.availableAxisTypes.length > 1
