"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { generateGameKey } from "@/lib/key-generator"

interface OneClickCheckoutProps {
  gameId: string
  price: number
  discount: number
  platforms: string[]
  className?: string
}

export function OneClickCheckout({ gameId, price, discount, platforms, className }: OneClickCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { clearCart } = useCart()

  // Check if user has a default payment method
  const hasDefaultPaymentMethod = () => {
    if (!user) return false

    // In a real app, this would check the user's saved payment methods
    // For demo purposes, we'll assume the user has a default payment method if they're logged in
    return true
  }

  const handleOneClickCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use one-click checkout.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!hasDefaultPaymentMethod()) {
      toast({
        title: "No default payment method",
        description: "Please add a default payment method in your account settings.",
        variant: "destructive",
      })
      router.push("/account/payment")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate game key
      const gameKey = generateGameKey(platforms[0])

      // Create order
      const order = {
        id: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        date: new Date().toISOString(),
        customer: {
          email: user.email,
          name: user.name || user.email.split("@")[0],
        },
        items: [
          {
            id: gameId,
            quantity: 1,
            price: price * (1 - discount / 100),
            keys: [gameKey],
          },
        ],
        total: price * (1 - discount / 100),
      }

      // Store order in localStorage for demo purposes
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))
      localStorage.setItem("lastOrder", JSON.stringify(order))

      // Clear cart and redirect to success page
      clearCart()

      toast({
        title: "Order complete!",
        description: "Your purchase was successful. Check your email for the game key.",
      })

      router.push("/checkout/success")
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button onClick={handleOneClickCheckout} disabled={isProcessing} className={className} variant="secondary">
      <Zap className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : "Buy Now"}
    </Button>
  )
}

