import { memo } from 'react'
import { i18n } from '@/lib/localization'
import { Suggestion } from '@/types/search'
import { Icon } from '../common/Icon'

type SuggestionItemProps = {
  suggestion: Suggestion
  currentTerm: string
  onClick?: (suggestion: Suggestion) => void
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const HIGHLIGHT_TEMPLATE = '<strong role="presentation" class="text-black">$&</strong>'

export const SuggestionItem = memo(({ suggestion, currentTerm, onClick }: SuggestionItemProps) => {
  const titleHtml = suggestion.displaySearchterm.replace(new RegExp(currentTerm, 'gi'), HIGHLIGHT_TEMPLATE)
  const nbrOfResultsInAxis = i18n(
    suggestion.nrResults > 1 ? 'search-suggestion-results' : 'search-suggestion-result',
    suggestion.nrResults,
    capitalize(suggestion.axisName)
  )

  return (
    <li>
      <button
        type="button"
        className="w-full text-left p-2 pr-0.5 rounded hover:bg-neutral-100"
        onClick={() => onClick?.(suggestion)}
        data-search={currentTerm}
        data-category={suggestion.axistypeId}
        aria-label={`${suggestion.displaySearchterm.toLowerCase()} ${nbrOfResultsInAxis}`}
      >
        <p className="text-xs leading-6 text-neutral-500 font-abchanel font-semibold md:text-sm md:mb-0.5">
          <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <Icon className="mt-2 float-right" name="chevron_right" />
        </p>
        <p className="text-xs text-neutral-700">{nbrOfResultsInAxis}</p>
      </button>
    </li>
  )
})

SuggestionItem.displayName = 'SuggestionItem'
