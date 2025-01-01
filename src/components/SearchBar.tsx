import { FormEvent, KeyboardEvent } from 'react'
import useSearchStore from '@/lib/store/searchStore'
import { Icon } from './Icon'
import { i18n } from '@/lib/localization'

export const SearchBar = () => {
  const { term, setTerm, search } = useSearchStore()
  // handlers
  const handleClear = () => setTerm('')
  const handleSubmit = () => search(term)
  const handleChange = (e: FormEvent) => setTerm((e.target as HTMLInputElement).value)
  const handleSearch = (e: KeyboardEvent) => {
    const term = (e.target as HTMLInputElement).value.trim()
    if (e && e.key === 'Enter' && term !== '') search(term)
    return false
  }

  return (
    <div
      className={`
        w-full md:w-5/6 lg:w-4/6
        pt-3 md:pt-6 px-7 md:px-1 pb-1.5 
        relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[4px] md:after:bg-black
        after:transition-opacity after:duration-700 after:ease-out after:opacity-0 md:after:focus-within:opacity-100
        border-b border-neutral-200 md:border-black
      `}
    >
      <div role="search" className="relative flex items-center bg-neutral-100 md:bg-transparent ">
        <input
          id="search-overlay-input"
          type="search"
          value={term}
          onChange={handleChange}
          onInput={handleChange}
          onKeyDown={handleSearch}
          placeholder="Search"
          className={`
            font-abchanel font-bold outline-none text-black bg-transparent uppercase px-9 py-1.5 w-full 
            md:text-center md:text-4xl md:py-0 md:leading-none
          `}
        />

        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute flex p-2 pl-1 right-0 md:right-10 md:border-r md:py-0 md:pr-4"
          >
            <span className="sr-only md:hidden">{i18n('search-button-clear')}</span>
            <Icon name="cancel" className="text-[20px] md:hidden" />
            <span className="hidden md:block">{i18n('search-button-clear')}</span>
          </button>
        )}

        <button type="button" className="absolute p-2 pr-1 md:right-0 md:py-3" onClick={handleSubmit}>
          <span className="sr-only">{i18n('search-button-submit')}</span>
          <svg
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-5 h-5 text-black fill-current stroke-current"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5 11a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Zm-.797 5.61a8 8 0 1 1 .948-1.163l5.331 4.479-.964 1.148-5.315-4.464Z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
