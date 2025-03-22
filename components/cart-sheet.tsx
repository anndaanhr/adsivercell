"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/components/cart-provider"

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity } = useCart()

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cart.reduce((total, item) => total + (item.discount / 100) * item.price * item.quantity, 0)
  const total = subtotal - discount

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pt-4">
                {cart.map((item) => {
                  const discountedPrice = item.price * (1 - item.discount / 100)

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h4 className="line-clamp-1 font-medium">{item.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <div className="flex items-end gap-1">
                            {item.discount > 0 && (
                              <span className="text-xs text-muted-foreground line-through">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            )}
                            <span className="font-bold">${(discountedPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="mt-auto space-y-4 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add some games to get started</p>
            </div>
            <Button asChild>
              <Link href="/games">Browse Games</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

