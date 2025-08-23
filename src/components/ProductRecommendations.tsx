"use client"

import { useQuery } from "convex/react"
import { Sparkles, ArrowRight, ShoppingCart, Heart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { api } from "@/convex/_generated/api"
import { ProductCard } from "./ProductCard"

interface ProductRecommendationsProps {
  productId?: string
  category?: string
  tags?: string[]
  limit?: number
  title?: string
  showAIInsights?: boolean
}

interface RecommendedProduct {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: Array<{ url: string; alt: string }>
  shortDescription: string
  seoScore?: number
  isActive: boolean
  isFeatured: boolean
  freshness?: {
    isNew?: boolean
    isPopular?: boolean
  }
  tags: string[]
  categoryId?: string
  category?: {
    name: string
    slug: string
  }
}

export function ProductRecommendations({
  productId,
  category,
  tags = [],
  limit = 8,
  title = "Recommended for You",
  showAIInsights = true
}: ProductRecommendationsProps) {
  // Fetch AI-powered recommendations
  const recommendations = useQuery(
    api.products.getProductRecommendations,
    {
      productId: productId || undefined,
      category: category || undefined,
      tags: tags.length > 0 ? tags : undefined,
      limit
    }
  ) || []

  // Mock recommendations for demonstration
  const mockRecommendations: RecommendedProduct[] = [
    {
      _id: "1",
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      price: 199.99,
      compareAtPrice: 249.99,
      images: [{ url: "/api/placeholder/300/300", alt: "Premium Wireless Headphones" }],
      shortDescription: "High-quality wireless headphones with noise cancellation",
      seoScore: 92,
      isActive: true,
      isFeatured: true,
      freshness: { isPopular: true },
      tags: ["electronics", "audio", "wireless"],
      categoryId: "electronics",
      category: { name: "Electronics", slug: "electronics" }
    },
    {
      _id: "2",
      name: "Ergonomic Office Chair",
      slug: "ergonomic-office-chair",
      price: 299.99,
      images: [{ url: "/api/placeholder/300/300", alt: "Ergonomic Office Chair" }],
      shortDescription: "Comfortable chair designed for all-day productivity",
      seoScore: 88,
      isActive: true,
      isFeatured: false,
      freshness: { isNew: true },
      tags: ["furniture", "office", "ergonomic"],
      categoryId: "furniture",
      category: { name: "Furniture", slug: "furniture" }
    },
    {
      _id: "3",
      name: "Smart Fitness Tracker",
      slug: "smart-fitness-tracker",
      price: 89.99,
      images: [{ url: "/api/placeholder/300/300", alt: "Smart Fitness Tracker" }],
      shortDescription: "Track your health and fitness goals with precision",
      seoScore: 95,
      isActive: true,
      isFeatured: true,
      freshness: { isPopular: true },
      tags: ["fitness", "health", "smart"],
      categoryId: "fitness",
      category: { name: "Fitness", slug: "fitness" }
    },
    {
      _id: "4",
      name: "Organic Coffee Beans",
      slug: "organic-coffee-beans",
      price: 24.99,
      compareAtPrice: 29.99,
      images: [{ url: "/api/placeholder/300/300", alt: "Organic Coffee Beans" }],
      shortDescription: "Premium organic coffee with rich flavor",
      seoScore: 87,
      isActive: true,
      isFeatured: false,
      tags: ["food", "organic", "beverages"],
      categoryId: "food",
      category: { name: "Food & Beverages", slug: "food-beverages" }
    }
  ]

  const displayRecommendations = recommendations.length > 0 ? recommendations : mockRecommendations.slice(0, limit)

  if (displayRecommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showAIInsights && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered</span>
            </div>
          )}
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/products">
            View All Products
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* AI Insights */}
      {showAIInsights && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-primary">AI Recommendation Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Based on your browsing history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Popular in your region</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>High customer satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Grid */}
      <div className="product-grid">
        {displayRecommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              _id: product._id,
              name: product.name,
              slug: product.slug,
              description: product.shortDescription,
              shortDescription: product.shortDescription,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              images: product.images,
              tags: product.tags,
              seoScore: product.seoScore,
              isActive: product.isActive,
              isFeatured: product.isFeatured,
              freshness: product.freshness
            }}
            priority={false}
            showRecommendationBadge={true}
          />
        ))}
      </div>

      {/* View More Section */}
      <div className="text-center">
        <Card className="bg-muted/30">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Discover More</h3>
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Explore our complete collection of products tailored just for you
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/products">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Browse All Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/wishlist">
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Quick Recommendations Component for smaller spaces
export function QuickRecommendations({
  productId,
  limit = 4
}: {
  productId?: string
  limit?: number
}) {
  const recommendations = useQuery(
    api.products.getProductRecommendations,
    {
      productId: productId || undefined,
      limit
    }
  ) || []

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Frequently Bought Together</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.slice(0, limit).map((product: RecommendedProduct) => (
          <Link key={product._id} href={`/products/${product.slug}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.seoScore && product.seoScore > 80 && (
                    <Badge variant="secondary" className="text-xs">
                      {product.seoScore}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}