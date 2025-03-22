import { Suspense } from "react"
import Link from "next/link"
import { Percent, Filter, ArrowDownUp, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GameCard } from "@/components/game-card"
import { GameCardSkeleton } from "@/components/game-card-skeleton"
import { getGames, getGenres, getPlatforms } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface DealsPageProps {
  searchParams: {
    minDiscount?: string
    maxPrice?: string
    genre?: string
    platform?: string
    sort?: string
  }
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  // Get all games
  const allGames = await getGames()

  // Filter games with discounts
  let discountedGames = allGames.filter((game) => game.discount > 0)

  // Apply filters from search params
  if (searchParams.minDiscount) {
    const minDiscount = Number.parseInt(searchParams.minDiscount)
    discountedGames = discountedGames.filter((game) => game.discount >= minDiscount)
  }

  if (searchParams.maxPrice) {
    const maxPrice = Number.parseFloat(searchParams.maxPrice)
    discountedGames = discountedGames.filter((game) => {
      const discountedPrice = game.price * (1 - game.discount / 100)
      return discountedPrice <= maxPrice
    })
  }

  if (searchParams.genre) {
    discountedGames = discountedGames.filter((game) => game.genres.includes(searchParams.genre!))
  }

  if (searchParams.platform) {
    discountedGames = discountedGames.filter((game) => game.platforms.includes(searchParams.platform!))
  }

  // Sort games
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "discount-high":
        discountedGames.sort((a, b) => b.discount - a.discount)
        break
      case "price-low":
        discountedGames.sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100)
          const priceB = b.price * (1 - b.discount / 100)
          return priceA - priceB
        })
        break
      case "price-high":
        discountedGames.sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100)
          const priceB = b.price * (1 - b.discount / 100)
          return priceB - priceA
        })
        break
      case "savings":
        discountedGames.sort((a, b) => {
          const savingsA = a.price * (a.discount / 100)
          const savingsB = b.price * (b.discount / 100)
          return savingsB - savingsA
        })
        break
      default:
        discountedGames.sort((a, b) => b.discount - a.discount)
    }
  } else {
    // Default sort by highest discount
    discountedGames.sort((a, b) => b.discount - a.discount)
  }

  // Get filter options
  const genres = await getGenres()
  const platforms = await getPlatforms()

  // Calculate stats
  const highestDiscount = Math.max(...discountedGames.map((game) => game.discount))
  const lowestPrice = Math.min(...discountedGames.map((game) => game.price * (1 - game.discount / 100)))
  const totalSavings = discountedGames.reduce((total, game) => total + game.price * (game.discount / 100), 0)

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Special Deals</h1>
            <p className="mt-2 max-w-xl">
              Discover amazing discounts on your favorite games. Save up to {highestDiscount}% on selected titles!
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white/20 p-4 backdrop-blur-sm">
            <span className="text-sm font-medium">Deals Available</span>
            <span className="text-3xl font-bold">{discountedGames.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Highest Discount</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{highestDiscount}% OFF</p>
            </div>
            <Percent className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Lowest Price</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">${lowestPrice.toFixed(2)}</p>
            </div>
            <Tag className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Total Savings</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">${totalSavings.toFixed(2)}</p>
            </div>
            <ArrowDownUp className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </CardTitle>
              <CardDescription>Refine your search</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Discount</h3>
                  <div className="space-y-2">
                    {[10, 25, 50, 75].map((discount) => (
                      <div key={discount} className="flex items-center space-x-2">
                        <Checkbox id={`discount-${discount}`} />
                        <label
                          htmlFor={`discount-${discount}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {discount}% or more
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <div className="space-y-4">
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className="flex items-center justify-between">
                      <span className="text-xs">$0</span>
                      <span className="text-xs">$100</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Genres</h3>
                  <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox id={`genre-${genre}`} />
                        <label
                          htmlFor={`genre-${genre}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Platforms</h3>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox id={`platform-${platform}`} />
                        <label
                          htmlFor={`platform-${platform}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{discountedGames.length}</span> deals
            </p>
            <div className="flex items-center gap-2">
              <Select defaultValue="discount-high">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount-high">Highest Discount</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="savings">Biggest Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount Categories */}
          <div className="flex flex-wrap gap-2">
            <Link href="/deals?minDiscount=75">
              <Badge className="cursor-pointer bg-red-500 hover:bg-red-600">75% or more</Badge>
            </Link>
            <Link href="/deals?minDiscount=50">
              <Badge className="cursor-pointer bg-orange-500 hover:bg-orange-600">50% or more</Badge>
            </Link>
            <Link href="/deals?minDiscount=25">
              <Badge className="cursor-pointer bg-yellow-500 hover:bg-yellow-600">25% or more</Badge>
            </Link>
            <Link href="/deals?minDiscount=10">
              <Badge className="cursor-pointer bg-green-500 hover:bg-green-600">10% or more</Badge>
            </Link>
            <Link href="/deals?maxPrice=20">
              <Badge className="cursor-pointer bg-blue-500 hover:bg-blue-600">Under $20</Badge>
            </Link>
            <Link href="/deals?maxPrice=10">
              <Badge className="cursor-pointer bg-purple-500 hover:bg-purple-600">Under $10</Badge>
            </Link>
          </div>

          {discountedGames.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Suspense
                fallback={Array(12)
                  .fill(0)
                  .map((_, i) => <GameCardSkeleton key={i} />)}
              >
                {discountedGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </Suspense>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">No deals found</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button asChild>
                <Link href="/deals">Reset Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

