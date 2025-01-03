import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { debounce } from 'lodash'
import { AxisType, Filter, Product, Suggestion } from "@/types/search"
import { fetchSearchResults, fetchSuggestions } from "../api"

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
  isFilterDrawerOpen: boolean

  // Filters
  filters: Filter[]

  // Pagination
  page: number
  pageCount: number
}

export type SearchActions = {
  // Core search actions
  setTerm: (term: string) => void
  search: (term: string, axisType?: string) => Promise<void>
  getSuggestions: (term: string) => Promise<void>
  clearHistory: () => void

  // Filter actions  
  // toggleFilter: (filter: Filter) => void
  // clearFilters: () => void

  // UI actions
  toggleFilterDrawer: () => void
  loadMore: () => Promise<void>
}

const useSearchStore = create<SearchState & SearchActions>()(
  devtools(
    (set, get) => ({
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
      getSuggestions: debounce(
        async (term) => {
          try {
            const suggestionsRes = await fetchSuggestions(term)
            set({
              suggestions: suggestionsRes?.data?.suggestions || [],
            })
          } catch (error) {
            console.error('Failed to fetch suggestions:', error)
            set({ suggestions: [] })
          }
        },
        300
      ),

      search: async (term, axisType) => {
        const store = get()
        const activeFilters = ''

        set({ isSearching: true, isLoading: true })

        try {
          // Perform search with current filters and price range
          const { data } = await fetchSearchResults(term, activeFilters, axisType)
          // Check if search data is available
          if (!data.landingAxisSearchData) throw new Error('No search data found')

          set({
            availableAxisTypes: data.axisMap ? Object.keys(data.axisMap) as AxisType[] : [],
            activeAxisType: data.landingAxisSearchData.axisType,
            products: data.landingAxisSearchData.productListData.products,
            totalCount: data.landingAxisSearchData.productListData.pagination.totalNumberOfResults,
            page: data.landingAxisSearchData.productListData.pagination.currentPage,
            pageCount: data.landingAxisSearchData.productListData.pagination.numberOfPages,
            isSearching: true,
            isLoading: false,
            term,
            history: updateSearchHistory(store.history, term),
            suggestions: []
          })
        } catch (error) {
          console.error('Search failed:', error)
          set({
            isSearching: true,
            isLoading: false,
            products: [],
            totalCount: 0
          })
        }
      },

      // // Filter management
      // toggleFilter: (filter) => {
      //   const store = get()
      //   const newFilters = toggleFilterInArray(store.activeFilters, filter)
      //   set({ activeFilters: newFilters })
      //   // Trigger new search with updated filters
      //   store.search(store.term)
      // },

      // clearFilters: () => {
      //   set({
      //     activeFilters: [],
      //     priceRange: { min: null, max: null }
      //   })
      //   // Trigger new search without filters
      //   get().search(get().term)
      // },

      // History management
      clearHistory: () => set({ history: [] }),

      // UI actions
      toggleFilterDrawer: () =>
        set(state => ({
          isFilterDrawerOpen: !state.isFilterDrawerOpen
        })),

      // Pagination
      loadMore: async () => {
        const store = get()
        const { term, page, activeAxisType } = store
        const nextPage = page + 1
        const activeFilters = ''
        set({ isSearching: true, isLoading: true })

        try {
          const { data } = await fetchSearchResults(term, activeFilters, activeAxisType, nextPage)
          // Check if search data is available
          if (!data.landingAxisSearchData) throw new Error('No search data found')

          set({
            products: [...store.products, ...data.landingAxisSearchData.productListData.products],
            totalCount: data.landingAxisSearchData.productListData.pagination.totalNumberOfResults,
            page: data.landingAxisSearchData.productListData.pagination.currentPage,
            pageCount: data.landingAxisSearchData.productListData.pagination.numberOfPages,
            isLoading: false
          })
        } catch (error) {
          console.error('Failed to load more results:', error)
          set({ isLoading: false })
        }
      }
    })
  )
)

// Helper functions
const updateSearchHistory = (history: string[], term: string) => {
  const newHistory = history.filter(t => t !== term)
  newHistory.unshift(term)
  return newHistory.slice(0, 3) // Keep last 3 searches
}

// const toggleFilterInArray = (filters: Filter[], filter: Filter) => {
//   const exists = filters.find(f => f.id === filter.id)
//   return exists
//     ? filters.filter(f => f.id !== filter.id)
//     : [...filters, filter]
// }

export default useSearchStore