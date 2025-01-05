import { i18n } from '@/lib/localization'
import { ProductCard } from './ProductCard'
import { Product } from '@/types/search'

type ProductGroup = {
  groupId: string | null
  products: Array<Product & { originalIndex: number }>
}

type ProductGroupProps = ProductGroup

/**
 * ProductGroup component: displays a group of products with a title (e.g. Accessories, Ready-to-wear, etc)
 * if groupId is not provided, the title will not be displayed
 * @param groupId - Product group ID
 * @param products - List of products
 * @returns JSX.Element
 **/
export const ProductGroup = ({ groupId, products }: ProductGroupProps) => {
  return (
    <>
      {groupId && (
        <div className="border-b border-neutral-200 mx-2.5 mb-9 pb-5 text-center md:mb-[3.375rem] md:pb-6 lg:mb-20 contain-paint">
          <h3 className="text-black font-abchanel font-bold text-xl leading-[26px] m-0 text-center contain-paint">
            {i18n(`${groupId}`.toLowerCase())}
          </h3>
        </div>
      )}
      <div
        className={`product-group product-group__${groupId} items-center flex flex-row flex-wrap justify-center m-0 w-full`}
      >
        {products &&
          products.map((productData) => (
            <ProductCard
              {...productData}
              key={productData.code}
              withGreyBg={productData.axisType !== 'fashion'}
              withEcomEnabled={productData.axisType !== 'fashion'}
              isNewPriceDisplay={true}
            />
          ))}
      </div>
    </>
  )
}

/**
 * Group products by product type (e.g. Accessories, Ready-to-wear, etc) using productTypeGroup property
 * @param productList - List of products
 * @returns ProductGroup[] - Grouped products by product type
 **/
export function groupByProductType(productList: Product[]): ProductGroup[] {
  return productList.reduce((productGroupedByType, { productTypeGroup, ...product }, originalIndex) => {
    let lastProductGroupRef = productGroupedByType[productGroupedByType.length - 1]
    if (!lastProductGroupRef || productTypeGroup !== lastProductGroupRef.groupId) {
      lastProductGroupRef = { groupId: productTypeGroup, products: [] }
      productGroupedByType.push(lastProductGroupRef)
    }
    lastProductGroupRef.products.push({ productTypeGroup, originalIndex, ...product })
    return productGroupedByType
  }, [] as ProductGroup[])
}
