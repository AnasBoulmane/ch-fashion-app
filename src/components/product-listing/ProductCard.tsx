import { memo } from 'react'
import { Img } from './Img'
import { Product } from '@/types/search'
import { i18n } from '@/lib/localization'
import { AddToWishlist } from './AddToWishlist'

type ProductCardProps = Product & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageData: any
  originalIndex: number
  // display options
  withEcomEnabled: boolean
  withGreyBg: boolean
  withProductName: boolean
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
    originalIndex,
    numberOfVariants,
    vtoActive,
    // display options
    withGreyBg,
    withProductName,
    isNewPriceDisplay,
  }: ProductCardProps) => {
    const dataTestView = (imageData && imageData.packshotID) || 'PACKSHOT_DEFAULT'
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
      <div
        className={`product--container ${withProductName ? 'fsh_with-product-name' : ''}`}
        data-test-view={dataTestView}
        data-analytics={JSON.stringify(analytics)}
        data-position-desktop={originalIndex}
        data-position-mobile={originalIndex}
      >
        <div data-product-element={'image'} className={`product--media js-propagate-link `}>
          {imageData && (
            <Img
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
        </div>
        <div className="btn-group !p-1">
          {vtoActive && (
            <button
              type="button"
              className="button is-icon is-vto-button js-vto-button vto-open"
              aria-describedby={code}
              data-id={code}
              data-axis={axisType}
              data-vto-ref={code}
              data-baseproduct={undefined}
            >
              <span className="text">{'config.search.tryOnButton'}</span>
            </button>
          )}

          <AddToWishlist productAxisType={axisType} productCode={code} />
        </div>
        <div className="product--content txt-product">
          <p role="heading" aria-level={4}>
            <a id={code} className="product--link" href={link}>
              {name && (
                <span role="presentation" className="heading is-cropped" data-product-element={'name'}>
                  {name}
                </span>
              )}
              {description && <span className="is-sr-only">{description}</span>}
              {refFshCode && <span className="is-sr-only">{refFshCode}</span>}
            </a>
          </p>

          {numberOfVariants && numberOfVariants > 1 && (
            <p className="product--variant" data-product-element={'shades'}>
              {numberOfVariants} {i18n('product-colors')}
            </p>
          )}
          {displayPrice && (
            <p className="product--price" data-product-element={'price'}>
              {price}
            </p>
          )}
        </div>
      </div>
    )
  }
)

ProductCard.displayName = 'ProductCard'
