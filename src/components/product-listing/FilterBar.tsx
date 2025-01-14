import { i18n } from '@/lib/localization'
import { Icon } from '../common/Icon'
import { FilterDrawer, FilterDrawerProps } from './FilterDrawer'
import { Drawer, DrawerTrigger } from '../common/Drawer'
import { Filter } from '@/types/search'
import { useState } from 'react'

type FilterBarProps = FilterDrawerProps & {
  filtersQuery: string
}

export const FiltersBar = ({
  axisType,
  filters,
  totalCount,
  filtersQuery,
  onFilterChange,
  onClearFilters,
  onSearch,
}: FilterBarProps) => {
  const [localFilters, setLocalFilters] = useState<Filter[]>(filters)
  const [localTotalCount, setLocalTotalCount] = useState(totalCount)
  const [localFiltersQuery, setLocalFiltersQuery] = useState(filtersQuery)

  // handlers
  const handleFilterChange = async (filtersQuery: string, updatedFilters: Filter[] = []) => {
    setLocalFilters(updatedFilters)
    setLocalFiltersQuery(filtersQuery)
    // fetch updated total count and filter facet from the server after filter change
    const res = await onFilterChange?.(filtersQuery, updatedFilters)
    if (!res) return
    setLocalFilters(res.filters)
    setLocalTotalCount(res.totalCount ?? 0)
    return res
  }
  const handleDrawerClose = () => onSearch?.(localFiltersQuery)

  return (
    <div className="filters-bar w-full border-y border-neutral-200">
      <div className="grid-listing-container py-1 md:py-2 px-5 sm:px-0 flex-row-reverse justify-between items-center">
        <p aria-live="polite" className="text-sm font-noto">
          {i18n(totalCount > 1 ? 'product-results' : 'product-result', totalCount)}
        </p>
        <div className="filters-bar__actions">
          <Drawer direction="left" onClose={handleDrawerClose}>
            <DrawerTrigger className="flex items-center space-x-1 py-2">
              <Icon name="instant_mix" className="text-black" />
              <span className="font-abchanel text-sm font-semibold">Filter</span>
            </DrawerTrigger>
            <FilterDrawer
              axisType={axisType}
              filters={localFilters}
              totalCount={localTotalCount}
              onFilterChange={handleFilterChange}
              onClearFilters={onClearFilters}
            />
          </Drawer>
        </div>
      </div>
    </div>
  )
}
