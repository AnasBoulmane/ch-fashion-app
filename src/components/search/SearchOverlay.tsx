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
import { useScrollTransition } from '@/hooks/useScrollTransition'
import { StickyBar } from '../common/StickyBar'
import { SearchFilters } from './SearchFilters'

export function SearchOverlay() {
  const { term, products, suggestions, totalCount, activeAxisType, availableAxisTypes, isSearching, loadMore, search } =
    useSearchStore()
  const hasMoreAxis = useSearchStore(selectHasMoreAxisTypes)
  const hasMorePages = useSearchStore(selectHasMoreResults)
  const isSearchLoading = useSearchStore(selectIsSearchLoading)
  // handlers
  const handleAxisChange = (axisType: string) => search(term, axisType)
  // Atache scroll event listeners to the product grid container with ref
  const { containerRef, heightLimitRef, transitionY } = useScrollTransition({
    enabled: true,
    speedFactor: 0.375,
    throttleMs: 50,
  })

  return (
    <div role="dialog" className="fixed inset-0 flex-col-view">
      <div className="flex-col-view md:pb-5 z-20">
        <SearchBar />
      </div>
      <div className="flex-col-view overflow-y-auto pb-3" ref={containerRef}>
        {/* Animated Sections */}
        {hasMoreAxis && (
          <StickyBar
            ref={heightLimitRef}
            transitionY={transitionY}
            transitionFactor={0.375}
            className="flex-col-view bg-white fixed right-0 md:top-[6.375rem] top-[3.375rem] z-10 border-b border-neutral-200"
          >
            <AxisCarousel
              availableAxis={availableAxisTypes}
              activeAxis={activeAxisType}
              onAxisChange={handleAxisChange}
            />
          </StickyBar>
        )}
        {/* Filters Bar */}
        {isSearching && products.length > 0 && <SearchFilters transitionY={transitionY} />}
        {/* End Animated Sections */}
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
