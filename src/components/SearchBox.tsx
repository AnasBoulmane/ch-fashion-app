'use client'
import useSearchStore from '@/lib/store/searchStore'
import { SearchBar } from './SearchBar'
import { SuggestionsSection } from './SuggestionsSection'

export function SearchBox() {
  const suggestions = useSearchStore((state) => state.suggestions)
  return (
    <div role="dialog" className="fixed inset-0 flex flex-col w-full items-center">
      <div className="flex flex-col w-full items-center">
        <SearchBar />
      </div>
      <div className="flex flex-col w-full items-center overflow-y-auto pb-3">
        {/* <Loader msg="Loading in progress" className="fixed inset-0" /> */}
        {suggestions.length > 0 && <SuggestionsSection />}
      </div>
    </div>
  )
}
