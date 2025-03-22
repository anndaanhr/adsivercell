"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Plus, Check, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AnimatedButton } from "@/components/animated-button"
import { games, getGenreById, getPlatformById } from "@/lib/game-database"
import type { Game } from "@/lib/types"

interface GameComparisonProps {
  initialGames?: Game[]
}

export function GameComparison({ initialGames = [] }: GameComparisonProps) {
  const [comparedGames, setComparedGames] = useState<Game[]>(initialGames)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load compared games from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && initialGames.length === 0) {
      const savedGames = localStorage.getItem("zafago_compared_games")
      if (savedGames) {
        try {
          const gameIds = JSON.parse(savedGames) as string[]
          const loadedGames = games.filter((game) => gameIds.includes(game.id))
          setComparedGames(loadedGames)
        } catch (error) {
          console.error("Error loading compared games:", error)
        }
      }
    }
  }, [initialGames])

  // Save compared games to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gameIds = comparedGames.map((game) => game.id)
      localStorage.setItem("zafago_compared_games", JSON.stringify(gameIds))
    }
  }, [comparedGames])

  // Search for games
  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      setIsSearching(true)
      const term = searchTerm.toLowerCase()
      const results = games
        .filter((game) => !comparedGames.some((g) => g.id === game.id) && game.title.toLowerCase().includes(term))
        .slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchTerm, comparedGames])

  const addGame = (game: Game) => {
    if (comparedGames.length < 3) {
      setComparedGames([...comparedGames, game])
      setSearchTerm("")
      setSearchResults([])
    }
  }

  const removeGame = (gameId: string) => {
    setComparedGames(comparedGames.filter((game) => game.id !== gameId))
  }

  const clearComparison = () => {
    setComparedGames([])
  }

  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price * (1 - discount / 100)
      return (
        <div className="flex flex-col">
          <span className="text-lg font-bold">${discountedPrice.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
        </div>
      )
    }
    return <span className="text-lg font-bold">${price.toFixed(2)}</span>
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Compare Games</CardTitle>
          {comparedGames.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearComparison}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Search for games to compare */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for games to compare..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={comparedGames.length >= 3}
            />

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-background shadow-md">
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="flex cursor-pointer items-center gap-3 p-2 hover:bg-muted"
                    onClick={() => addGame(game)}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={game.image || "/placeholder.svg?height=40&width=40"}
                        alt={game.title}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{game.title}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {isSearching && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-background p-2 text-center shadow-md">
                <p className="text-sm text-muted-foreground">No games found</p>
              </div>
            )}
          </div>

          {comparedGames.length >= 3 && (
            <p className="mt-2 text-xs text-muted-foreground">You can compare up to 3 games at a time.</p>
          )}
        </div>

        {comparedGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-muted-foreground">Add games to compare their features and prices</p>
            <Link href="/games">
              <Button>Browse Games</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="min-w-[150px] border-b pb-2 text-left font-medium">Feature</th>
                  {comparedGames.map((game) => (
                    <th key={game.id} className="min-w-[200px] border-b pb-2 text-left">
                      <div className="flex items-start justify-between">
                        <Link href={`/games/${game.id}`} className="hover:underline">
                          {game.title}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 -mr-2"
                          onClick={() => removeGame(game.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Image */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Image</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
                        <Image
                          src={game.image || "/placeholder.svg?height=200&width=150"}
                          alt={game.title}
                          fill
                          className="object-cover"
                        />
                        {game.discount > 0 && (
                          <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
                            {game.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Price</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      {formatPrice(game.price, game.discount)}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Rating</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{game.rating.toFixed(1)}/5</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Release Date */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Release Date</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </td>
                  ))}
                </tr>

                {/* Genres */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Genres</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      <div className="flex flex-wrap gap-1">
                        {game.genreIds.map((genreId) => {
                          const genre = getGenreById(genreId)
                          return genre ? (
                            <Badge key={genreId} variant="outline" className="text-xs">
                              {genre.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Platforms */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Platforms</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      <div className="flex flex-wrap gap-1">
                        {game.platformIds.map((platformId) => {
                          const platform = getPlatformById(platformId)
                          return platform ? (
                            <Badge key={platformId} variant="outline" className="text-xs">
                              {platform.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr>
                  <td className="border-b py-4 text-sm font-medium">Features</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="border-b py-4">
                      <div className="flex flex-col gap-1">
                        {game.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Add to Cart */}
                <tr>
                  <td className="py-4 text-sm font-medium">Actions</td>
                  {comparedGames.map((game) => (
                    <td key={game.id} className="py-4">
                      <div className="flex flex-col gap-2">
                        <AddToCartButton game={game} variant="default" />
                        <Link href={`/games/${game.id}`} className="w-full">
                          <AnimatedButton variant="outline" className="w-full">
                            View Details
                          </AnimatedButton>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

