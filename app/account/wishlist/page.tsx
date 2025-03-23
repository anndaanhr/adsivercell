"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getStoredData, setStoredData } from "@/lib/storage"

interface WishlistItem {
  id: string
  gameId: string
  userId: string
  addedAt: string
}

interface Game {
  id: string
  title: string
  price: number
  discount: number
  image?: string
  platforms: string[]
}

export default function WishlistPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Load wishlist items
      const allWishlistItems = getStoredData<WishlistItem[]>("zafago_wishlist", [])
      const userWishlistItems = allWishlistItems.filter((item) => item.userId === user.id)
      setWishlistItems(userWishlistItems)

      // Load games
      const allGames = getStoredData<Game[]>("zafago_games", [])
      setGames(allGames)

      setIsLoading(false)
    }
  }, [user])

  const removeFromWishlist = (wishlistItemId: string) => {
    const allWishlistItems = getStoredData<WishlistItem[]>("zafago_wishlist", [])
    const updatedWishlistItems = allWishlistItems.filter((item) => item.id !== wishlistItemId)
    setStoredData("zafago_wishlist", updatedWishlistItems)

    // Update local state
    setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistItemId))

    toast({
      title: "Removed from wishlist",
      description: "The game has been removed from your wishlist.",
    })
  }

  const addToCart = (gameId: string) => {
    // In a real app, you would add the game to the cart
    toast({
      title: "Added to cart",
      description: "The game has been added to your cart.",
    })
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wishlist</CardTitle>
          <CardDescription>Loading your wishlist...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get game details for wishlist items
  const wishlistWithGameDetails = wishlistItems
    .map((item) => {
      const game = games.find((g) => g.id === item.gameId)
      return {
        ...item,
        game,
      }
    })
    .filter((item) => item.game) // Filter out items where game is not found

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wishlist</CardTitle>
        <CardDescription>Games you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        {wishlistWithGameDetails.length > 0 ? (
          <div className="space-y-4">
            {wishlistWithGameDetails.map((item) => {
              const game = item.game!
              const discountedPrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price

              return (
                <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={game.image || "/placeholder.svg?height=80&width=80"}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/games/${game.id}`} className="font-medium hover:text-primary">
                          {game.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {game.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        {game.discount > 0 && (
                          <div className="text-sm text-muted-foreground line-through">${game.price.toFixed(2)}</div>
                        )}
                        <div className="font-bold text-primary">${discountedPrice.toFixed(2)}</div>
                        {game.discount > 0 && (
                          <Badge className="bg-green-500 hover:bg-green-600">{game.discount}% OFF</Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-500 hover:text-red-600"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                      <Button size="sm" className="gap-1" onClick={() => addToCart(game.id)}>
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Save games to your wishlist to keep track of what you want to buy later.
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

