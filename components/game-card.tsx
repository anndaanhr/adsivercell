"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Heart, BarChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Game } from "@/lib/types"

interface GameCardProps {
  game:
    | Game
    | {
        id: string
        title: string
        description: string
        price: number
        discount: number
        image?: string
        platforms: string[]
        genres: string[]
        platformIds?: string[]
        genreIds?: string[]
        developer: string
        publisher: string
        releaseDate: string
        tags?: string[]
      }
}

export function GameCard({ game }: GameCardProps) {
  // Calculate discounted price
  const discountedPrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price

  // Function to add game to comparison
  const addToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Get current compared games from localStorage
    const comparedGamesStr = localStorage.getItem("zafago_compared_games")
    let comparedGames: string[] = []

    if (comparedGamesStr) {
      try {
        comparedGames = JSON.parse(comparedGamesStr)
      } catch (error) {
        console.error("Error parsing compared games:", error)
      }
    }

    // Check if game is already in comparison
    if (comparedGames.includes(game.id)) {
      // Remove from comparison
      comparedGames = comparedGames.filter((id) => id !== game.id)
    } else {
      // Add to comparison (max 3)
      if (comparedGames.length < 3) {
        comparedGames.push(game.id)
      } else {
        // Remove the first game and add the new one
        comparedGames.shift()
        comparedGames.push(game.id)
      }
    }

    // Save back to localStorage
    localStorage.setItem("zafago_compared_games", JSON.stringify(comparedGames))

    // Redirect to compare page if 2 or more games are selected
    if (comparedGames.length >= 2) {
      window.location.href = "/compare"
    }
  }

  // Safely get platforms - support both platformIds and platforms
  const platformsToShow = game.platformIds || game.platforms || []

  // Safely get genres - support both genreIds and genres
  const genresToShow = game.genreIds || game.genres || []

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
      <Link href={`/games/${game.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={game.image || "/placeholder.svg?height=400&width=300"}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {game.discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
              {game.discount}% OFF
            </Badge>
          )}
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Add to wishlist logic
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    onClick={addToCompare}
                  >
                    <BarChart className="h-4 w-4" />
                    <span className="sr-only">Compare</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Comparison</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {platformsToShow.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>

        <div className="mb-2 flex flex-wrap gap-1">
          {genresToShow.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <Link href={`/games/${game.id}`} className="block">
          <h3 className="mb-1 line-clamp-1 font-medium transition-colors group-hover:text-primary">{game.title}</h3>
        </Link>

        <div className="mb-3 flex items-end gap-2">
          {game.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">${game.price.toFixed(2)}</span>
          )}
          <span className="text-lg font-bold">${discountedPrice.toFixed(2)}</span>
        </div>

        <AddToCartButton game={game} variant="secondary" />
      </div>
    </div>
  )
}
