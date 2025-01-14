import { Product } from '@/types/search'
import { groupByProductType, ProductGroup } from './ProductGroup'
import { i18n } from '@/lib/localization'

import './ProductGrid.css'

type ProductGridProps = {
  products: Product[]
  totalCount?: number
  axis?: string
}

export const ProductGrid = ({ products: productList, totalCount }: ProductGridProps) => {
  const productGroups = groupByProductType(productList)
  return (
    <div className={`product-list eyewear-product-list nw-product-grid w-full`}>
      <div className={`products-wrapper w-full`}>
        <div role="heading" aria-level={3} className="sr-only">
          {i18n('search-product-content', totalCount)}
        </div>
        <div className="product-grid grid-listing-container flex-col">
          {productGroups.map(({ groupId, products }, index) => (
            <ProductGroup key={index} groupId={groupId} products={products} />
          ))}
        </div>
      </div>
    </div>
  )
}
