"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Star, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { WishlistButton } from "@/components/WishlistButton"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"
import { StockIndicator } from "@/components/StockIndicator"
import { useLanguage } from "@/components/LanguageProvider"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: Array<{
    url: string
    alt: string
  }>
  tags: string[]
  seoScore?: number
  isActive: boolean
  isFeatured: boolean
  isNew?: boolean
  isPopular?: boolean
  freshness?: {
    isFresh?: boolean
    isNew?: boolean
    isPopular?: boolean
  }
}

interface ProductCardProps {
  product: Product
  priority?: boolean
  showQuickActions?: boolean
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, priority = false, showQuickActions = true, viewMode = "grid" }: ProductCardProps) {
  const { t } = useLanguage();
  const [isHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart, getCartItemQuantity } = useCart()

  const cartItemQuantity = getCartItemQuantity(product._id as any)

  const mainImage = product.images[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  // Wishlist functionality is now handled by WishlistButton component

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToCart) return

    setIsAddingToCart(true)
    try {
      await addToCart(product._id as any, 1, product.price)
      toast.success(`${product.name} ${t('success.addedToCart')}`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error(t('common.error'))
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="product-card-list group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <Link href={`/products/${product.slug}`} className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-shrink-0">
            {/* Product Image */}
            <div className="product-image aspect-square w-32 sm:w-24 overflow-hidden bg-gray-100 rounded-lg">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                  sizes="(max-width: 768px) 128px, 96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-400 text-xs">{t('productCard.noImage')}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {hasDiscount && (
                <Badge variant="sale" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.freshness?.isNew && (
                <Badge variant="new" className="text-xs">
                  {t('productCard.new')}
                </Badge>
              )}
              {product.freshness?.isFresh && (
                <Badge variant="fresh" className="text-xs">
                  {t('productCard.fresh')}
                </Badge>
              )}
              {product.freshness?.isPopular && (
                <Badge variant="popular" className="text-xs">
                  {t('productCard.popular')}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {showQuickActions && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <WishlistButton productId={product._id} size="sm" />
                </div>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="price font-semibold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="original-price text-sm">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(0)</span>
            </div>

            {/* Stock Status */}
            {product.inventory && (
              <StockIndicator
                quantity={product.inventory.quantity}
                lowStockThreshold={product.inventory.lowStockThreshold}
                allowBackorder={product.inventory.allowBackorder}
                trackInventory={product.inventory.trackInventory}
                size="sm"
              />
            )}

            {/* SEO Score (for admin view) */}
            {product.seoScore !== undefined && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('productCard.seoScore')}</span>
                <span className={`font-medium ${product.seoScore > 80 ? 'text-green-600' : product.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.seoScore}%
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Quick Actions for List View */}
        {showQuickActions && (
          <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isAddingToCart ? t('productCard.adding') : t('product.addToCart')}
              {cartItemQuantity > 0 && !isAddingToCart && (
                <Badge variant="secondary" className="ml-2">
                  {cartItemQuantity}
                </Badge>
              )}
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    )
  }

  // Grid View (original layout)
  return (
    <Card
      className="product-card group relative overflow-hidden transition-all duration-300 hover:shadow-lg"

    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative">
          {/* Product Image */}
          <div className="product-image aspect-square overflow-hidden bg-gray-100">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <span className="text-gray-400">{t('productCard.noImage')}</span>
              </div>
            )}

            {/* Overlay on hover */}
            {isHovered && showQuickActions && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" className="opacity-90">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="opacity-90"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemQuantity > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItemQuantity}
                    </Badge>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="sale" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.freshness?.isNew && (
              <Badge variant="new" className="text-xs">
                {t('productCard.new')}
              </Badge>
            )}
            {product.freshness?.isFresh && (
              <Badge variant="fresh" className="text-xs">
                {t('productCard.fresh')}
              </Badge>
            )}
            {product.freshness?.isPopular && (
              <Badge variant="popular" className="text-xs">
                {t('productCard.popular')}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          {showQuickActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton productId={product._id} size="sm" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {product.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="price font-semibold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="original-price text-sm">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(0)</span>
            </div>

            {/* Stock Status */}
            {product.inventory && (
              <StockIndicator
                quantity={product.inventory.quantity}
                lowStockThreshold={product.inventory.lowStockThreshold}
                allowBackorder={product.inventory.allowBackorder}
                trackInventory={product.inventory.trackInventory}
                size="sm"
              />
            )}

            {/* SEO Score (for admin view) */}
            {product.seoScore !== undefined && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('productCard.seoScore')}</span>
                <span className={`font-medium ${product.seoScore > 80 ? 'text-green-600' : product.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.seoScore}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}