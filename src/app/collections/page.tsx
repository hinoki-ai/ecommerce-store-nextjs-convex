"use client"

// Force dynamic rendering to prevent build-time issues with Convex
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useQuery } from "convex/react"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  Star,
  TrendingUp,
  Calendar,
  Users,
  ShoppingBag,
  ArrowRight,
  Search,
  Grid3X3,
  List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { api } from "@/convex/_generated/api"

// Mock data for AI-generated collections - replace with actual Convex query
const mockCollections = [
  {
    _id: "1",
    name: "Summer Essentials 2024",
    slug: "summer-essentials-2024",
    description: "AI-curated collection of must-have summer items",
    image: "/api/placeholder/400/300",
    products: [
      { name: "Beach Towel", price: 29.99, image: "/api/placeholder/200/200" },
      { name: "Sunglasses", price: 89.99, image: "/api/placeholder/200/200" },
      { name: "Swim Shorts", price: 49.99, image: "/api/placeholder/200/200" },
    ],
    productCount: 25,
    totalValue: 1249.99,
    aiScore: 92,
    freshness: "new",
    tags: ["summer", "beach", "outdoor"],
    createdAt: Date.now() - 86400000 * 2,
    popularity: 95
  },
  {
    _id: "2",
    name: "Tech Gadgets Under $100",
    slug: "tech-gadgets-under-100",
    description: "Smart tech finds that won't break the bank",
    image: "/api/placeholder/400/300",
    products: [
      { name: "Bluetooth Earbuds", price: 39.99, image: "/api/placeholder/200/200" },
      { name: "Phone Stand", price: 19.99, image: "/api/placeholder/200/200" },
      { name: "LED Strip Lights", price: 24.99, image: "/api/placeholder/200/200" },
    ],
    productCount: 18,
    totalValue: 899.99,
    aiScore: 88,
    freshness: "trending",
    tags: ["tech", "gadgets", "budget"],
    createdAt: Date.now() - 86400000 * 5,
    popularity: 87
  },
  {
    _id: "3",
    name: "Home Office Revolution",
    slug: "home-office-revolution",
    description: "Everything you need for the perfect home office setup",
    image: "/api/placeholder/400/300",
    products: [
      { name: "Ergonomic Chair", price: 299.99, image: "/api/placeholder/200/200" },
      { name: "Standing Desk", price: 399.99, image: "/api/placeholder/200/200" },
      { name: "Monitor Arm", price: 79.99, image: "/api/placeholder/200/200" },
    ],
    productCount: 32,
    totalValue: 2199.99,
    aiScore: 95,
    freshness: "popular",
    tags: ["home office", "productivity", "ergonomic"],
    createdAt: Date.now() - 86400000 * 7,
    popularity: 91
  },
  {
    _id: "4",
    name: "Sustainable Living",
    slug: "sustainable-living",
    description: "Eco-friendly products for conscious consumers",
    image: "/api/placeholder/400/300",
    products: [
      { name: "Bamboo Toothbrush", price: 12.99, image: "/api/placeholder/200/200" },
      { name: "Reusable Straw Set", price: 15.99, image: "/api/placeholder/200/200" },
      { name: "Organic Cotton Tote", price: 24.99, image: "/api/placeholder/200/200" },
    ],
    productCount: 22,
    totalValue: 649.99,
    aiScore: 89,
    freshness: "featured",
    tags: ["sustainable", "eco-friendly", "green"],
    createdAt: Date.now() - 86400000 * 10,
    popularity: 78
  }
]

const getFreshnessBadge = (freshness: string) => {
  const variants = {
    new: "default",
    trending: "secondary",
    popular: "outline",
    featured: "destructive"
  } as const

  const colors = {
    new: "bg-blue-100 text-blue-800",
    trending: "bg-orange-100 text-orange-800",
    popular: "bg-purple-100 text-purple-800",
    featured: "bg-green-100 text-green-800"
  }

  return (
    <Badge variant={variants[freshness as keyof typeof variants]} className={colors[freshness as keyof typeof colors]}>
      {freshness.charAt(0).toUpperCase() + freshness.slice(1)}
    </Badge>
  )
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch collections from Convex
  const collections = useQuery(api.collections.getCollections, {}) || mockCollections

  // Filter and sort collections
  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterBy === "all" || collection.freshness === filterBy
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt
        case "oldest":
          return a.createdAt - b.createdAt
        case "popularity":
          return b.popularity - a.popularity
        case "ai-score":
          return b.aiScore - a.aiScore
        case "products":
          return b.productCount - a.productCount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">AI-Powered Collections</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Discover curated product collections generated by artificial intelligence
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>AI-Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community Favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{collections.length}</div>
              <p className="text-sm text-muted-foreground">AI Collections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {collections.reduce((sum, col) => sum + col.productCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(collections.reduce((sum, col) => sum + col.aiScore, 0) / collections.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg AI Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {collections.filter(col => col.freshness === 'trending').length}
              </div>
              <p className="text-sm text-muted-foreground">Trending Now</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="ai-score">AI Score</SelectItem>
                    <SelectItem value="products">Most Products</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className={`collections-grid ${viewMode === 'list' ? 'collections-grid-list' : ''}`}>
            {filteredCollections.map((collection) => (
              <Card key={collection._id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      {getFreshnessBadge(collection.freshness)}
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="secondary" className="bg-white/90 text-black">
                        {collection.productCount} items
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="text-white font-bold text-lg mb-2">{collection.name}</h3>
                      <p className="text-white/90 text-sm line-clamp-2">{collection.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Collection Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{collection.aiScore}%</div>
                      <div className="text-xs text-muted-foreground">AI Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{collection.popularity}%</div>
                      <div className="text-xs text-muted-foreground">Popular</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{formatPrice(collection.totalValue)}</div>
                      <div className="text-xs text-muted-foreground">Value</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Preview Products */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Featured Products</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {collection.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="text-center">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs font-medium truncate">{product.name}</p>
                          <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full">
                    <Link href={`/collections/${collection.slug}`}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Explore Collection
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No collections found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No AI-generated collections available at the moment"
                }
              </p>
              {(searchQuery || filterBy !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterBy("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Insights Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Collection Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Trend Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  AI analyzes market trends to create relevant collections
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">User Preferences</h4>
                <p className="text-sm text-muted-foreground">
                  Collections tailored to customer behavior patterns
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Seasonal Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Fresh collections for holidays and seasonal events
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Quality Scoring</h4>
                <p className="text-sm text-muted-foreground">
                  Each collection rated for relevance and appeal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}