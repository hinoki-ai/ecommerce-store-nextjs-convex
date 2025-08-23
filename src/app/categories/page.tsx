"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Grid3X3,
  List,
  Package,
  ArrowRight,
  Filter
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch all categories
  const categories = useQuery(api.categories.getCategories, { includeInactive: false }) || []

  // Fetch product counts for each category
  const products = useQuery(api.products.getProducts, { limit: 1000 }) || []

  // Calculate product counts per category
  const categoryStats = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(p => p.categoryId === category._id)
    acc[category._id] = {
      productCount: categoryProducts.length,
      minPrice: categoryProducts.length > 0 ? Math.min(...categoryProducts.map(p => p.price)) : 0,
      maxPrice: categoryProducts.length > 0 ? Math.max(...categoryProducts.map(p => p.price)) : 0,
      avgPrice: categoryProducts.length > 0
        ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length
        : 0
    }
    return acc
  }, {} as Record<string, { productCount: number; minPrice: number; maxPrice: number; avgPrice: number }>)

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Product Categories</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Explore our complete collection organized by category
            </p>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? `No categories found for "${searchQuery}"` : "No categories available"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Categories will appear here once created"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredCategories.map((category) => {
              const stats = categoryStats[category._id] || { productCount: 0, minPrice: 0, maxPrice: 0, avgPrice: 0 }
              const categoryIcon = category.icon || "📦"

              return (
                <Link key={category._id} href={`/categories/${category.slug}`}>
                  <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}>
                    <CardContent className={viewMode === "list" ? "flex-1 p-4" : "p-6"}>
                      <div className={viewMode === "list" ? "flex items-center space-x-4" : ""}>
                        {/* Category Icon/Image */}
                        <div className={`flex-shrink-0 ${viewMode === "list" ? "w-16 h-16" : "w-20 h-20"} bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <span className="text-4xl">{categoryIcon}</span>
                        </div>

                        {/* Category Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            {viewMode === "grid" && (
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>

                          {category.description && (
                            <p className={`text-muted-foreground mb-3 ${
                              viewMode === "list" ? "line-clamp-2" : "line-clamp-3"
                            }`}>
                              {category.description}
                            </p>
                          )}

                          {/* Category Stats */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {stats.productCount} products
                                </span>
                              </div>
                              {stats.productCount > 0 && (
                                <Badge variant="secondary">
                                  {stats.productCount > 10 ? "Popular" : "New"}
                                </Badge>
                              )}
                            </div>

                            {stats.productCount > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {stats.minPrice > 0 && stats.maxPrice > 0 ? (
                                  <span>
                                    Price range: {formatPrice(stats.minPrice)} - {formatPrice(stats.maxPrice)}
                                    {stats.avgPrice > 0 && (
                                      <span className="ml-1">
                                        (avg: {formatPrice(stats.avgPrice)})
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span>Products starting from {formatPrice(stats.minPrice)}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Color indicator */}
                          {category.color && (
                            <div
                              className="w-4 h-4 rounded-full mt-2"
                              style={{ backgroundColor: category.color }}
                              title={`Category color: ${category.color}`}
                            />
                          )}
                        </div>

                        {viewMode === "list" && (
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Category Summary */}
        {filteredCategories.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {filteredCategories.length}
                </div>
                <p className="text-muted-foreground">Total Categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {filteredCategories.reduce((sum, cat) => sum + (categoryStats[cat._id]?.productCount || 0), 0)}
                </div>
                <p className="text-muted-foreground">Total Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {filteredCategories.filter(cat => (categoryStats[cat._id]?.productCount || 0) > 0).length}
                </div>
                <p className="text-muted-foreground">Active Categories</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}