"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Gamepad2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { GameCardSkeleton } from "@/components/game-card-skeleton"
import { AdvancedFilter } from "@/components/advanced-filter"
import { games } from "@/lib/game-database"

interface GamesPageProps {
  searchParams: {
    q?: string
    genre?: string | string[]
    platform?: string | string[]
    publisher?: string | string[]
    min?: string
    max?: string
    rating?: string
    year?: string
    sale?: string
    sort?: string
  }
}

export default function GamesPage({ searchParams }: GamesPageProps) {
  const router = useRouter()
  const isMounted = useRef(true)
  const initialRenderRef = useRef(true)

  // Convert search params to the right format
  const genres = Array.isArray(searchParams.genre) ? searchParams.genre : searchParams.genre ? [searchParams.genre] : []

  const platforms = Array.isArray(searchParams.platform)
    ? searchParams.platform
    : searchParams.platform
      ? [searchParams.platform]
      : []

  const publishers = Array.isArray(searchParams.publisher)
    ? searchParams.publisher
    : searchParams.publisher
      ? [searchParams.publisher]
      : []

  const [filteredGames, setFilteredGames] = useState([...games])
  const [isLoading, setIsLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set up mounted state and cleanup
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false

      // Clear all timeouts on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }

      // Ensure loading state is reset when component unmounts
      setIsLoading(false)
    }
  }, [])

  // Filter games based on search params - only run on searchParams change
  useEffect(() => {
    // Clear any existing timeout to prevent memory leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current)
    }

    // Set loading state immediately
    if (isMounted.current) {
      setIsLoading(true)
    }

    // Use setTimeout to prevent blocking the UI
    timeoutRef.current = setTimeout(() => {
      try {
        if (!isMounted.current) return

        let result = [...games]

        if (searchParams.q) {
          const query = searchParams.q.toLowerCase()
          result = result.filter(
            (game) =>
              game.title.toLowerCase().includes(query) ||
              game.description.toLowerCase().includes(query) ||
              (game.tags && game.tags.some((tag) => tag.toLowerCase().includes(query))),
          )
        }

        if (genres.length > 0) {
          result = result.filter((game) =>
            genres.some(
              (genre) => {
                // Handle both genreIds and genres
                const gameGenres = game.genreIds || game.genres || []
                return gameGenres.includes(genre)
              }
            ),
          )
        }

        if (platforms.length > 0) {
          result = result.filter((game) =>
            platforms.some(
              (platform) => {
                // Handle both platformIds and platforms
                const gamePlatforms = game.platformIds || game.platforms || []
                return gamePlatforms.includes(platform)
              }
            ),
          )
        }

        if (publishers.length > 0) {
          result = result.filter((game) => publishers.includes(game.publisher))
        }

        if (searchParams.min) {
          const minPrice = Number.parseFloat(searchParams.min)
          result = result.filter((game) => {
            const price = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price
            return price >= minPrice
          })
        }

        if (searchParams.max) {
          const maxPrice = Number.parseFloat(searchParams.max)
          result = result.filter((game) => {
            const price = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price
            return price <= maxPrice
          })
        }

        if (searchParams.rating) {
          const minRating = Number.parseFloat(searchParams.rating)
          result = result.filter((game) => (game.rating || 0) >= minRating)
        }

        if (searchParams.year) {
          const year = searchParams.year
          result = result.filter((game) => {
            const releaseYear = new Date(game.releaseDate).getFullYear().toString()
            return releaseYear === year
          })
        }

        if (searchParams.sale === "true") {
          result = result.filter((game) => game.discount > 0)
        }

        // Sort games
        if (searchParams.sort) {
          switch (searchParams.sort) {
            case "price-asc":
              result.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
                return priceA - priceB
              })
              break
            case "price-desc":
              result.sort((a, b) => {
                const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
                const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
                return priceB - priceA
              })
              break
            case "name-asc":
              result.sort((a, b) => a.title.localeCompare(b.title))
              break
            case "name-desc":
              result.sort((a, b) => b.title.localeCompare(a.title))
              break
            case "rating-desc":
              result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
              break
            case "release-desc":
              result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
              break
            case "discount-desc":
              result.sort((a, b) => b.discount - a.discount)
              break
            default:
              // Default sorting (relevance) - no specific sort
              break
          }
        }

        if (isMounted.current) {
          setFilteredGames(result)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error filtering games:", error)
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }, 300) // Slightly longer timeout for better UX

    // Add a safety timeout to ensure loading state doesn't get stuck
    safetyTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }, 3000) // 3 seconds max loading time

    // Cleanup function to clear timeout if component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }
    }
  }, [searchParams, genres, platforms, publishers])

  // Function to handle filter changes (client-side)
  const handleFilterChange = () => {
    // This is handled by the component itself through URL updates
    // No need to do anything here as the URL updates will trigger a page refresh
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Games Catalog</h1>
        <p className="text-muted-foreground">Browse our collection of games for various platforms</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <AdvancedFilter
          onFilterChange={handleFilterChange}
          totalGames={filteredGames.length}
          initialFilters={{
            search: searchParams.q || "",
            genres: genres,
            platforms: platforms,
            publishers: publishers,
            priceRange: [Number(searchParams.min || 0), Number(searchParams.max || 100)],
            rating: searchParams.rating ? Number(searchParams.rating) : null,
            releaseYear: searchParams.year || null,
            onSale: searchParams.sale === "true",
            sortBy: searchParams.sort || "relevance",
          }}
        />

        {/* Games Grid */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredGames.length}</span> games
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Gamepad2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">No games found</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
              <Button onClick={() => router.push("/games")}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
