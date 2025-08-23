'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Zap,
  FileText,
  Tags,
  Globe,
  Search,
  TrendingUp,
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  tags: string;
  seoScore: number;
  optimizedTitle?: string;
  optimizedDescription?: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tags: string;
  isHoliday: boolean;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

interface SEOStats {
  totalProducts: number;
  optimizedProducts: number;
  totalCollections: number;
  totalBlogs: number;
  averageSeoScore: number;
}

export default function SEODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<SEOStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Product optimization form
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: '',
    price: ''
  });

  // Blog generation form
  const [blogForm, setBlogForm] = useState({
    topic: '',
    products: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats, products, collections, and blogs
      const [statsRes, productsRes, collectionsRes, blogsRes] = await Promise.all([
        fetch('/api/admin/seo-stats').then(r => r.json()),
        fetch('/api/products?limit=50').then(r => r.json()),
        fetch('/api/seo/generate-collections').then(r => r.json()),
        fetch('/api/seo/generate-blog?limit=20').then(r => r.json())
      ]);

      setStats(statsRes.stats);
      setProducts(productsRes.products || []);
      setCollections(collectionsRes.collections || []);
      setBlogs(blogsRes.blogs || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const optimizeProduct = async () => {
    if (!productForm.title || !productForm.description) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/seo/optimize-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      const result = await response.json();
      if (result.success) {
        alert('Product optimized successfully!');
        setProductForm({ title: '', description: '', category: '', price: '' });
        loadDashboardData();
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Error optimizing product');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCollections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seo/generate-collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Generated ${result.collectionsCreated} collections!`);
        loadDashboardData();
      }
    } catch (error) {
      console.error('Collection generation error:', error);
      alert('Error generating collections');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlog = async () => {
    if (!blogForm.topic) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/seo/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: blogForm.topic,
          products: products.slice(0, 10) // Use first 10 products for linking
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Blog generated successfully!');
        setBlogForm({ topic: '', products: '' });
        loadDashboardData();
      }
    } catch (error) {
      console.error('Blog generation error:', error);
      alert('Error generating blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered SEO Dashboard
          </h1>
          <p className="text-gray-600">
            Implement the shotgun SEO approach with AI-generated optimization
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* SEO Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.optimizedProducts || 0} optimized
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collections</CardTitle>
                  <Tags className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCollections || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    AI-generated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalBlogs || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    With internal links
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.averageSeoScore || 0}%</div>
                  <Progress value={stats?.averageSeoScore || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={generateCollections}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Generate Collections
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab('products')}
                  >
                    Optimize Products
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent SEO Activity</CardTitle>
                <CardDescription>
                  Latest optimizations and generations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-600">SEO Score: {product.seoScore}%</p>
                      </div>
                      <Badge variant={product.seoScore > 80 ? 'default' : 'secondary'}>
                        {product.seoScore > 80 ? 'Optimized' : 'Needs Work'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Product Optimization</CardTitle>
                <CardDescription>
                  Optimize product titles, descriptions, and generate tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Title</label>
                    <Input
                      value={productForm.title}
                      onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter product title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Clothing, Electronics"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Description</label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={optimizeProduct} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Optimize Product
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={loadDashboardData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {product.description.substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-2">
                          {product.tags.split(',').slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">SEO Score</div>
                        <div className="text-2xl font-bold text-green-600">{product.seoScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Collections</CardTitle>
                <CardDescription>
                  Shotgun approach collections for maximum SEO coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <div key={collection.id} className="p-4 bg-white rounded-lg border">
                      <h3 className="font-medium mb-2">{collection.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {collection.description?.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {collection.tags.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                      {collection.isHoliday && (
                        <Badge className="bg-orange-100 text-orange-800">Holiday</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Blog Generation</CardTitle>
                <CardDescription>
                  Generate blogs with internal linking for topical authority
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Blog Topic</label>
                  <Input
                    value={blogForm.topic}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., Luxury Italian Leather Care, Premium Fashion Trends"
                  />
                </div>

                <Button onClick={generateBlog} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Blog...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Blog
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Blog List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <h3 className="font-medium">{blog.title}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={blog.published ? 'default' : 'secondary'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Analytics</CardTitle>
                <CardDescription>
                  Monitor your SEO performance and optimization progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Analytics integration coming soon. Connect Google Search Console for detailed insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}