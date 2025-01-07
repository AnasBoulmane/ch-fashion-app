'use client'
import {
  useSearchStore,
  selectIsSearchLoading,
  selectHasMoreResults,
  selectHasMoreAxisTypes,
} from '@/lib/store/searchStore'
import { SearchBar } from './SearchBar'
import { SuggestionsSection } from './SuggestionsSection'
import { Loader } from '../common/Loader'
import { ProductGrid } from '../product-listing/ProductGrid'
import { LoadMoreButton } from '../product-listing/LoadMoreButton'
import { AxisCarousel } from './AxisCarousel'

export function SearchOverlay() {
  const { term, products, suggestions, totalCount, activeAxisType, availableAxisTypes, isSearching, loadMore, search } =
    useSearchStore()
  const hasMoreAxis = useSearchStore(selectHasMoreAxisTypes)
  const hasMorePages = useSearchStore(selectHasMoreResults)
  const isSearchLoading = useSearchStore(selectIsSearchLoading)
  // handlers
  const handleAxisChange = (axisType: string) => search(term, axisType)
  return (
    <div role="dialog" className="fixed inset-0 flex flex-col w-full items-center">
      <div className="flex flex-col w-full items-center z-10">
        <SearchBar />
        {hasMoreAxis && (
          <AxisCarousel
            availableAxis={availableAxisTypes}
            activeAxis={activeAxisType}
            onAxisChange={handleAxisChange}
          />
        )}
      </div>
      <div className="flex flex-col w-full items-center overflow-y-auto pb-3">
        {isSearchLoading && <Loader msg="Loading in progress" className="fixed inset-0 z-50" />}
        {suggestions.length > 0 && <SuggestionsSection />}
        {isSearching && products.length > 0 && (
          <>
            <ProductGrid products={products} axis={activeAxisType} totalCount={totalCount} />
            {hasMorePages && <LoadMoreButton onClick={loadMore} />}
          </>
        )}
      </div>
    </div>
  )
}
