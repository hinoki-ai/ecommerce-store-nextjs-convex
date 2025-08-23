"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  FileText,
  Folder,
  Calendar,
  User,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Mock data for demonstration
const mockBlogPosts = [
  {
    id: "blog-001",
    title: "Top 10 Products of 2024",
    slug: "top-10-products-2024",
    author: "Admin User",
    status: "published",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    views: 1250,
    seoScore: 85
  },
  {
    id: "blog-002",
    title: "How to Choose the Right Wireless Headphones",
    slug: "choosing-wireless-headphones",
    author: "Admin User",
    status: "draft",
    publishedAt: null,
    views: 0,
    seoScore: 72
  },
  {
    id: "blog-003",
    title: "Sustainable Shopping: Eco-Friendly Products",
    slug: "sustainable-shopping-guide",
    author: "Content Team",
    status: "published",
    publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    views: 890,
    seoScore: 91
  }
]

const mockCollections = [
  {
    id: "col-001",
    name: "Summer Electronics",
    slug: "summer-electronics",
    productCount: 15,
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    seoScore: 78
  },
  {
    id: "col-002",
    name: "Back to School",
    slug: "back-to-school",
    productCount: 8,
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    seoScore: 88
  },
  {
    id: "col-003",
    name: "Holiday Deals",
    slug: "holiday-deals",
    productCount: 25,
    status: "draft",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    seoScore: 0
  }
]

export default function AdminContentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Not published"
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Content Management</h2>
          <p className="text-gray-600">Manage blog posts, collections, and SEO content</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/admin/content/blog/new">
              <FileText className="h-4 w-4 mr-2" />
              New Blog Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/content/collection/new">
              <Folder className="h-4 w-4 mr-2" />
              New Collection
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockBlogPosts.length}</div>
            <p className="text-sm text-muted-foreground">Blog Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockCollections.length}</div>
            <p className="text-sm text-muted-foreground">Collections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {mockBlogPosts.filter(p => p.status === "published").length +
               mockCollections.filter(c => c.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round((mockBlogPosts.reduce((sum, post) => sum + (post.seoScore || 0), 0) +
                          mockCollections.reduce((sum, col) => sum + (col.seoScore || 0), 0)) /
                         (mockBlogPosts.length + mockCollections.length))}%
            </div>
            <p className="text-sm text-muted-foreground">Avg SEO Score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" className="space-y-4">
          {/* Blog Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="seo">SEO Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockBlogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {post.slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{post.author}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getStatusBadgeVariant(post.status)}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{post.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              post.seoScore > 80 ? 'text-green-600' :
                              post.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {post.seoScore}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(post.publishedAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                SEO Tools
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-4">
          {/* Collections Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="products">Most Products</SelectItem>
                      <SelectItem value="seo">SEO Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collections Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockCollections.map((collection) => (
                      <tr key={collection.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium">{collection.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {collection.slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{collection.productCount} products</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getStatusBadgeVariant(collection.status)}>
                            {collection.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              collection.seoScore > 80 ? 'text-green-600' :
                              collection.seoScore > 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {collection.seoScore || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(collection.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                SEO Tools
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Content Management Implementation</h3>
              <p className="text-blue-800 text-sm">
                This interface demonstrates the content management system structure.
                To fully implement this feature, you would need to:
              </p>
              <ul className="text-blue-800 text-sm mt-2 space-y-1">
                <li>• Create blog_posts and collections tables in Convex schema</li>
                <li>• Implement rich text editor for blog content</li>
                <li>• Add collection-product relationship management</li>
                <li>• Set up content scheduling and publishing workflows</li>
                <li>• Implement content SEO optimization tools</li>
                <li>• Add content analytics and performance tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}