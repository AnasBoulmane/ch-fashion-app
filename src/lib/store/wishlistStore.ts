import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistItem } from '@/types/wishlist'

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (item: WishlistItem) => Promise<void>
  removeItem: (productCode: string) => Promise<void>
  isInWishlist: (productCode: string) => boolean
}

// Simulate API calls
const wishlistAPI = {
  add: async (item: WishlistItem) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400))
  },
  remove: async (productCode: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
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
)
