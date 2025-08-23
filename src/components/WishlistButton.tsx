"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  size?: "sm" | "md" | "lg"
  variant?: "icon" | "full"
  className?: string
}

export function WishlistButton({
  productId,
  size = "md",
  variant = "icon",
  className
}: WishlistButtonProps) {
  const { isSignedIn, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Check if product is in wishlist
  const isInWishlist = useQuery(
    api.wishlists.isInWishlist,
    isSignedIn && user?.id ? { userId: user.id, productId } : "skip"
  ) || false

  // Mutations for adding/removing from wishlist
  const addToWishlist = useMutation(api.wishlists.addToWishlist)
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) {
      // TODO: Show sign-in modal or redirect to sign-in page
      console.log("User needs to sign in to use wishlist")
      return
    }

    if (!user?.id) return

    setIsLoading(true)

    try {
      if (isInWishlist) {
        await removeFromWishlist({ userId: user.id, productId })
      } else {
        await addToWishlist({ userId: user.id, productId })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size={size === "sm" ? "sm" : size === "md" ? "default" : "lg"}
        onClick={handleToggleWishlist}
        disabled={isLoading || !isSignedIn}
        className={cn(
          "flex items-center gap-2",
          isInWishlist && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
          className
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isInWishlist && "fill-current"
          )}
        />
        {isLoading ? "Cargando..." : isInWishlist ? "En Lista" : "Agregar a Lista"}
      </Button>
    )
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleToggleWishlist}
      disabled={isLoading || !isSignedIn}
      className={cn(
        sizeClasses[size],
        "rounded-full",
        isInWishlist && "bg-red-100 text-red-600 hover:bg-red-200",
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isInWishlist && "fill-current"
        )}
      />
    </Button>
  )
}

// Hook for getting wishlist status of multiple products
export function useWishlistStatus(productIds: string[]) {
  const { isSignedIn, user } = useAuth()

  const wishlistItems = useQuery(
    api.wishlists.getUserWishlist,
    isSignedIn && user?.id ? { userId: user.id } : "skip"
  ) || []

  const wishlistProductIds = new Set(wishlistItems.map(item => item.productId))

  return productIds.map(productId => ({
    productId,
    isInWishlist: wishlistProductIds.has(productId)
  }))
}