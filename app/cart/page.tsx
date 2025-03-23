"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingCart, ArrowRight, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { SavedCartsDialog } from "@/components/saved-carts-dialog"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cart.reduce((total, item) => total + (item.discount / 100) * item.price * item.quantity, 0)
  const total = subtotal - discount

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some games to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false)
      clearCart()
      toast({
        title: "Order placed successfully!",
        description: "Check your email for order details and game keys.",
      })
      router.push("/checkout/success")
    }, 1500)
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Your Cart</h1>
      <div className="mb-6 flex justify-end">
        <SavedCartsDialog />
      </div>

      {cart.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {cart.map((item) => {
              const discountedPrice = item.price * (1 - item.discount / 100)

              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-[120px]">
                      <Image
                        src={item.image || "/placeholder.svg?height=150&width=150"}
                        alt={item.title}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Platform: {item.platforms.join(", ")}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-end gap-2 sm:mt-0 sm:text-right">
                          {item.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <span className="font-bold">${(discountedPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600 dark:text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <p className="text-muted-foreground">
                      Game keys will be delivered instantly to your email and account after purchase.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Checkout"}
                  {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/games">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven't added any games to your cart yet.</p>
          <Button size="lg" asChild>
            <Link href="/games">Browse Games</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

