import { forwardRef, useRef, useEffect, useState } from 'react'

export type StickyBarProps = {
  transitionY: number
  transitionFactor?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const StickyBar = forwardRef<HTMLDivElement, StickyBarProps>(function StickyBar(
  { transitionY, transitionFactor = 1, className, style, children },
  forwardedRef
) {
  // Create a local ref to track the height
  const [height, setHeight] = useState<number>(0)
  const internalRef = useRef<HTMLDivElement>(null)

  // Use effect to sync the forwarded ref with our height measurements
  useEffect(() => {
    const element = internalRef.current
    // Initial height measurement
    if (element) {
      setHeight(element.clientHeight)
    }
  }, [transitionY])

  // Combine refs to support both forwarded and internal refs
  const setRefs = (element: HTMLDivElement | null) => {
    // Update internal ref
    internalRef.current = element
    // Handle forwarded ref
    if (typeof forwardedRef === 'function') {
      forwardedRef(element)
    } else if (forwardedRef) {
      forwardedRef.current = element
    }
  }

  return (
    <>
      <div
        ref={setRefs}
        className={className}
        style={{
          transform: `translateY(-${transitionY * transitionFactor}px)`,
          transition: 'transform 0.2s',
          ...style,
        }}
      >
        {children}
      </div>
      <div style={{ paddingTop: height }}>{/* Placeholder to maintain layout */}</div>
    </>
  )
})

StickyBar.displayName = 'StickyBar'
