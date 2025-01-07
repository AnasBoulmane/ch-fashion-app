import { cn } from '@/lib/helpers/css/cn'
import { AxisType } from '@/types/search'

type AxisCarouselProps = {
  availableAxis: AxisType[]
  activeAxis: AxisType
  onAxisChange?: (axis: AxisType) => void
}

export const AxisCarousel = ({ availableAxis, activeAxis, onAxisChange }: AxisCarouselProps) => {
  return (
    <div className="axis-carousel w-full border-b border-neutral-200 ">
      <nav className="w-full">
        <ul className="flex gap-3 pt-2 px-5 overflow-x-auto w-full md:justify-center">
          {availableAxis.map((axisKey) => (
            <li key={axisKey}>
              <button
                type="button"
                onClick={() => activeAxis !== axisKey && onAxisChange?.(axisKey)}
                className={cn([
                  'h-9 px-1.5 text-black font-abchanel font-semibold text-xs leading-normal cursor-pointer',
                  'md:h-12',
                ])}
              >
                {axisKey}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
