import { Filter, FilterValue } from '@/types/search'
import { Checkbox } from '../common/Checkbox'

type Props = {
  label: string
  fValue: FilterValue
  filter: Filter
  disabled?: boolean
  onChange?: (filter: Filter, fValue: FilterValue, checked: boolean | string) => void
}

export const FilterCheckboxGroup = ({ label, filter, fValue, onChange, disabled }: Props) => {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={`${filter.code}-${fValue.code}`}
        value={fValue.value}
        checked={fValue.selected}
        disabled={disabled || fValue.count === 0}
        onCheckedChange={(checked) => onChange?.(filter, fValue, checked)}
      />
      <label
        htmlFor={`${filter.code}-${fValue.code}`}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal"
      >
        {label}
      </label>
    </div>
  )
}
