"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
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
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowLeft
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"



export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch search results from Convex with enhanced search
  const searchData = useQuery(
    api.search.searchProducts,
    {
      query: searchQuery,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // Single category for now
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
      sortBy: sortBy
    }
  )

  const searchResults = searchData?.products || []
  const totalResults = searchData?.total || 0
  const hasMore = searchData?.hasMore || false

  // Track search analytics
  useEffect(() => {
    if (searchQuery && totalResults >= 0) {
      // Track search analytics (fire and forget)
      // Note: Analytics tracking removed to avoid hook rules violation
      // Consider implementing with a mutation or custom hook instead
      console.log('Search analytics:', {
        query: searchQuery,
        resultsCount: totalResults,
        filters: {
          category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
          sortBy: sortBy !== "relevance" ? sortBy : undefined
        }
      })
    }
  }, [searchQuery, totalResults, selectedCategories, priceRange, sortBy])

  // Fetch categories for filters
  const categories = useQuery(api.categories.getCategories, {}) || []

  // Use the filtered and sorted results directly from the search function
  const sortedResults = searchResults

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    )
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setCurrentPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const activeFiltersCount = selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Search Results</h1>
                {searchQuery && (
                  <p className="text-muted-foreground">
                    Showing results for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </form>
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
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Desktop Filters or Mobile Collapsible Filters */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Categories</Label>
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
                    <Label className="text-base font-medium">Price Range</Label>
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
                      <Label className="text-base font-medium">Active Filters</Label>
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
                            Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
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

          {/* Search Results */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? (
                      <>Search results for &quot;<strong className="text-foreground">{searchQuery}</strong>&quot;</>
                    ) : (
                      "All products"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Found {totalResults} product{totalResults !== 1 ? 's' : ''} • Page {currentPage}
                  </p>
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

              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Grid */}
            {sortedResults.length > 0 ? (
              <div className={`product-grid ${viewMode === 'list' ? 'product-grid-list' : ''}`}>
                {sortedResults.map((product) => (
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
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? `No results found for &quot;{searchQuery}&quot;` : "Start your search"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "Enter a search term to find products in our catalog."
                  }
                </p>

                {searchQuery && (
                  <div className="max-w-lg mx-auto space-y-4">
                    {/* Search Suggestions */}
                    <div>
                      <h4 className="font-medium mb-3">Try these suggestions:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(searchQuery + " accessories")}
                        >
                          {searchQuery} accessories
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(searchQuery + " kit")}
                        >
                          {searchQuery} kit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery("alternative " + searchQuery)}
                        >
                          alternative {searchQuery}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(searchQuery.split(' ')[0])}
                        >
                          {searchQuery.split(' ')[0]}
                        </Button>
                      </div>
                    </div>

                    {/* Popular Categories */}
                    <div>
                      <h4 className="font-medium mb-3">Or browse popular categories:</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {categories.slice(0, 4).map((category) => (
                          <Button
                            key={category._id}
                            variant="secondary"
                            size="sm"
                            asChild
                          >
                            <Link href={`/categories/${category.slug}`}>
                              {category.icon} {category.name}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <Button onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/products">Browse All Products</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && sortedResults.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}