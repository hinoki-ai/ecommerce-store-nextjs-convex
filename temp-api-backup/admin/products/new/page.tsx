"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Image as ImageIcon, Plus, X } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

interface ProductImage {
  url: string
  alt: string
  sortOrder: number
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  shortDescription: string
  sku: string
  categoryId: string
  price: number
  compareAtPrice: number
  cost: number
  taxRate: number
  inventory: {
    quantity: number
    lowStockThreshold: number
    trackInventory: boolean
    allowBackorder: boolean
  }
  images: ProductImage[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useMutation(api.products.createProduct)
  const categories = useQuery(api.categories.getCategories, {}) || []

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    categoryId: "",
    price: 0,
    compareAtPrice: 0,
    cost: 0,
    taxRate: 10,
    inventory: {
      quantity: 0,
      lowStockThreshold: 5,
      trackInventory: true,
      allowBackorder: false
    },
    images: [],
    tags: [],
    isActive: true,
    isFeatured: false
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInventoryChange = (field: keyof ProductFormData['inventory'], value: any) => {
    setFormData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [field]: value
      }
    }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const addImage = () => {
    const newImage: ProductImage = {
      url: "",
      alt: "",
      sortOrder: formData.images.length
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }))
  }

  const updateImage = (index: number, field: keyof ProductImage, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.slug || !formData.categoryId) {
        throw new Error("Please fill in all required fields")
      }

      // Create product
      const productId = await createProduct({
        ...formData,
        requiresShipping: true // Default to requiring shipping
      })

      toast.success("Product created successfully!")
      router.push(`/admin/products/${productId}/edit`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Add New Product</h2>
            <p className="text-gray-600">Create a new product in your catalog</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange("slug", e.target.value)}
                        placeholder="product-slug"
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateSlug}>
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    placeholder="Brief description for product listings"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed product description"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare at Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.compareAtPrice}
                      onChange={(e) => handleInputChange("compareAtPrice", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) => handleInputChange("cost", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value) || 0)}
                    placeholder="10.00"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Images</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex space-x-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={image.url}
                            onChange={(e) => updateImage(index, "url", e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Alt Text</Label>
                          <Input
                            value={image.alt}
                            onChange={(e) => updateImage(index, "alt", e.target.value)}
                            placeholder="Product image description"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {formData.images.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>No images added yet</p>
                    <p className="text-sm">Click &quot;Add Image&quot; to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & SKU */}
            <Card>
              <CardHeader>
                <CardTitle>Category & SKU</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Unique product identifier"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.inventory.quantity}
                    onChange={(e) => handleInventoryChange("quantity", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={formData.inventory.lowStockThreshold}
                    onChange={(e) => handleInventoryChange("lowStockThreshold", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trackInventory"
                      checked={formData.inventory.trackInventory}
                      onCheckedChange={(checked) => handleInventoryChange("trackInventory", checked)}
                    />
                    <Label htmlFor="trackInventory">Track inventory</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowBackorder"
                      checked={formData.inventory.allowBackorder}
                      onCheckedChange={(checked) => handleInventoryChange("allowBackorder", checked)}
                    />
                    <Label htmlFor="allowBackorder">Allow backorders</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active (visible to customers)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                  />
                  <Label htmlFor="isFeatured">Featured product</Label>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}