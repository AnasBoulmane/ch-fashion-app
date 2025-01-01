type LoaderProps = {
  msg: string
  className?: string
}

export const Loader = ({ msg, className }: LoaderProps) => {
  return (
    <div className={`loader flex flex-col items-center justify-center ${className}`}>
      <div className="w-full flex items-center justify-center">
        <p tabIndex={-1} className="loader__text sr-only">
          {msg}
        </p>
        <i className="loader__dot h-3 w-3 bg-neutral-500/80 rounded-full mx-0.5" />
        <i className="loader__dot h-3 w-3 bg-neutral-500/80 rounded-full mx-0.5" />
        <i className="loader__dot h-3 w-3 bg-neutral-500/80 rounded-full mx-0.5" />
      </div>
    </div>
  )
}
