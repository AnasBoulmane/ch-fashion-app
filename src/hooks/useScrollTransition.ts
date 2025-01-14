import { useCallback, useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'

interface ScrollTransitionOptions {
  speedFactor?: number
  throttleMs?: number
  maxTransition?: number
  enabled?: boolean
}

export function useScrollTransition(options: ScrollTransitionOptions = {}) {
  const { speedFactor = 0.375, throttleMs = 50, enabled = true } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const heightLimitRef = useRef<HTMLDivElement>(null)
  const lastScrollTopRef = useRef(0)
  const [transitionY, setTransitionY] = useState(0)

  // Calculate transition based on scroll position
  const calculateTransition = useCallback(
    (currentScroll: number, previousScroll: number, maxHeight: number) => {
      const scrollDiff = currentScroll - previousScroll
      return (prevTransition: number) => {
        // Ensure transition stays within bounds of 0 and maxHeight
        return Math.max(0, Math.min(prevTransition + scrollDiff * speedFactor, maxHeight))
      }
    },
    [speedFactor]
  )

  // Handle scroll events
  const handleScroll = useCallback(
    throttle(() => {
      const container = containerRef.current
      const heightLimit = heightLimitRef.current

      if (!container || !heightLimit || !enabled) return

      const { scrollTop } = container
      const maxTransition = heightLimit.clientHeight
      const lastScrollTop = lastScrollTopRef.current

      setTransitionY(calculateTransition(scrollTop, lastScrollTop, maxTransition))

      lastScrollTopRef.current = scrollTop
    }, throttleMs),
    [calculateTransition, enabled, throttleMs]
  )

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container || !enabled) return

    window.addEventListener('resize', handleScroll)
    container.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleScroll)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, enabled])

  return {
    containerRef,
    heightLimitRef,
    transitionY,
  }
}
