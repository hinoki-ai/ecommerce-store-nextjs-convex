"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { CartErrorBoundary } from "@/components/ErrorBoundary"

interface ProductSummary {
  id: Id<"products">
  name: string
  slug: string
  price: number
  images: { url: string; alt: string }[]
  inventory: {
    quantity: number
    lowStockThreshold: number
    trackInventory: boolean
    allowBackorder: boolean
  }
}

interface CartItem {
  productId: Id<"products">
  quantity: number
  price: number
  addedAt: number
  product?: ProductSummary | null
}

interface Cart {
  _id: Id<"carts">
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  expiresAt?: number
  createdAt: number
  updatedAt: number
}

interface CartContextType {
  cart: Cart | null
  cartCount: number
  isLoading: boolean
  addToCart: (productId: Id<"products">, quantity: number, price: number) => Promise<void>
  removeFromCart: (productId: Id<"products">) => Promise<void>
  updateCartItemQuantity: (productId: Id<"products">, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartItemQuantity: (productId: Id<"products">) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  // Check if we're in build mode or should skip auth
  const shouldSkipAuth = () => {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return true // Skip during SSG/build
    }
    return process.env.SKIP_AUTH === 'true' || process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'
  }

  // If we should skip auth, provide a minimal cart context
  if (shouldSkipAuth()) {
    const fallbackContext: CartContextType = {
      cart: null,
      cartCount: 0,
      isLoading: false,
      addToCart: async () => {},
      removeFromCart: async () => {},
      updateCartItemQuantity: async () => {},
      clearCart: async () => {},
      getCartItemQuantity: () => 0
    }

    return (
      <CartErrorBoundary>
        <CartContext.Provider value={fallbackContext}>
          {children}
        </CartContext.Provider>
      </CartErrorBoundary>
    )
  }

  const { userId, isSignedIn } = useAuth()
  const [sessionId, setSessionId] = useState<string>("")
  const [cartId, setCartId] = useState<string | null>(null)

  // Generate session ID for guest users
  useEffect(() => {
    if (typeof window === 'undefined') return // Skip during SSR
    
    if (!isSignedIn && !sessionId) {
      const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
      localStorage.setItem("guest_session_id", newSessionId)
    } else if (isSignedIn && sessionId) {
      setSessionId("")
      localStorage.removeItem("guest_session_id")
    } else if (!isSignedIn && !sessionId) {
      const storedSessionId = localStorage.getItem("guest_session_id")
      if (storedSessionId) {
        setSessionId(storedSessionId)
      }
    }
  }, [isSignedIn, sessionId])

  // Mutations - wrapped in try-catch for build safety
  let getOrCreateCart, addToCartMutation, removeFromCartMutation, updateCartItemQuantityMutation, clearCartMutation;
  
  try {
    getOrCreateCart = useMutation(api.carts.getOrCreateCart)
    addToCartMutation = useMutation(api.carts.addToCart)
    removeFromCartMutation = useMutation(api.carts.removeFromCart)
    updateCartItemQuantityMutation = useMutation(api.carts.updateCartItemQuantity)
    clearCartMutation = useMutation(api.carts.clearCart)
  } catch (error) {
    console.warn('CartProvider: Convex mutations not available, providing fallback')
    // Provide dummy functions for build-time
    getOrCreateCart = async () => null
    addToCartMutation = async () => {}
    removeFromCartMutation = async () => {}
    updateCartItemQuantityMutation = async () => {}
    clearCartMutation = async () => {}
  }

  // Get or create cart when sessionId or userId is available
  useEffect(() => {
    const initializeCart = async () => {
      if ((sessionId || userId) && !cartId) {
        try {
          const cart = await getOrCreateCart({
            userId: userId || undefined,
            sessionId: sessionId || undefined
          })
          setCartId(cart._id)
        } catch (error) {
          console.error("Error initializing cart:", error)
        }
      }
    }
    initializeCart()
  }, [sessionId, userId, cartId, getOrCreateCart])

  // Query cart with details
  const cart = useQuery(
    api.carts.getCartWithDetails,
    cartId ? { cartId } : "skip"
  ) as Cart | null

  // Get cart count
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  const addToCart = async (productId: Id<"products">, quantity: number, price: number) => {
    try {
      // Ensure cart exists
      if (!cartId) {
        const cart = await getOrCreateCart({
          userId: userId || undefined,
          sessionId: sessionId || undefined
        })
        setCartId(cart._id)
      }

      if (cartId) {
        await addToCartMutation({
          cartId,
          productId,
          quantity,
          price
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (productId: Id<"products">) => {
    if (!cartId) return

    try {
      await removeFromCartMutation({
        cartId,
        productId
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const updateCartItemQuantity = async (productId: Id<"products">, quantity: number) => {
    if (!cartId) return

    try {
      await updateCartItemQuantityMutation({
        cartId,
        productId,
        quantity
      })
    } catch (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!cartId) return

    try {
      await clearCartMutation({ cartId })
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  const getCartItemQuantity = (productId: Id<"products">): number => {
    if (!cart) return 0
    const item = cart.items.find(item => item.productId === productId)
    return item?.quantity || 0
  }

  const value: CartContextType = {
    cart,
    cartCount,
    isLoading: false,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartItemQuantity
  }

  return (
    <CartErrorBoundary>
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
    </CartErrorBoundary>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}