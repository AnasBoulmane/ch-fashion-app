import { memo } from 'react'
import { Img } from './Img'
import { Product } from '@/types/search'
import { i18n } from '@/lib/localization'
import { AddToWishlist } from './AddToWishlist'

import './ProductCard.css'
import { TryOnButton } from './TryOnButton'

type ProductCardProps = Product & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageData: any
  // display options
  withEcomEnabled: boolean
  withGreyBg: boolean
  isNewPriceDisplay: boolean
}

const WITHOUT_TRANSFORMATION = ''
export const PRODUCT_IMAGES_SRC_SET = '100,200,400,500,700,900,1100,1300'

export function shouldEnableNewFSHPriceDisplay({
  axisType,
  isNewPriceDisplay,
}: {
  axisType: string
  isNewPriceDisplay: boolean
}) {
  return isNewPriceDisplay && (axisType === 'fashion' || axisType === 'eyewear')
}

export const ProductCard = memo(
  ({
    code,
    link,
    name,
    axisType,
    description,
    refFshCode,
    imageData,
    analytics,
    price,
    priceMention,
    displayPriceMention,
    numberOfVariants,
    vtoActive,
    // display options
    withGreyBg,
    isNewPriceDisplay,
  }: ProductCardProps) => {
    const useFallbackTransformation = imageData && imageData.isAccessory && imageData.fallbackTransformation
    const transformationsPlain = useFallbackTransformation
      ? imageData.fallbackTransformation
      : imageData
        ? imageData.cloudinaryTransformation
        : ''
    const addGreyBg = useFallbackTransformation ? false : withGreyBg
    const priceDisplayEnabled = shouldEnableNewFSHPriceDisplay({ axisType, isNewPriceDisplay })
    const displayPrice =
      price && ((priceDisplayEnabled && displayPriceMention === 'PRICE') || (!priceDisplayEnabled && priceMention))

    return (
      <article data-id={code} data-analytics={JSON.stringify(analytics)} className="product--container relative">
        <p role="heading" aria-level={4}>
          <a id={code} className="product--link" href={link}>
            <span className={`product--media block select-none`}>
              {imageData && (
                <Img
                  className="absolute inset-0 w-full h-full select-none"
                  preloadedUrl={imageData.preloadedUrl}
                  baseUrl={imageData.baseUrl}
                  filename={imageData.path}
                  srcSet={PRODUCT_IMAGES_SRC_SET}
                  transformations={WITHOUT_TRANSFORMATION}
                  transformationsPlain={transformationsPlain}
                  withGreyBg={addGreyBg}
                  isNewSearchGrid
                />
              )}
            </span>
            {name && (
              <span role="presentation" className="heading is-cropped" data-product-element={'name'}>
                {name}
              </span>
            )}
            {description && (
              <p className="product--variant" data-product-element={'shades'}>
                {description}
              </p>
            )}
            {refFshCode && <span className="sr-only">{refFshCode}</span>}
          </a>
        </p>
        <div className="btn-group !p-1 absolute right-0 top-0">
          {vtoActive && <TryOnButton code={code} axisType={axisType} />}
          <AddToWishlist productAxisType={axisType} productCode={code} />
        </div>
        <div className="product--content txt-product">
          {numberOfVariants && numberOfVariants > 1 && (
            <p className="product--variant" data-product-element={'shades'}>
              {numberOfVariants} {i18n('product-colors')}
            </p>
          )}{' '}
          {displayPrice && (
            <p className="product--price" data-product-element={'price'}>
              {price}
            </p>
          )}
        </div>
      </article>
    )
  }
)

ProductCard.displayName = 'ProductCard'
