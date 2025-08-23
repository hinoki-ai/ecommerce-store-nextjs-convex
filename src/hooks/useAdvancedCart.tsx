"use client"

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCart } from "./useCart"
import { toast } from "sonner"

interface SavedItem {
  productId: Id<"products">
  savedAt: number
  note?: string
}

interface CartRecommendation {
  productId: Id<"products">
  reason: 'frequently_bought' | 'similar' | 'trending'
  confidence: number
}

interface AdvancedCartContextType {
  // Saved for later functionality
  savedItems: SavedItem[]
  saveForLater: (productId: Id<"products">, note?: string) => Promise<void>
  moveToCart: (productId: Id<"products">, quantity?: number) => Promise<void>
  removeSavedItem: (productId: Id<"products">) => Promise<void>
  
  // Bulk operations
  selectedItems: Set<Id<"products">>
  toggleItemSelection: (productId: Id<"products">) => void
  selectAllItems: () => void
  clearSelection: () => void
  bulkRemove: () => Promise<void>
  bulkSaveForLater: () => Promise<void>
  
  // Advanced features
  getCartRecommendations: () => CartRecommendation[]
  duplicateCart: () => Promise<void>
  shareCart: () => Promise<string>
  
  // Cart analytics
  cartValue: number
  potentialSavings: number
  cartAge: number // milliseconds since first item added
  
  // Recovery features
  hasAbandonedCart: boolean
  abandonedCartValue: number
  recoverAbandonedCart: () => Promise<void>
}

const AdvancedCartContext = createContext<AdvancedCartContextType | undefined>(undefined)

export function AdvancedCartProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth()
  const { cart, addToCart, removeFromCart } = useCart()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<Id<"products">>>(new Set())
  const [recommendations, setRecommendations] = useState<CartRecommendation[]>([])

  // Convex mutations for saved items
  const saveItemForLater = useMutation(api.wishlists.saveForLater)
  const removeFromSaved = useMutation(api.wishlists.removeFromSaved)
  const getSavedItems = useQuery(
    api.wishlists.getSavedForLater,
    userId ? { userId } : "skip"
  )

  // Load saved items
  useEffect(() => {
    if (getSavedItems) {
      setSavedItems(getSavedItems)
    }
  }, [getSavedItems])

  // Generate recommendations based on cart contents
  useEffect(() => {
    if (cart?.items.length) {
      generateRecommendations()
    }
  }, [cart?.items])

  const generateRecommendations = useCallback(async () => {
    if (!cart?.items.length) return

    try {
      // This would typically call an AI recommendation service
      // For now, we'll simulate recommendations
      const mockRecommendations: CartRecommendation[] = [
        {
          productId: cart.items[0].productId, // This would be a different product in reality
          reason: 'frequently_bought',
          confidence: 0.85
        }
      ]
      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
    }
  }, [cart?.items])

  const saveForLater = async (productId: Id<"products">, note?: string) => {
    try {
      // Remove from cart first
      await removeFromCart(productId)
      
      // Add to saved items
      if (userId) {
        await saveItemForLater({ 
          userId, 
          productId, 
          note: note || undefined 
        })
      } else {
        // For guest users, save to localStorage
        const guestSaved = localStorage.getItem('guest_saved_items')
        const saved = guestSaved ? JSON.parse(guestSaved) : []
        saved.push({
          productId,
          savedAt: Date.now(),
          note
        })
        localStorage.setItem('guest_saved_items', JSON.stringify(saved))
        setSavedItems(saved)
      }
      
      toast.success("Item saved for later")
    } catch (error) {
      console.error("Failed to save for later:", error)
      toast.error("Failed to save item")
    }
  }

  const moveToCart = async (productId: Id<"products">, quantity = 1) => {
    try {
      // Get product details to get price
      // This would typically require a product query
      const defaultPrice = 0 // You'd get this from a product query
      
      await addToCart(productId, quantity, defaultPrice)
      await removeSavedItem(productId)
      
      toast.success("Item moved to cart")
    } catch (error) {
      console.error("Failed to move to cart:", error)
      toast.error("Failed to move item to cart")
    }
  }

  const removeSavedItem = async (productId: Id<"products">) => {
    try {
      if (userId) {
        await removeFromSaved({ userId, productId })
      } else {
        const guestSaved = localStorage.getItem('guest_saved_items')
        if (guestSaved) {
          const saved = JSON.parse(guestSaved)
          const filtered = saved.filter((item: SavedItem) => item.productId !== productId)
          localStorage.setItem('guest_saved_items', JSON.stringify(filtered))
          setSavedItems(filtered)
        }
      }
    } catch (error) {
      console.error("Failed to remove saved item:", error)
      toast.error("Failed to remove item")
    }
  }

  const toggleItemSelection = (productId: Id<"products">) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const selectAllItems = () => {
    if (cart?.items) {
      setSelectedItems(new Set(cart.items.map(item => item.productId)))
    }
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  const bulkRemove = async () => {
    if (selectedItems.size === 0) return

    try {
      const promises = Array.from(selectedItems).map(productId => 
        removeFromCart(productId)
      )
      await Promise.all(promises)
      
      setSelectedItems(new Set())
      toast.success(`Removed ${selectedItems.size} items from cart`)
    } catch (error) {
      console.error("Failed to bulk remove:", error)
      toast.error("Failed to remove selected items")
    }
  }

  const bulkSaveForLater = async () => {
    if (selectedItems.size === 0) return

    try {
      const promises = Array.from(selectedItems).map(productId => 
        saveForLater(productId)
      )
      await Promise.all(promises)
      
      setSelectedItems(new Set())
      toast.success(`Saved ${selectedItems.size} items for later`)
    } catch (error) {
      console.error("Failed to bulk save:", error)
      toast.error("Failed to save selected items")
    }
  }

  const getCartRecommendations = () => recommendations

  const duplicateCart = async () => {
    if (!cart?.items.length) return

    try {
      const promises = cart.items.map(item => 
        addToCart(item.productId, item.quantity, item.price)
      )
      await Promise.all(promises)
      
      toast.success("Cart duplicated successfully")
    } catch (error) {
      console.error("Failed to duplicate cart:", error)
      toast.error("Failed to duplicate cart")
    }
  }

  const shareCart = async (): Promise<string> => {
    if (!cart?.items.length) throw new Error("Cart is empty")

    try {
      // Generate a shareable cart URL
      const cartData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        sharedAt: Date.now()
      }
      
      // In a real implementation, you'd save this to a database and return a short URL
      const shareId = btoa(JSON.stringify(cartData)).substring(0, 12)
      const shareUrl = `${window.location.origin}/cart/shared/${shareId}`
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Cart link copied to clipboard")
      
      return shareUrl
    } catch (error) {
      console.error("Failed to share cart:", error)
      toast.error("Failed to share cart")
      throw error
    }
  }

  // Cart analytics
  const cartValue = cart?.total || 0
  const potentialSavings = cart?.items.reduce((savings, item) => {
    // Calculate potential savings from bulk discounts, etc.
    const bulkDiscount = item.quantity >= 3 ? item.price * 0.1 : 0
    return savings + (bulkDiscount * item.quantity)
  }, 0) || 0

  const cartAge = cart?.items.length ? 
    Math.min(...cart.items.map(item => Date.now() - item.addedAt)) : 0

  // Abandoned cart detection
  const hasAbandonedCart = cartAge > 30 * 60 * 1000 && cart?.items.length > 0 // 30 minutes
  const abandonedCartValue = hasAbandonedCart ? cartValue : 0

  const recoverAbandonedCart = async () => {
    if (!hasAbandonedCart) return

    // Track abandoned cart recovery
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'abandoned_cart_recovery', {
        event_category: 'ecommerce',
        value: cartValue,
        items: cart?.items.length
      })
    }

    toast.success("Welcome back! Your cart has been restored.")
  }

  const value: AdvancedCartContextType = {
    savedItems,
    saveForLater,
    moveToCart,
    removeSavedItem,
    
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    bulkRemove,
    bulkSaveForLater,
    
    getCartRecommendations,
    duplicateCart,
    shareCart,
    
    cartValue,
    potentialSavings,
    cartAge,
    
    hasAbandonedCart,
    abandonedCartValue,
    recoverAbandonedCart
  }

  return (
    <AdvancedCartContext.Provider value={value}>
      {children}
    </AdvancedCartContext.Provider>
  )
}

export function useAdvancedCart() {
  const context = useContext(AdvancedCartContext)
  if (context === undefined) {
    throw new Error("useAdvancedCart must be used within an AdvancedCartProvider")
  }
  return context
}