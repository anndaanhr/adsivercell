"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { games, getRelatedGames, getTopRatedGames } from "@/lib/game-database"
import type { Game } from "@/lib/types"

interface GameRecommendationsProps {
  currentGameId?: string
  title?: string
  type?: "related" | "topRated" | "newReleases" | "recommended"
  limit?: number
}

export function GameRecommendations({
  currentGameId,
  title = "Recommended Games",
  type = "recommended",
  limit = 6,
}: GameRecommendationsProps) {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([])
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 4 })

  useEffect(() => {
    let gamesData: Game[] = []

    switch (type) {
      case "related":
        if (currentGameId) {
          gamesData = getRelatedGames(currentGameId, limit)
        }
        break
      case "topRated":
        gamesData = getTopRatedGames(limit)
        break
      case "newReleases":
        const now = new Date()
        const cutoffDate = new Date(now.setDate(now.getDate() - 30))
        gamesData = games
          .filter((game) => new Date(game.releaseDate) >= cutoffDate)
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, limit)
        break
      case "recommended":
      default:
        // For demo purposes, just get some random games
        const shuffled = [...games].sort(() => 0.5 - Math.random())
        gamesData = shuffled.slice(0, limit)
        break
    }

    setRecommendedGames(gamesData)
  }, [currentGameId, type, limit])

  const handleNext = () => {
    if (visibleRange.end < recommendedGames.length) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1,
      })
    }
  }

  const handlePrev = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: visibleRange.start - 1,
        end: visibleRange.end - 1,
      })
    }
  }

  // Calculate if we can navigate
  const canGoNext = visibleRange.end < recommendedGames.length
  const canGoPrev = visibleRange.start > 0

  // Get visible games
  const visibleGames = recommendedGames.slice(visibleRange.start, visibleRange.end)

  // If no games or only the current game was found
  if (recommendedGames.length === 0 || (recommendedGames.length === 1 && recommendedGames[0].id === currentGameId)) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrev} disabled={!canGoPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext} disabled={!canGoNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleGames.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Link href={`/games/${game.id}`}>
                <Image
                  src={game.image || "/placeholder.svg?height=200&width=350"}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                {game.discount > 0 && (
                  <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
                    {game.discount}% OFF
                  </Badge>
                )}
              </Link>
            </div>

            <CardContent className="p-3">
              <Link href={`/games/${game.id}`} className="block">
                <h3 className="mb-1 line-clamp-1 font-medium hover:text-primary">{game.title}</h3>
              </Link>

              <div className="mb-2 flex items-end gap-2">
                {game.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">${game.price.toFixed(2)}</span>
                )}
                <span className="text-lg font-bold">${(game.price * (1 - game.discount / 100)).toFixed(2)}</span>
              </div>

              <AddToCartButton game={game} variant="secondary" size="sm" className="w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

