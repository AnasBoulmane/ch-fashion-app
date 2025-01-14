import { cn } from '@/lib/helpers/css/cn'
import { AxisType } from '@/types/search'

type AxisCarouselProps = {
  availableAxis: AxisType[]
  activeAxis: AxisType
  onAxisChange?: (axis: AxisType) => void
}

export const AxisCarousel = ({ availableAxis, activeAxis, onAxisChange }: AxisCarouselProps) => {
  return (
    <div className="axis-carousel w-full">
      <nav className="w-full">
        <ul className="flex gap-3 pt-1 px-5 overflow-x-auto w-full md:justify-center">
          {availableAxis.map((axisKey) => (
            <li key={axisKey}>
              <button
                type="button"
                onClick={() => activeAxis !== axisKey && onAxisChange?.(axisKey)}
                data-active={activeAxis === axisKey ? 'true' : undefined}
                className={cn([
                  'h-9 px-1.5 text-black font-abchanel font-semibold text-xs leading-normal cursor-pointer',
                  'md:h-12',
                  'relative after:absolute after:-bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-black', // underline effect base
                  'after:transition-opacity after:duration-500 after:ease-out after:opacity-0 data-[active]:after:opacity-100', // underline effect animation
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
