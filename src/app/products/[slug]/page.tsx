"use client"

// Force dynamic rendering to prevent build-time issues with Convex
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { api } from "@/convex/_generated/api"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"
import { ProductCard } from "@/components/ProductCard"
import { StarRating, ProductReviews } from "@/components/StarRating"
import { ProductRecommendations } from "@/components/ProductRecommendations"
import { useLanguage } from "@/components/LanguageProvider"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { addToCart } = useCart()
  const { t } = useLanguage()

  // Fetch product by slug
  const product = useQuery(api.products.getProductBySlug, { slug })

  // Fetch related products
  const relatedProducts = useQuery(api.products.getProducts, {
    limit: 4,
    featured: true
  }) || []

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return

    setIsAddingToCart(true)
    try {
      await addToCart(product._id, quantity, product.price)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('product.notFoundDesc')}
            </p>
            <Button asChild>
              <Link href="/products">{t('product.browseProducts')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const mainImage = product.images?.[0]
  const galleryImages = product.images || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.freshness?.isNew && (
                  <Badge variant="new">New</Badge>
                )}
                {product.freshness?.isFresh && (
                  <Badge variant="fresh">Fresh</Badge>
                )}
                {product.freshness?.isPopular && (
                  <Badge variant="popular">Popular</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="sale">-{discountPercentage}%</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">
                {product.shortDescription}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={4.2} size="md" />
              <span className="text-muted-foreground">(124 reviews)</span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Free Shipping</div>
                <div className="text-xs text-muted-foreground">On orders over $50</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Secure Payment</div>
                <div className="text-xs text-muted-foreground">SSL Protected</div>
              </div>
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-muted-foreground">30-day policy</div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium">Electronics</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {product.inventory?.quantity || 0} in stock
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2 font-medium">Premium Brand</span>
                </div>
              </div>
            </div>

            {/* SEO Score */}
            {product.seoScore !== undefined && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t('productDetail.seoOptimizationScore')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('productDetail.seoOptimizationDesc')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {product.seoScore}%
                    </div>
                    <div className={`text-sm ${
                      product.seoScore > 80 ? 'text-green-600' :
                      product.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.seoScore > 80 ? t('productDetail.excellent') :
                       product.seoScore > 60 ? t('productDetail.good') : t('productDetail.needsImprovement')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t('productDetail.description')}</TabsTrigger>
              <TabsTrigger value="specifications">{t('productDetail.specifications')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('productDetail.reviews')} (124)</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{t('productDetail.technicalSpecifications')}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('productDetail.dimensions')}:</span>
                          <span>10 × 8 × 3 inches</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('productDetail.weight')}:</span>
                          <span>2.5 lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('productDetail.material')}:</span>
                          <span>{t('productDetail.premiumQuality')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{t('productDetail.additionalFeatures')}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('productDetail.premiumQualityMaterials')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('productDetail.manufacturerWarranty')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{t('productDetail.freeShipping')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product._id}
                reviews={[]} // Mock empty reviews for now
                averageRating={4.2}
                totalReviews={124}
                ratingDistribution={{
                  5: 85,
                  4: 25,
                  3: 10,
                  2: 3,
                  1: 1
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* AI-Powered Product Recommendations */}
        <ProductRecommendations
          productId={product._id}
          category={product.categoryId}
          tags={product.tags}
          limit={8}
          title="You Might Also Like"
          showAIInsights={true}
        />
      </div>
    </div>
  )
}