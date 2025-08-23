"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Mail,
  MessageSquare,
  Smartphone
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface OrderNotification {
  id: string
  orderId: string
  orderNumber: string
  type: "status_update" | "shipping_update" | "delivery_update" | "issue" | "info"
  title: string
  message: string
  timestamp: number
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

interface OrderNotificationsProps {
  userId?: string
  onNotificationClick?: (notification: OrderNotification) => void
  showAsDropdown?: boolean
  maxItems?: number
}

export function OrderNotifications({
  userId,
  onNotificationClick,
  showAsDropdown = false,
  maxItems = 10
}: OrderNotificationsProps) {
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    statusUpdates: true,
    shippingUpdates: true,
    deliveryUpdates: true,
    issueAlerts: true
  })

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: OrderNotification[] = [
      {
        id: "1",
        orderId: "order-001",
        orderNumber: "ORD-001",
        type: "status_update",
        title: "Order Status Updated",
        message: "Your order ORD-001 has been shipped and is on its way!",
        timestamp: Date.now() - 3600000,
        isRead: false,
        priority: "high",
        actionUrl: "/track?order=ORD-001"
      },
      {
        id: "2",
        orderId: "order-002",
        orderNumber: "ORD-002",
        type: "delivery_update",
        title: "Delivery Update",
        message: "Your order ORD-002 is out for delivery. Expected delivery by 3:00 PM today.",
        timestamp: Date.now() - 7200000,
        isRead: true,
        priority: "medium",
        actionUrl: "/track?order=ORD-002"
      },
      {
        id: "3",
        orderId: "order-003",
        orderNumber: "ORD-003",
        type: "issue",
        title: "Order Issue",
        message: "We encountered an issue with your order ORD-003. Our support team is working to resolve it.",
        timestamp: Date.now() - 10800000,
        isRead: false,
        priority: "high",
        actionUrl: "/orders/order-003"
      },
      {
        id: "4",
        orderId: "order-004",
        orderNumber: "ORD-004",
        type: "shipping_update",
        title: "Shipping Confirmation",
        message: "Your order ORD-004 has been handed over to the carrier for delivery.",
        timestamp: Date.now() - 14400000,
        isRead: true,
        priority: "medium",
        actionUrl: "/track?order=ORD-004"
      }
    ]

    // Simulate loading delay
    setTimeout(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status_update":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "shipping_update":
        return <Info className="h-4 w-4 text-blue-600" />
      case "delivery_update":
        return <Info className="h-4 w-4 text-orange-600" />
      case "issue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants]} className="text-xs">
        {priority}
      </Badge>
    )
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success("All notifications marked as read")
  }

  const handleNotificationClick = (notification: OrderNotification) => {
    markAsRead(notification.id)
    onNotificationClick?.(notification)

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (showAsDropdown) {
    return (
      <div className="relative">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Dropdown content would go here */}
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          {/* Dropdown implementation */}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated on your order status and delivery
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Get text message alerts</p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Notification Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(settings)
                .filter(([key]) => !['emailNotifications', 'smsNotifications', 'pushNotifications'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You'll receive notifications here when there are updates to your orders
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, maxItems).map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(notification.priority)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Order {notification.orderNumber}</span>
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {notifications.length > maxItems && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    View All Notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Notification Toast Component
interface NotificationToastProps {
  notification: OrderNotification
  onView?: () => void
  onDismiss?: () => void
}

export function NotificationToast({
  notification,
  onView,
  onDismiss
}: NotificationToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white border rounded-lg shadow-lg">
      {getNotificationIcon(notification.type)}
      <div className="flex-1">
        <h4 className="font-medium mb-1">{notification.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Order {notification.orderNumber}</span>
          <span>•</span>
          <span>{new Date(notification.timestamp).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {onView && (
          <Button size="sm" onClick={onView}>
            View
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}