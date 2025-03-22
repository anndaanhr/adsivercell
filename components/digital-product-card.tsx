"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, ExternalLink, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedButton } from "@/components/animated-button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import type { DigitalProduct } from "@/lib/types"

interface DigitalProductCardProps {
  product: DigitalProduct
  featured?: boolean
}

export function DigitalProductCard({ product, featured = false }: DigitalProductCardProps) {
  const { toast } = useToast()
  const { addToCart, isInCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Get the default option (first one or the one matching the product price)
  const defaultOption = product.options?.find((opt) => opt.price === product.price) || product.options?.[0]

  // Calculate the discounted price
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Create a cart item from the digital product
      const cartItem = {
        id: product.id,
        title: product.title,
        price: discountedPrice,
        quantity: 1,
        image: product.image,
        discount: product.discount,
        type: "digital_product",
        option: defaultOption?.name || null,
        platforms: [product.platform],
      }

      // Add to cart
      addToCart(cartItem)

      setIsAdding(false)

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    }, 500)
  }

  const alreadyInCart = isInCart(product.id)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/digital-products/${product.id}`}>
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg?height=225&width=400"}
              alt={product.title}
              width={400}
              height={225}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>

        {product.discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
            {product.discount}% OFF
          </Badge>
        )}

        {product.featured && (
          <Badge className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="px-2 py-0 text-xs">
            {product.platform}
          </Badge>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-3.5 w-3.5" />
                  <span className="sr-only">Product Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" align="center" className="max-w-[200px]">
                <p className="text-xs">{product.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Link href={`/digital-products/${product.id}`} className="group">
          <h3 className="line-clamp-2 font-medium group-hover:text-primary">{product.title}</h3>
        </Link>

        <div className="mt-2 flex items-end gap-1">
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
          )}
          <span className="text-lg font-bold">${discountedPrice.toFixed(2)}</span>

          {product.options && product.options.length > 1 && (
            <span className="ml-1 text-xs text-muted-foreground">(from)</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4 pt-3">
        <Link href={`/digital-products/${product.id}`} className="text-xs text-muted-foreground hover:text-foreground">
          <span className="flex items-center">
            <ExternalLink className="mr-1 h-3 w-3" />
            View Options
          </span>
        </Link>

        <AnimatedButton size="sm" onClick={handleAddToCart} disabled={isAdding || alreadyInCart}>
          {alreadyInCart ? (
            "In Cart"
          ) : isAdding ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </AnimatedButton>
      </CardFooter>
    </Card>
  )
}

