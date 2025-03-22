"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Bell, ShoppingBag, Tag, Heart, MessageSquare, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { getStoredData, setStoredData } from "@/lib/storage"

interface Notification {
  id: string
  userId: string
  type: "order" | "deal" | "wishlist" | "message" | "system"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Load notifications
      const allNotifications = getStoredData<Notification[]>("zafago_notifications", [])
      const userNotifications = allNotifications
        .filter((notification) => notification.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setNotifications(userNotifications)
      setIsLoading(false)
    }
  }, [user])

  const markAsRead = (id: string) => {
    const allNotifications = getStoredData<Notification[]>("zafago_notifications", [])
    const updatedNotifications = allNotifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification,
    )

    setStoredData("zafago_notifications", updatedNotifications)

    // Update local state
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    if (!user) return

    const allNotifications = getStoredData<Notification[]>("zafago_notifications", [])
    const updatedNotifications = allNotifications.map((notification) =>
      notification.userId === user.id ? { ...notification, isRead: true } : notification,
    )

    setStoredData("zafago_notifications", updatedNotifications)

    // Update local state
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    const allNotifications = getStoredData<Notification[]>("zafago_notifications", [])
    const updatedNotifications = allNotifications.filter((notification) => notification.id !== id)

    setStoredData("zafago_notifications", updatedNotifications)

    // Update local state
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    if (!user) return

    const allNotifications = getStoredData<Notification[]>("zafago_notifications", [])
    const updatedNotifications = allNotifications.filter((notification) => notification.userId !== user.id)

    setStoredData("zafago_notifications", updatedNotifications)

    // Update local state
    setNotifications([])
  }

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications
    }
    return notifications.filter((notification) => notification.type === activeTab)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />
      case "deal":
        return <Tag className="h-5 w-5 text-green-500" />
      case "wishlist":
        return <Heart className="h-5 w-5 text-red-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Loading your notifications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Stay updated with your orders, deals, and messages</CardDescription>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllNotifications}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full bg-primary p-0 text-[10px]">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="deal">Deals</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative rounded-lg border p-4 transition-colors ${
                      notification.isRead ? "bg-background" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex justify-end gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              Mark as Read
                            </Button>
                          )}
                          {notification.link && (
                            <Button variant="outline" size="sm" className="h-8" asChild>
                              <Link href={notification.link}>View Details</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">You don't have any notifications at the moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

