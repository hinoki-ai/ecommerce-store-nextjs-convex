"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  Target,
  Brain,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"

// Mock data generators
const generateRevenueData = () => {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 200) + 50,
      customers: Math.floor(Math.random() * 150) + 30,
      conversion: (Math.random() * 5 + 2).toFixed(2)
    })
  }
  return data
}

const generateCategoryData = () => [
  { name: 'Electronics', value: 35, revenue: 450000, growth: 12 },
  { name: 'Clothing', value: 25, revenue: 320000, growth: 8 },
  { name: 'Home & Garden', value: 20, revenue: 280000, growth: 15 },
  { name: 'Sports', value: 12, revenue: 150000, growth: -3 },
  { name: 'Books', value: 8, revenue: 95000, growth: 22 }
]

const generateCustomerSegments = () => [
  { segment: 'New Customers', count: 1250, revenue: 180000, ltv: 144, retention: 25 },
  { segment: 'Regular Customers', count: 850, revenue: 320000, ltv: 376, retention: 65 },
  { segment: 'VIP Customers', count: 120, revenue: 180000, ltv: 1500, retention: 95 },
  { segment: 'At-Risk Customers', count: 300, revenue: 45000, ltv: 150, retention: 15 }
]

interface AnalyticsMetric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function AdvancedAnalyticsPage() {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [revenueData, setRevenueData] = useState(generateRevenueData())
  const [categoryData] = useState(generateCategoryData())
  const [customerSegments] = useState(generateCustomerSegments())
  
  // Key metrics
  const metrics: AnalyticsMetric[] = [
    {
      label: 'Revenue',
      value: formatAmount(850000),
      change: 15.3,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Orders',
      value: 3420,
      change: 8.2,
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      label: 'Customers',
      value: 2520,
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: -2.1,
      trend: 'down',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      label: 'Avg Order Value',
      value: formatAmount(248),
      change: 5.7,
      trend: 'up',
      icon: BarChart3,
      color: 'text-indigo-600'
    },
    {
      label: 'Customer LTV',
      value: formatAmount(890),
      change: 18.4,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600'
    }
  ]

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setRevenueData(generateRevenueData())
      setIsLoading(false)
    }, 1000)
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered insights and business intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            onClick={refreshData}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900">AI Insights</h3>
              <p className="text-purple-700 text-sm">
                Your revenue is trending 15% above average. Customer acquisition cost decreased by 8%. 
                Consider increasing inventory for Electronics category (+12% growth).
              </p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Zap className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div className={`flex items-center space-x-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : metric.trend === 'down' ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : null}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatAmount(value as number), 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders vs Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Orders & Customer Activity</CardTitle>
                <CardDescription>Daily orders and new customers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#00C49F" 
                      name="Orders"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#FF8042" 
                      name="New Customers"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories Table */}
            <Card>
              <CardHeader>
                <CardTitle>Category Growth</CardTitle>
                <CardDescription>Category performance and growth rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatAmount(category.revenue)} revenue
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{category.value}%</Badge>
                        <div className={`flex items-center space-x-1 ${
                          category.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.growth > 0 ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="text-sm">{Math.abs(category.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Breakdown by customer behavior and value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{segment.segment}</h4>
                        <Badge variant={
                          segment.segment.includes('VIP') ? 'default' :
                          segment.segment.includes('At-Risk') ? 'destructive' : 'secondary'
                        }>
                          {segment.count} customers
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Revenue</div>
                          <div className="font-medium">{formatAmount(segment.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg LTV</div>
                          <div className="font-medium">{formatAmount(segment.ltv)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Retention</div>
                          <div className="font-medium">{segment.retention}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="customers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Predictive Analytics</span>
                </CardTitle>
                <CardDescription>AI-powered forecasts and predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Revenue Forecast</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Based on current trends, next month&apos;s revenue is projected to reach 
                    <span className="font-semibold"> {formatAmount(920000)}</span> (+8.2% growth)
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Customer Insights</span>
                  </div>
                  <p className="text-sm text-green-800">
                    450 customers are likely to make their next purchase within 7 days.
                    Send targeted promotions for 15% higher conversion rates.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Inventory Alert</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    Electronics category showing high demand. 
                    Increase inventory by 25% to avoid stockouts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Optimization Opportunities</span>
                </CardTitle>
                <CardDescription>AI-suggested improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Reduce Cart Abandonment</div>
                      <div className="text-sm text-muted-foreground">
                        Implement exit-intent popups with 10% discount. 
                        Potential revenue increase: {formatAmount(45000)}/month
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Email Marketing Optimization</div>
                      <div className="text-sm text-muted-foreground">
                        Segment customers by purchase behavior. 
                        Expected ROI improvement: 35%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Product Recommendations</div>
                      <div className="text-sm text-muted-foreground">
                        Cross-sell complementary products on checkout page. 
                        Potential AOV increase: 18%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content would go here */}
        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Product analytics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Marketing analytics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}