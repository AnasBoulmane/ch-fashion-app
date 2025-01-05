import { useCallback } from 'react'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { i18n } from '@/lib/localization'
import { Icon } from '../common/Icon'

interface AddToWishlistProps {
  productCode: string
  productAxisType: string
  translations?: {
    addText?: string
    removeText?: string
    ariaLabel?: string
  }
  className?: string
}

export const AddToWishlist = ({ productCode, productAxisType, className = '' }: AddToWishlistProps) => {
  const { addItem, removeItem, isInWishlist, isLoading } = useWishlistStore()

  const isActive = isInWishlist(productCode)

  const handleToggleWishlist = useCallback(async () => {
    if (isLoading) return
    if (isActive) {
      await removeItem(productCode)
    } else {
      await addItem({ productCode, productAxisType, addedAt: new Date() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode, productAxisType, isActive, isLoading])

  const innerText = isActive ? i18n('text-removeFromWishList') : i18n('text-addToWishList')

  return (
    <button
      type="button"
      title={innerText}
      onClick={handleToggleWishlist}
      className={`
        inline-flex items-center justify-center p-1 rounded-full bg-white/70 text-black m-1 cursor-pointer
        ${className}
      `}
    >
      <span className="sr-only">{innerText}</span>
      <Icon name="star" className={isActive ? 'fill' : ''} />
    </button>
  )
}
