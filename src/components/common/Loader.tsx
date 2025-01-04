import { cn } from '@/lib/helpers/css/cn'

const loaderDotCn = [
  'h-2.5 w-2.5 bg-neutral-500 rounded-full', // base
  'ease-in-out repeat-infinite animate-in zoom-in-125 direction-alternate-reverse duration-1000', // animation
]

type LoaderProps = {
  msg: string
  className?: string
}

export const Loader = ({ msg, className }: LoaderProps) => {
  return (
    <div className={`loader flex flex-col items-center justify-center ${className} backdrop-blur-sm`}>
      <div className="w-full flex items-center justify-center gap-1.5">
        <p tabIndex={-1} className="sr-only">
          {msg}
        </p>
        <i className={cn(loaderDotCn, 'delay-500')} />
        <i className={cn(loaderDotCn, 'delay-1000')} />
        <i className={cn(loaderDotCn, 'delay-0')} />
      </div>
    </div>
  )
}
