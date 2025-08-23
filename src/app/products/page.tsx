"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  X,
  Grid3X3,
  List,
  ArrowUpDown,
  ChevronDown
} from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"
import { useLanguage } from "@/components/LanguageProvider"

export default function ProductsPage() {
  const { t } = useLanguage()

  // Mock categories for now - will be replaced with Convex query
  const mockCategories = [
    { _id: "electronics", name: t('categories.electronics'), slug: "electronics", icon: "🔌" },
    { _id: "clothing", name: t('categories.clothing'), slug: "clothing", icon: "👕" },
    { _id: "home-garden", name: t('categories.homeGarden'), slug: "home-garden", icon: "🏠" },
    { _id: "sports", name: t('categories.sports'), slug: "sports", icon: "⚽" },
    { _id: "books", name: t('categories.books'), slug: "books", icon: "📚" },
    { _id: "beauty", name: t('categories.beauty'), slug: "beauty", icon: "✨" }
  ]
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch products from Convex
  const products = useQuery(api.products.getProducts, {
    limit: itemsPerPage * currentPage,
    search: searchQuery || undefined
  }) || []

  // Fetch categories from Convex
  const categories = useQuery(api.categories.getCategories, {}) || mockCategories

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategories.length > 0 && product.categoryId) {
      const category = categories.find(cat => cat._id === product.categoryId)
      if (!category || !selectedCategories.includes(category.slug)) {
        return false
      }
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSearchQuery("")
    setCurrentPage(1)
  }

  const activeFiltersCount = selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('nav.products')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('product.browseProducts')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('cart.filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Desktop Filters or Mobile Collapsible Filters */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('cart.filters')}</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        {t('cart.clearFilters')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label>{t('cart.searchProducts')}</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('cart.searchProducts')}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <Label>{t('nav.categories')}</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.slug}
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={() => handleCategoryToggle(category.slug)}
                          />
                          <Label
                            htmlFor={category.slug}
                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                          >
                            <span>{category.icon}</span>
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>{t('cart.priceRange')}</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <Label>{t('cart.activeFilters')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((slug) => {
                          const category = categories.find(cat => cat.slug === slug)
                          return (
                            <Badge key={slug} variant="secondary" className="flex items-center gap-1">
                              {category?.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleCategoryToggle(slug)}
                              />
                            </Badge>
                          )
                        })}
                        {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {t('cart.price')}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setPriceRange([0, 1000])}
                            />
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {t('cart.showing')} {sortedProducts.length} {t('cart.products')}
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
                <Label htmlFor="sort" className="text-sm">{t('cart.sortBy')}:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('cart.newest')}</SelectItem>
                    <SelectItem value="price-low">{t('cart.priceLow')}</SelectItem>
                    <SelectItem value="price-high">{t('cart.priceHigh')}</SelectItem>
                    <SelectItem value="name">{t('cart.nameAZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className={`product-grid ${viewMode === 'list' ? 'product-grid-list' : ''}`}>
                {sortedProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">{t('cart.noProductsFound')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('cart.tryDifferentSearch')}
                </p>
                <Button onClick={clearFilters}>{t('cart.clearFilters')}</Button>
              </div>
            )}

            {/* Load More Button */}
            {products.length >= itemsPerPage * currentPage && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  {t('cart.loadMore')} {t('cart.products')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}