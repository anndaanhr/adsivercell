"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Copy, Download, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  title: string
  quantity: number
  price: number
  discount: number
  platforms: string[]
  keys: string[]
}

interface Order {
  id: string
  date: string
  customer: {
    email: string
    firstName: string
    lastName: string
  }
  items: OrderItem[]
  subtotal: number
  discount: number
  platformFee: number
  total: number
}

export default function CheckoutSuccessPage() {
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Get the last order from localStorage
    const lastOrderJson = localStorage.getItem("lastOrder")
    if (lastOrderJson) {
      try {
        const lastOrder = JSON.parse(lastOrderJson)
        setOrder(lastOrder)
      } catch (error) {
        console.error("Failed to parse last order:", error)
      }
    }
  }, [])

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKeys((prev) => ({ ...prev, [key]: true }))

    toast({
      title: "Key copied",
      description: "Game key has been copied to clipboard",
    })

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKeys((prev) => ({ ...prev, [key]: false }))
    }, 2000)
  }

  const handleDownloadKeys = () => {
    if (!order) return

    let content = "Zafago - Your Game Keys\n\n"
    content += `Order ID: ${order.id}\n`
    content += `Date: ${new Date(order.date).toLocaleString()}\n\n`

    order.items.forEach((item) => {
      content += `${item.title} (${item.platforms.join(", ")})\n`
      item.keys.forEach((key, index) => {
        content += `Key ${index + 1}: ${key}\n`
      })
      content += "\n"
    })

    content += "Thank you for your purchase!\n"
    content += "Zafago - The Digital Game Store"

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zafago-keys-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Keys downloaded",
      description: "Your game keys have been downloaded as a text file",
    })
  }

  if (!order) {
    return (
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-3xl font-bold">Order not found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn't find your order details. Please check your email for your purchase confirmation.
          </p>
          <Button asChild>
            <Link href="/games">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Thank You for Your Purchase!</h1>
          <p className="text-muted-foreground">
            Your order has been successfully processed. Your game keys are ready below.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Order #{order.id} • {new Date(order.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 font-medium">Customer</h3>
                <p className="text-sm text-muted-foreground">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-medium">Your Game Keys</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-md border p-4">
                      <h4 className="mb-2 font-medium">{item.title}</h4>
                      <p className="mb-3 text-xs text-muted-foreground">Platform: {item.platforms.join(", ")}</p>
                      <div className="space-y-2">
                        {item.keys.map((key, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md bg-muted p-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Key {index + 1}</p>
                              <p className="font-mono text-sm">{key}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyKey(key)}
                              className="h-8 gap-1 text-xs"
                            >
                              {copiedKeys[key] ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Your game keys have also been sent to your email address. Please check your inbox.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleDownloadKeys}>
              <Download className="mr-2 h-4 w-4" />
              Download Keys
            </Button>
            <Button asChild>
              <Link href="/account/orders">
                View All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Need help with your purchase? Contact our{" "}
            <Link href="#" className="text-primary hover:underline">
              customer support
            </Link>
            .
          </p>
          <Button variant="outline" asChild>
            <Link href="/games">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

