'use client'
import { useSearchStore, selectIsSearchLoading, selectHasMoreResults } from '@/lib/store/searchStore'
import { SearchBar } from './SearchBar'
import { SuggestionsSection } from './SuggestionsSection'
import { Loader } from '../common/Loader'
import { ProductGrid } from '../product-listing/ProductGrid'
import { LoadMoreButton } from '../product-listing/LoadMoreButton'

export function SearchOverlay() {
  const { products, suggestions, totalCount, activeAxisType, isSearching, loadMore } = useSearchStore()
  const isSearchLoading = useSearchStore(selectIsSearchLoading)
  const hasMore = useSearchStore(selectHasMoreResults)
  return (
    <div role="dialog" className="fixed inset-0 flex flex-col w-full items-center">
      <div className="flex flex-col w-full items-center z-10">
        <SearchBar />
      </div>
      <div className="flex flex-col w-full items-center overflow-y-auto pb-3">
        {isSearchLoading && <Loader msg="Loading in progress" className="fixed inset-0 z-50" />}
        {suggestions.length > 0 && <SuggestionsSection />}
        {isSearching && products.length > 0 && (
          <>
            <ProductGrid products={products} axis={activeAxisType} totalCount={totalCount} />
            {hasMore && <LoadMoreButton onClick={loadMore} />}
          </>
        )}
      </div>
    </div>
  )
}
