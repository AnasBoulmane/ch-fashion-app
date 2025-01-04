// types.ts
export interface WishlistItem {
  productCode: string
  productAxisType: string
  addedAt: Date
}

// wishlistStore.ts - Using Zustand for state management
/* import create from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (item: WishlistItem) => Promise<void>
  removeItem: (productCode: string) => Promise<void>
  isInWishlist: (productCode: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item) => {
        set({ isLoading: true })
        try {
          await wishlistAPI.add(item) // Your API call
          set((state) => ({
            items: [...state.items, { ...item, addedAt: new Date() }],
          }))
        } catch (error) {
          console.error('Failed to add to wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productCode) => {
        set({ isLoading: true })
        try {
          await wishlistAPI.remove(productCode)
          set((state) => ({
            items: state.items.filter((item) => item.productCode !== productCode),
          }))
        } catch (error) {
          console.error('Failed to remove from wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      isInWishlist: (productCode) => {
        return get().items.some((item) => item.productCode === productCode)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
) */

// AddToWishlist.tsx
import { useCallback, useState } from 'react'
/* import { useWishlistStore } from './wishlistStore'
import { useAnalytics } from './hooks/useAnalytics' */
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
  /*   const { addItem, removeItem, isInWishlist, isLoading } = useWishlistStore()

  const { trackWishlistAction } = useAnalytics()

  const isActive = isInWishlist(productCode)

  const handleToggleWishlist = useCallback(async () => {
    if (isLoading) return

    try {
      if (isActive) {
        await removeItem(productCode)
        trackWishlistAction('remove', { productCode, productAxisType })
      } else {
        await addItem({ productCode, productAxisType, addedAt: new Date() })
        trackWishlistAction('add', { productCode, productAxisType })
      }
    } catch (error) {
      // Handle error (show toast notification, etc)
      console.error('Wishlist action failed:', error)
    }
  }, [productCode, productAxisType, isActive, isLoading]) */

  const [isActive, setIsActive] = useState(false)
  const [isLoading] = useState(false)

  const handleToggleWishlist = useCallback(async () => {
    setIsActive((prev) => !prev)
  }, [])

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-black m-1
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="sr-only">{isActive ? i18n('text-removeFromWishList') : i18n('text-addToWishList')}</span>
      <Icon name="star" className={isActive ? 'fill' : ''} />
      {/* <WishlistIcon className={`w-5 h-5 ${isActive ? 'fill-current' : 'stroke-current'}`} /> */}
    </button>
  )
}

// Optional HOC for handling unauthenticated users
/* export const withAuthProtection = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, openAuthModal } = useAuth()

    if (!isAuthenticated) {
      return (
        <button
          type="button"
          onClick={openAuthModal}
          className={props.className}
          aria-label="Sign in to add to wishlist"
        >
          <WishlistIcon className="w-5 h-5 stroke-current" />
          <span className="sr-only">Sign in to add to wishlist</span>
        </button>
      )
    }

    return <WrappedComponent {...props} />
  }
} */

// Usage with auth protection
/* export const ProtectedAddToWishlist = withAuthProtection(AddToWishlist)
function useAuth(): { isAuthenticated: any; openAuthModal: any } {
  throw new Error('Function not implemented.')
}
 */
