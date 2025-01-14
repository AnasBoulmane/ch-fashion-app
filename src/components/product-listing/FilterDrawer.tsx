'use client'

import { groupBy, map } from 'lodash'
import { AxisType, Filter, FilterValue } from '@/types/search'
import { i18n } from '@/lib/localization'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../common/Accordion'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../common/Drawer'
import { Icon } from '../common/Icon'
import { FilterCheckboxGroup } from './FilterCheckboxGroup'

export type FilterDrawerProps = {
  axisType: AxisType
  filters: Filter[]
  totalCount: number
  onFilterChange?: (
    filtersQuery: string,
    filters?: Filter[]
  ) => Promise<{ filters: Filter[]; totalCount: number } | undefined>
  onClearFilters?: () => void
  onSearch?: (filtersQuery: string) => void
}

export const FilterDrawer = ({ axisType, filters, totalCount, onFilterChange, onClearFilters }: FilterDrawerProps) => {
  const groupedFilters = map(groupBy(filters, 'specialFacet'), (value, key) => ({
    specialFacet: key,
    filters: value,
  }))
  // handlers
  const handleFilterChange = (filter: Filter, val: FilterValue, checked: boolean | string) => {
    const selected = checked === 'true' || checked === true
    const updatedValues = filter.values.map((v) => (v.code !== val.code ? v : { ...val, selected }))
    const updatedFilters = filters.map((f) => (f.code !== filter.code ? f : { ...filter, values: updatedValues }))
    onFilterChange?.(val.filter, updatedFilters)
    console.log('FilterDrawer: handleFilterChange:', updatedFilters, val, checked)
  }
  const handleClearFilters = async () => {
    const updatedFilters = filters.map((f) => ({ ...f, values: f.values.map((v) => ({ ...v, selected: false })) })) // clear all filters
    await onFilterChange?.('', updatedFilters)
    onClearFilters?.()
    console.log('FilterDrawer: handleClearFilters')
  }

  return (
    <DrawerContent className="inset-y-0 right-auto w-full md:w-[28rem] mt-0 !rounded-l-none rounded-r-xl ">
      {/* <DrawerPullBar /> */}
      <div className="flex flex-col h-full overflow-hidden rounded-r-xl border border-background">
        <DrawerHeader className="md:px-8 text-left">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Tweek and refine your search results by selecting the filters below.</DrawerDescription>
          <DrawerClose className="absolute flex top-2 right-2 p-2">
            <span className="sr-only">Close</span>
            <Icon name="close" />
          </DrawerClose>
        </DrawerHeader>
        {/****************************************
         * Body
         ****************************************/}
        <div className="px-5 pb-5 md:px-14 flex-1 overflow-y-auto space-y-5">
          {groupedFilters.map(({ specialFacet, filters }) =>
            specialFacet === 'true' ? (
              // special facet (not part of a group) - e.g. new, exclusive, click and collect etc.
              <div key={specialFacet} className="flex flex-col space-y-3 ">
                <div role="heading" aria-level={2} className="sr-only">
                  {i18n(`filters-special-text`)}
                </div>
                {filters?.map((filter) =>
                  filter.values.map((val) => (
                    <FilterCheckboxGroup
                      key={`${filter.code}-${val.code}`}
                      label={i18n(`search-nav-facetTitle-${axisType}-${filter.name.replace(/_us$/g, '')}`)}
                      filter={filter}
                      fValue={val}
                      disabled={val.count === 0}
                      onChange={handleFilterChange}
                    />
                  ))
                )}
              </div>
            ) : (
              // normal facet groups
              <Accordion key={specialFacet} type="multiple">
                {filters?.map((filter) => (
                  <AccordionItem value={filter.code} key={filter.code}>
                    <AccordionTrigger>
                      {i18n(`search-nav-facetTitle-${axisType}-${filter.name.replace(/_us$/g, '')}`)}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {filter.values.map((val) => (
                        <FilterCheckboxGroup
                          key={`${filter.code}-${val.code}`}
                          label={i18n(val.name.replace(/([a-z])\.([a-z])/gi, '$1-$2'))}
                          filter={filter}
                          fValue={val}
                          disabled={val.count === 0}
                          onChange={handleFilterChange}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )
          )}
        </div>
        {/****************************************
         * Footer
         ****************************************/}
        <DrawerFooter className="flex-row-reverse p-0 gap-0 bg-background">
          <DrawerClose
            type="submit"
            aria-live="polite"
            aria-atomic="true"
            className="h-12 flex-1 font-bold uppercase text-sm border-t border-black bg-black text-white "
          >
            {i18n('search-filterResults', totalCount)}
          </DrawerClose>
          <button
            type="button"
            aria-label={i18n('visual-filter-clear-all-filters')}
            disabled={totalCount !== 0}
            aria-disabled={totalCount !== 0}
            className="h-12 flex-1 font-bold uppercase text-sm border-t border-l border-neutral-200 disabled:text-muted-foreground"
            onClick={handleClearFilters}
          >
            {i18n('search-filterClearAll')}
          </button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
