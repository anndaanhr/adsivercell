import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import type { Game } from "@/lib/types"

interface FeaturedGameProps {
  game: Game
}

export function FeaturedGame({ game }: FeaturedGameProps) {
  // Add a check to ensure game is defined
  if (!game) {
    return null
  }

  // Calculate discounted price
  const discountedPrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="grid md:grid-cols-[1fr_400px]">
        <div className="relative aspect-video md:aspect-auto">
          <Image
            src={game.image || "/placeholder.svg?height=600&width=800"}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
          {game.discount > 0 && (
            <Badge className="absolute left-4 top-4 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
              {game.discount}% OFF
            </Badge>
          )}
        </div>
        <div className="flex flex-col justify-between p-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {/* Add a check to ensure genres exists and is an array */}
              {game.genres && Array.isArray(game.genres) ? (
                game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">General</Badge>
              )}
            </div>
            <h2 className="mb-2 text-2xl font-bold">{game.title}</h2>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.0 (120 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Developer:</span>
                <span className="font-medium text-foreground">{game.developer}</span>
              </div>
            </div>
            <p className="mb-6 line-clamp-3 text-muted-foreground">{game.description}</p>
          </div>
          <div>
            <div className="mb-4 flex items-end gap-2">
              {game.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">${game.price.toFixed(2)}</span>
              )}
              <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <AddToCartButton game={game} />
              <Button variant="outline" asChild>
                <Link href={`/games/${game.id}`}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

