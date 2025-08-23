"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  Download,
  Upload
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Fetch products
  const products = useQuery(api.products.getProducts, { limit: 1000 }) || []

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Status filter
    if (filterStatus === "active" && !product.isActive) return false
    if (filterStatus === "inactive" && product.isActive) return false
    if (filterStatus === "featured" && !product.isFeatured) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.createdAt || 0) - (a.createdAt || 0)
      case "oldest":
        return (a.createdAt || 0) - (b.createdAt || 0)
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(sortedProducts.map(p => p._id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      // TODO: Implement bulk delete
      toast.success(`${selectedProducts.length} products deleted`)
      setSelectedProducts([])
    }
  }

  const handleBulkStatusChange = async (status: boolean) => {
    if (selectedProducts.length === 0) return

    // TODO: Implement bulk status change
    toast.success(`${selectedProducts.length} products ${status ? 'activated' : 'deactivated'}`)
    setSelectedProducts([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <a href="/admin/products/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/admin/products/export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </a>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter(p => p.isActive).length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter(p => p.isFeatured).length}</div>
            <p className="text-sm text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {products.length > 0 ? Math.round((products.filter(p => (p.seoScore || 0) > 80).length / products.length) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">High SEO Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(true)}>
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(false)}>
                    Deactivate
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() => handleSelectProduct(product._id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <span className="text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {product.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-1">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{formatPrice(product.price)}</div>
                      {product.compareAtPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compareAtPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {product.seoScore !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            product.seoScore > 80 ? 'text-green-600' :
                            product.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {product.seoScore}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        {product.inventory?.quantity || 0} in stock
                      </div>
                      {product.inventory?.quantity <= (product.inventory?.lowStockThreshold || 0) && (
                        <div className="text-xs text-red-600">Low stock</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product._id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filters" : "Get started by adding your first product"}
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}