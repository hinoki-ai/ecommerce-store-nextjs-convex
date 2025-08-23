"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  Plus,
  Minus,
  Share2,
  Compare,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useAdvancedCart } from "@/hooks/useAdvancedCart"
import { RealTimeInventory } from "./RealTimeInventory"
import { WishlistButton } from "./WishlistButton"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"

interface Product {
  _id: Id<"products">
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: Array<{
    url: string
    alt: string
  }>
  inventory: {
    quantity: number
    lowStockThreshold: number
  }
  isActive: boolean
  isFeatured: boolean
  averageRating?: number
  reviewCount?: number
  tags: string[]
}

interface EnhancedProductCardProps {
  product: Product
  priority?: boolean
  showQuickAdd?: boolean
  showInventory?: boolean
  showSocialProof?: boolean
  showRecommendedBadge?: boolean
  onQuickView?: (productId: Id<"products">) => void
  onCompare?: (productId: Id<"products">) => void
}

export function EnhancedProductCard({
  product,
  priority = false,
  showQuickAdd = true,
  showInventory = true,
  showSocialProof = true,
  showRecommendedBadge = false,
  onQuickView,
  onCompare
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { addToCart, getCartItemQuantity } = useCart()
  const { saveForLater } = useAdvancedCart()
  
  const cartQuantity = getCartItemQuantity(product._id)
  const mainImage = product.images[currentImageIndex] || product.images[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleQuickAdd = async () => {
    setIsAddingToCart(true)
    try {
      await addToCart(product._id, quantity, product.price)
      toast.success(`Added ${quantity} ${product.name} to cart`)
      
      // Track add to cart event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: product.price * quantity,
          items: [{
            item_id: product._id,
            item_name: product.name,
            category: 'products',
            quantity: quantity,
            price: product.price
          }]
        })
      }
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleSaveForLater = async () => {
    try {
      await saveForLater(product._id)
    } catch (error) {
      toast.error("Failed to save item")
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ${formatPrice(product.price)}`,
          url: `/products/${product.slug}`
        })
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`)
        toast.success("Product link copied to clipboard")
      }
      
      // Track share event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'share', {
          method: 'clipboard',
          content_type: 'product',
          item_id: product._id
        })
      }
    } catch (error) {
      toast.error("Failed to share product")
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
            {showRecommendedBadge && (
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 z-10 flex flex-col gap-1"
          >
            <WishlistButton
              productId={product._id}
              size="sm"
              variant="ghost"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            />
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            {onQuickView && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onQuickView(product._id)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-2"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            {onCompare && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCompare(product._id)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-2"
              >
                <Compare className="h-4 w-4" />
              </Button>
            )}
          </motion.div>

          {/* Main Product Image */}
          <Link href={`/products/${product.slug}`}>
            <div className="relative w-full h-full">
              <Image
                src={mainImage?.url || '/placeholder-product.jpg'}
                alt={mainImage?.alt || product.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Image Navigation for Multiple Images */}
              {product.images.length > 1 && isHovered && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentImageIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* Quick Add to Cart Overlay */}
          {showQuickAdd && isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-2 right-2 z-10"
            >
              {cartQuantity > 0 ? (
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg p-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      setQuantity(Math.max(1, quantity - 1))
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="flex-1 text-center text-sm font-medium">
                    {cartQuantity} in cart
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      setQuantity(quantity + 1)
                      handleQuickAdd()
                    }}
                    disabled={isAddingToCart}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    handleQuickAdd()
                  }}
                  disabled={isAddingToCart}
                  className="w-full h-9 bg-primary/95 backdrop-blur-sm hover:bg-primary"
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Quick Add
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Product Title */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors group-hover:underline">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            {product.averageRating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.averageRating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Real-time Inventory */}
            {showInventory && (
              <RealTimeInventory
                productId={product._id}
                showNotifications={false}
                showSocialProof={showSocialProof}
                showTrendingIndicator={true}
              />
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveForLater}
                className="text-xs"
              >
                Save for Later
              </Button>
              
              <Link href={`/products/${product.slug}`}>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}