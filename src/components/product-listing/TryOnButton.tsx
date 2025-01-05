import { cn } from '@/lib/helpers/css/cn'
import { i18n } from '@/lib/localization'
import { Icon } from '../common/Icon'

export const TryOnButton = ({ code, axisType }: { code: string; axisType: string }) => {
  return (
    <button
      type="button"
      className={cn([
        'flex items-center justify-center w-auto h-8 p-1 m-1 rounded-full bg-white/70 cursor-pointer',
        'font-abchanel font-bold text-[11px] text-black',
        'js-vto-button vto-open',
      ])}
      title={i18n('search-try-and-compare')}
      aria-describedby={code}
      data-id={code}
      data-axis={axisType}
      data-vto-ref={code}
    >
      <Icon name="nest_cam_iq" />
      <span className="text px-1 sr-only">{i18n('search-try-and-compare')}</span>
    </button>
  )
}
