import { useCallback } from 'react'
import { useSearchStore } from '@/lib/store/searchStore'
import { Suggestion } from '@/types/search'
import { i18n } from '@/lib/localization'
import { SuggestionItem } from './SuggestionItem'

export const SuggestionsSection = () => {
  const { term, suggestions, search } = useSearchStore()
  // handlers
  const handleSuggestClick = useCallback(
    (suggestion: Suggestion) => search(suggestion.displaySearchterm, suggestion.axistypeId),
    [search]
  )

  return (
    <div className="px-7 md:px-0 w-full md:w-5/6 lg:w-4/6">
      <div role="heading" aria-level={2} className="text-sm font-bold mt-7">
        {i18n('search-suggestion-type')}
      </div>
      <ul className="mt-4 -mx-2 space-y-2">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.axistypeId}
            suggestion={suggestion}
            currentTerm={term}
            onClick={handleSuggestClick}
          />
        ))}
      </ul>
    </div>
  )
}
