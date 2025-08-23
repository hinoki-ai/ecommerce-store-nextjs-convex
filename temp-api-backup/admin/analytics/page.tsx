"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Clock,
  Target,
  Search,
  Users,
  DollarSign
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const seoMetrics = {
  overallScore: 85,
  organicTraffic: 12500,
  keywordRankings: 342,
  backlinks: 89,
  indexedPages: 1247,
  crawlErrors: 3
}

const performanceMetrics = [
  { name: "Page Load Time", value: "1.2s", change: -12, icon: Clock },
  { name: "Bounce Rate", value: "32%", change: -5, icon: MousePointer },
  { name: "Conversion Rate", value: "3.2%", change: 8, icon: Target },
  { name: "Avg Session Duration", value: "4m 32s", change: 15, icon: Eye }
]

const topPages = [
  { path: "/", views: 5420, unique: 3890, bounce: "28%" },
  { path: "/products", views: 3210, unique: 2340, bounce: "35%" },
  { path: "/categories/electronics", views: 1890, unique: 1450, bounce: "42%" },
  { path: "/products/wireless-headphones", views: 1240, unique: 980, bounce: "25%" },
  { path: "/cart", views: 890, unique: 670, bounce: "18%" }
]

const topKeywords = [
  { keyword: "wireless headphones", position: 3, volume: 5400, trend: "up" },
  { keyword: "smart home security", position: 7, volume: 3200, trend: "up" },
  { keyword: "organic cotton t-shirt", position: 5, volume: 2800, trend: "down" },
  { keyword: "premium coffee beans", position: 12, volume: 2100, trend: "stable" },
  { keyword: "4k security camera", position: 8, volume: 1800, trend: "up" }
]

const seoIssues = [
  { type: "error", message: "3 pages have crawl errors", severity: "high" },
  { type: "warning", message: "15 pages missing meta descriptions", severity: "medium" },
  { type: "info", message: "8 products have SEO scores below 70%", severity: "low" },
  { type: "info", message: "2 pages have slow load times", severity: "medium" }
]

export default function AdminAnalyticsPage() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-blue-600 bg-blue-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics & SEO</h2>
          <p className="text-gray-600">Monitor performance and SEO optimization</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seo">SEO Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <metric.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex items-center mt-2">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* SEO Overview */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{seoMetrics.overallScore}%</div>
                  <div className="text-sm text-muted-foreground">Overall SEO Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{seoMetrics.organicTraffic.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Organic Traffic</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{seoMetrics.keywordRankings}</div>
                  <div className="text-sm text-muted-foreground">Keywords Ranking</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{seoMetrics.indexedPages}</div>
                  <div className="text-sm text-muted-foreground">Pages Indexed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unique</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topPages.map((page, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{page.path}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">{page.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{page.unique.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{page.bounce}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Performance Tab */}
        <TabsContent value="seo" className="space-y-6">
          {/* SEO Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Organic Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{seoMetrics.keywordRankings}</div>
                <p className="text-sm text-muted-foreground">Keywords ranking in top 100</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Backlinks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{seoMetrics.backlinks}</div>
                <p className="text-sm text-muted-foreground">Quality backlinks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Crawl Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${seoMetrics.crawlErrors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {seoMetrics.crawlErrors}
                </div>
                <p className="text-sm text-muted-foreground">Pages with crawl issues</p>
              </CardContent>
            </Card>
          </div>

          {/* Keyword Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topKeywords.map((keyword, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{keyword.keyword}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">{keyword.position}</td>
                        <td className="px-4 py-3 text-sm">{keyword.volume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            {getTrendIcon(keyword.trend)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* SEO Issues */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Issues & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoIssues.map((issue, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">⚠️</div>
                      <div className="flex-1">
                        <div className="font-medium">{issue.message}</div>
                        <Badge variant="outline" className="mt-1">
                          {issue.severity} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Analytics Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Organic Search
                    </span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MousePointer className="h-4 w-4 mr-2" />
                      Direct
                    </span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Social Media
                    </span>
                    <span className="font-medium">9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Paid Ads
                    </span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Desktop</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mobile</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tablet</span>
                    <span className="font-medium">13%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Note */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Analytics Integration</h3>
                  <p className="text-blue-800 text-sm">
                    This dashboard shows the structure for analytics and SEO tracking.
                    To fully implement this feature, you would integrate with:
                  </p>
                  <ul className="text-blue-800 text-sm mt-2 space-y-1">
                    <li>• Google Analytics 4 for traffic and user behavior data</li>
                    <li>• Google Search Console for SEO performance metrics</li>
                    <li>• Custom event tracking for ecommerce actions</li>
                    <li>• Real-time performance monitoring</li>
                    <li>• Automated SEO audits and recommendations</li>
                    <li>• Integration with AI-SEO service for automated optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}