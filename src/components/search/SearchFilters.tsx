import { FiltersBar } from '../product-listing/FilterBar'
import { cn } from '@/lib/helpers/css/cn'
import { selectHasMoreAxisTypes, useSearchStore } from '@/lib/store/searchStore'
import { StickyBar, StickyBarProps } from '../common/StickyBar'
import { fetchSearchResults } from '@/lib/api'

type SearchFiltersProps = StickyBarProps

export const SearchFilters = ({ transitionY, transitionFactor = 1, className }: SearchFiltersProps) => {
  const { term, filtersQuery, filters, totalCount, activeAxisType, search } = useSearchStore()
  const hasMoreAxis = useSearchStore(selectHasMoreAxisTypes)
  // handlers
  const handleFilterChange = async (filtersQuery = '') => {
    // fetch total count on filter change
    const { data } = await fetchSearchResults(term, filtersQuery, activeAxisType)
    // only update filters drower
    return !data?.landingAxisSearchData?.productListData
      ? undefined
      : {
          filters: (data.landingAxisSearchData?.productListData.facets || []).filter((f) => f.code && f.values?.length),
          totalCount: data.landingAxisSearchData?.productListData?.pagination?.totalNumberOfResults ?? 0,
        }
  }
  // when filters drower is closed or filters are submitted,
  // we apply the filters to the search results
  const handleFilterSubmit = async (updatedFiltersQuery?: string) => {
    search(term, activeAxisType, updatedFiltersQuery ?? filtersQuery)
  }

  return (
    <StickyBar
      transitionY={transitionY}
      transitionFactor={transitionFactor}
      className={cn([
        'flex-col-view bg-white fixed right-0',
        hasMoreAxis && 'md:top-[9.625rem] top-[5.875rem] z-10',
        !hasMoreAxis && 'md:top-[6.375rem] top-[3.375rem] z-10 !translate-y-0',
        className,
      ])}
    >
      <FiltersBar
        axisType={activeAxisType}
        filters={filters}
        filtersQuery={filtersQuery}
        totalCount={totalCount}
        onFilterChange={handleFilterChange}
        onSearch={handleFilterSubmit}
      />
    </StickyBar>
  )
}
