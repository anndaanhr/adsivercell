"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { ShoppingCart, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { getOrdersByUserId, type StoredOrder } from "@/lib/storage"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Load orders
      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)
      setIsLoading(false)
    }
  }, [user])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Loading your orders...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View your past orders and purchases</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : order.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-muted"></div>
                        <div>
                          <p className="text-sm font-medium">Game #{item.gameId}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No orders yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              You haven't made any purchases yet. Start shopping to see your orders here.
            </p>
            <Button asChild>
              <Link href="/games">Browse Games</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

