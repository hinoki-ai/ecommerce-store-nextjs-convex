"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { ProductCard } from "@/components/ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Grid3X3,
  List,
  Package,
  Filter,
  SlidersHorizontal,
  X
} from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch category details
  const category = useQuery(api.categories.getCategoryBySlug, { slug })

  // Fetch products in this category
  const allProducts = useQuery(api.products.getProducts, { limit: 1000 }) || []
  const categoryProducts = allProducts.filter(p => {
    if (!category) return false
    return p.categoryId === category._id
  })

  // Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
      default:
        return (b.createdAt || 0) - (a.createdAt || 0)
    }
  })

  // Pagination
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate category statistics
  const totalProducts = categoryProducts.length
  const activeProducts = categoryProducts.filter(p => p.isActive).length
  const avgPrice = totalProducts > 0
    ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts
    : 0
  const priceRange = totalProducts > 0 ? {
    min: Math.min(...categoryProducts.map(p => p.price)),
    max: Math.max(...categoryProducts.map(p => p.price))
  } : { min: 0, max: 0 }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/categories">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  All Categories
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-3xl">{category.icon || "📦"}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                {category.description && (
                  <p className="text-muted-foreground text-lg mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{totalProducts}</div>
                <div className="text-sm text-muted-foreground">Total Products</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(avgPrice)}</div>
                <div className="text-sm text-muted-foreground">Avg Price</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {priceRange.min > 0 ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}` : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Price Range</div>
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {totalProducts} product{totalProducts !== 1 ? 's' : ''} in {category.name}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              This category doesn't have any products yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categories">All Categories</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`product-grid ${viewMode === 'list' ? 'product-grid-list' : ''}`}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    _id: product._id,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
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
                  priority={currentPage === 1}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {sortedProducts.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {Math.ceil(sortedProducts.length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(sortedProducts.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Category Information */}
        {totalProducts > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">About this Category</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description || "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Products:</span>
                    <span className="ml-2 font-medium">{totalProducts}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active:</span>
                    <span className="ml-2 font-medium">{activeProducts}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Price:</span>
                    <span className="ml-2 font-medium">{formatPrice(avgPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price Range:</span>
                    <span className="ml-2 font-medium">
                      {priceRange.min > 0 ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}` : 'N/A'}
                    </span>
                  </div>
                </div>

                {category.color && (
                  <div>
                    <span className="text-sm text-muted-foreground">Category Color:</span>
                    <div
                      className="inline-block w-4 h-4 rounded-full ml-2 align-middle"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="ml-2 text-sm font-mono">{category.color}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryProducts
                    .filter(p => p.isFeatured || p.freshness?.isPopular)
                    .slice(0, 5)
                    .map((product) => (
                    <div key={product._id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex space-x-1">
                        {product.isFeatured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                        {product.freshness?.isPopular && <Badge variant="outline" className="text-xs">Popular</Badge>}
                      </div>
                    </div>
                  ))}
                  {categoryProducts.filter(p => p.isFeatured || p.freshness?.isPopular).length === 0 && (
                    <p className="text-sm text-muted-foreground">No featured products in this category</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}