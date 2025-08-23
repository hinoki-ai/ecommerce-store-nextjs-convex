"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
// import { useAuth } from "@clerk/nextjs"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Heart,
  ShoppingCart,
  Trash2,
  Grid3X3,
  List,
  ArrowRight,
  Package,
  TrendingUp,
  Star
} from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function WishlistPage() {
  const { userId, isSignedIn } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [showClearDialog, setShowClearDialog] = useState(false)

  // Fetch wishlist data
  const wishlistItems = useQuery(
    api.wishlists.getWishlist,
    isSignedIn && userId ? { userId } : "skip"
  ) || []

  const wishlistStats = useQuery(
    api.wishlists.getWishlistStats,
    isSignedIn && userId ? { userId } : "skip"
  ) || null

  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist)

  // Sort wishlist items
  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (!a.product || !b.product) return 0

    switch (sortBy) {
      case "name":
        return a.product.name.localeCompare(b.product.name)
      case "price-low":
        return a.product.price - b.product.price
      case "price-high":
        return b.product.price - a.product.price
      case "newest":
      default:
        return b.addedAt - a.addedAt
    }
  })

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!userId) return

    try {
      await removeFromWishlist({ userId, productId })
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item")
    }
  }

  const handleClearWishlist = async () => {
    if (!userId) return

    try {
      // Remove all items from wishlist
      await Promise.all(
        wishlistItems.map(item =>
          removeFromWishlist({ userId, productId: item.productId })
        )
      )
      toast.success("Wishlist cleared")
      setShowClearDialog(false)
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      toast.error("Failed to clear wishlist")
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Please sign in to view and manage your wishlist.
            </p>
            <div className="space-y-3">
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <div>
                <Button variant="outline" asChild>
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button variant="outline" onClick={() => setShowClearDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {/* Wishlist Stats */}
        {wishlistStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{wishlistStats.totalItems}</div>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatPrice(wishlistStats.totalValue)}</div>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatPrice(wishlistStats.averagePrice)}</div>
                <p className="text-sm text-muted-foreground">Average Price</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{wishlistStats.featuredCount}</div>
                <p className="text-sm text-muted-foreground">Featured Items</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sort and View Controls */}
        {wishlistItems.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
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
                  <SelectItem value="newest">Recently Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start browsing and add items you love to your wishlist. We&apos;ll keep them here for you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/products">
                  Browse Products <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className={`product-grid ${viewMode === 'list' ? 'product-grid-list' : ''}`}>
            {sortedItems.map((item) => {
              if (!item.product) return null

              return (
                <div key={item._id} className="relative">
                  <ProductCard
                    product={{
                      _id: item.product._id,
                      name: item.product.name,
                      slug: item.product.slug,
                      description: "", // Could be added to wishlist item if needed
                      shortDescription: `Added ${new Date(item.addedAt).toLocaleDateString()}`,
                      price: item.product.price,
                      compareAtPrice: item.product.compareAtPrice,
                      images: item.product.images,
                      tags: [],
                      seoScore: 0,
                      isActive: item.product.isActive,
                      isFeatured: item.product.isFeatured,
                      freshness: item.product.freshness
                    }}
                    viewMode={viewMode}
                  />

                  {/* Remove from Wishlist Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Wishlist Summary */}
        {wishlistItems.length > 0 && wishlistStats && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Wishlist Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{wishlistStats.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Featured Items:</span>
                  <span className="font-medium">{wishlistStats.featuredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Popular Items:</span>
                  <span className="font-medium">{wishlistStats.popularCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{wishlistStats.categories}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Value:</span>
                    <span>{formatPrice(wishlistStats.totalValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/cart">
                    View Cart
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Share Wishlist
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Wishlist Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Average item price: {formatPrice(wishlistStats.averagePrice)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>{wishlistStats.featuredCount} featured items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Items from {wishlistStats.categories} categories</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Clear Wishlist Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all {wishlistItems.length} items from your wishlist?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearWishlist} className="bg-red-600 hover:bg-red-700">
              Clear Wishlist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}