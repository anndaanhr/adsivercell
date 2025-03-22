"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import type { Game } from "@/lib/types"

interface AddToCartButtonProps {
  game: Game
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AddToCartButton({ game, variant = "default", size = "default", className }: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const alreadyInCart = isInCart(game.id)

  const handleAddToCart = () => {
    if (alreadyInCart) return

    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addToCart(game)
      setIsAdding(false)

      toast({
        title: "Added to cart",
        description: `${game.title} has been added to your cart.`,
      })
    }, 500)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={isAdding || alreadyInCart}
    >
      {alreadyInCart ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          In Cart
        </>
      ) : isAdding ? (
        "Adding..."
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}

