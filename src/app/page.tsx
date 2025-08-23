"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { ProductRecommendations } from "@/components/ProductRecommendations"
import { CompactCalendarWidget } from "@/components/CalendarWidget"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"

// Mock data for demonstration
const mockProducts = [
  {
    _id: "1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation",
    shortDescription: "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    price: 299.99,
    compareAtPrice: 399.99,
    images: [{ url: "/api/placeholder/400/400", alt: "Wireless Headphones" }],
    tags: ["electronics", "audio", "wireless"],
    seoScore: 85,
    isActive: true,
    isFeatured: true,
    freshness: { isNew: true, isPopular: true }
  },
  {
    _id: "2",
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    description: "Comfortable organic cotton t-shirt",
    shortDescription: "100% organic cotton, ethically sourced and sustainable",
    price: 29.99,
    images: [{ url: "/api/placeholder/400/400", alt: "Organic T-Shirt" }],
    tags: ["clothing", "organic", "sustainable"],
    seoScore: 78,
    isActive: true,
    isFeatured: true,
    freshness: { isFresh: true }
  },
  {
    _id: "3",
    name: "Smart Home Security Camera",
    slug: "smart-home-security-camera",
    description: "4K smart security camera with AI detection",
    shortDescription: "Advanced AI-powered security camera with 4K resolution",
    price: 199.99,
    compareAtPrice: 249.99,
    images: [{ url: "/api/placeholder/400/400", alt: "Security Camera" }],
    tags: ["smart home", "security", "AI"],
    seoScore: 92,
    isActive: true,
    isFeatured: true,
    freshness: { isNew: true }
  },
  {
    _id: "4",
    name: "Artisanal Coffee Beans",
    slug: "artisanal-coffee-beans",
    description: "Single-origin premium coffee beans",
    shortDescription: "Freshly roasted single-origin coffee from sustainable farms",
    price: 24.99,
    images: [{ url: "/api/placeholder/400/400", alt: "Coffee Beans" }],
    tags: ["coffee", "artisanal", "organic"],
    seoScore: 88,
    isActive: true,
    isFeatured: true,
    freshness: { isFresh: true, isPopular: true }
  }
]

const mockCategories = [
  { name: "Electronics", slug: "electronics", icon: "🔌" },
  { name: "Clothing", slug: "clothing", icon: "👕" },
  { name: "Home & Garden", slug: "home-garden", icon: "🏠" },
  { name: "Sports", slug: "sports", icon: "⚽" }
]

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="new" className="mb-4">
              {t('home.heroBadge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  {t('home.shopNow')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/collections">
                  {t('nav.collections')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.freeShipping')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.freeShippingDesc')}</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.securePayment')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.securePaymentDesc')}</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.easyReturns')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.easyReturnsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Widget Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <CompactCalendarWidget />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
                      <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.categoriesTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.categoriesSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockCategories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('home.featuredProducts')}</h2>
              <p className="text-muted-foreground">
                {t('home.featuredProductsDesc')}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                {t('home.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="product-grid">
            {mockProducts.map((product) => (
              <ProductCard key={product._id} product={product} priority />
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ProductRecommendations
            limit={8}
            title={t('home.aiRecommendations')}
            subtitle={t('home.aiRecommendationsDesc')}
            showAIInsights={true}
          />
        </div>
      </section>

      {/* AI SEO Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.aiOptimizationTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.aiOptimizationDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-primary">85%</CardTitle>
                <p className="text-sm text-muted-foreground">{t('home.averageSeoScore')}</p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">
                  {t('home.seoScoreDesc')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-primary">50+</CardTitle>
                <p className="text-sm text-muted-foreground">{t('home.aiGeneratedCollections')}</p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">
                  {t('home.aiCollectionsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-primary">24/7</CardTitle>
                <p className="text-sm text-muted-foreground">{t('home.seoMonitoring')}</p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">
                  {t('home.seoMonitoringDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">
                {t('home.startShopping')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/about">
                {t('home.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
