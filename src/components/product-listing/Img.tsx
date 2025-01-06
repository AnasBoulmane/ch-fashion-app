import { memo, useEffect, useRef, useState } from 'react'
import { generateImageSources } from '@/lib/helpers/img/src-gen'
import { cn } from '@/lib/helpers/css/cn'

type ImgProps = {
  // Core image props
  alt?: string
  srcSet?: string
  sizes?: string
  className?: string

  // Configuration
  transformations?: string
  transformationsPlain?: string
  baseUrl: string
  filename: string
  withGreyBg?: boolean
  isNewSearchGrid?: boolean

  // Loading & Accessibility
  preloadedUrl?: string
  longDescription?: string
  dataTest?: string

  // Callbacks
  onLoad?: () => void
  onError?: () => void
}

export const Img = memo(
  ({
    filename,
    baseUrl,
    preloadedUrl,
    className = '',
    alt = '',
    dataTest,
    srcSet,
    sizes,
    withGreyBg = false,
    isNewSearchGrid = false,
    transformations = '',
    transformationsPlain = '',
    longDescription,
    onLoad,
  }: ImgProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isVisible, setIsVisible] = useState<boolean | undefined>(undefined)
    const imageRef = useRef<HTMLImageElement>(null)

    // Modern intersection observer for visibility
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: '50px',
        }
      )

      if (imageRef.current) {
        observer.observe(imageRef.current)
      }

      return () => observer.disconnect()
    }, [])

    // Generate image sources
    const { src, srcSet: computedSrcSet } = generateImageSources({
      filename,
      baseUrl,
      srcSet,
      transformations,
      transformationsPlain,
      withGreyBg,
      isNewSearchGrid,
      preloadedUrl,
    })

    // Build dynamic attributes
    const dynamicAttributes: Record<string, string> = {}

    if (longDescription) {
      dynamicAttributes.longdesc = `#${new Date().getTime()}`
    }

    if (dataTest) {
      dynamicAttributes['data-test'] = dataTest
    }

    if (isNewSearchGrid) {
      if (isVisible) {
        dynamicAttributes['data-src'] = src
        dynamicAttributes.srcSet = computedSrcSet
        dynamicAttributes.sizes = imageRef.current
          ? `${imageRef.current.getBoundingClientRect()?.width || 400}px`
          : 'auto'
      } else {
        dynamicAttributes['data-src'] = src
        dynamicAttributes['data-srcset'] = computedSrcSet
        dynamicAttributes['data-sizes'] = 'auto'
      }
    }

    return (
      <>
        {isNewSearchGrid ? (
          <img
            ref={imageRef}
            style={{ opacity: isLoaded ? 1 : 0 }}
            className={cn([isVisible === undefined && 'is-lazy', className])}
            alt={alt}
            onLoad={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
            {...dynamicAttributes}
          />
        ) : (
          <img
            ref={imageRef}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 2.3s',
            }}
            srcSet={computedSrcSet}
            sizes={sizes}
            className={cn('is-lazy', isLoaded && 'fade in', className)}
            data-sizes="auto"
            alt={alt}
            onLoad={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
            {...dynamicAttributes}
          />
        )}

        {longDescription && <div className="sr-only">{longDescription}</div>}
      </>
    )
  }
)

Img.displayName = 'Img'
