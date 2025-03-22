"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Package, Tag, Percent, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BundleCard } from "@/components/bundle-card"
import { BundleCardSkeleton } from "@/components/bundle-card-skeleton"
import type { Bundle, Game } from "@/lib/types"

interface BundlesClientProps {
  bundles: Bundle[]
  games: Game[]
  totalBundles: number
  highestDiscount: number
  biggestSavings: number
}

export function BundlesClient({
  bundles = [],
  games = [],
  totalBundles = 0,
  highestDiscount = 0,
  biggestSavings = 0,
}: BundlesClientProps) {
  // Check if we have any bundles to display
  const hasBundles = Array.isArray(bundles) && bundles.length > 0
  const featuredBundle = hasBundles ? bundles[0] : null
  const otherBundles = hasBundles ? bundles.slice(1) : []

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Game Bundles</h1>
            <p className="mt-2 max-w-xl">
              Get more for less with our curated game bundles. Save up to {highestDiscount}% compared to buying games
              separately!
            </p>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
            View All Bundles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Available Bundles</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalBundles}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Highest Discount</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{highestDiscount}% OFF</p>
            </div>
            <Percent className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-400">Biggest Savings</p>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">${biggestSavings.toFixed(2)}</p>
            </div>
            <Tag className="h-10 w-10 text-indigo-500" />
          </CardContent>
        </Card>
      </div>

      {/* Featured Bundle */}
      {featuredBundle && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Featured Bundle</h2>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[1fr_400px]">
              <div className="relative aspect-video md:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 p-8 text-white">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <Badge className="mb-2 bg-white text-blue-600 hover:bg-white/90">Featured</Badge>
                      <h3 className="mb-2 text-2xl font-bold">{featuredBundle.title}</h3>
                      <p className="mb-4 max-w-md">{featuredBundle.description}</p>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{featuredBundle.gameIds?.length || 0} Games Included</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          <span>Save {featuredBundle.discount}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end gap-3">
                      <div className="text-3xl font-bold">${featuredBundle.price.toFixed(2)}</div>
                      <div className="text-lg text-white/80 line-through">
                        ${featuredBundle.originalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="mb-4 font-medium">Included Games</h4>
                <div className="space-y-4">
                  {Array.isArray(featuredBundle.gameIds) &&
                    featuredBundle.gameIds.map((gameId) => {
                      const game = games.find((g) => g.id === gameId)
                      if (!game) return null

                      return (
                        <div key={gameId} className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                            <img
                              src={game.image || "/placeholder.svg?height=64&width=64"}
                              alt={game.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{game.title}</h5>
                            <div className="flex items-center gap-2">
                              {Array.isArray(game.platforms) &&
                                game.platforms.map((platform) => (
                                  <Badge key={platform} variant="outline" className="text-xs">
                                    {platform}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${game.price.toFixed(2)}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-sm">
                  <span>Individual Price:</span>
                  <span>${featuredBundle.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 dark:text-green-500">
                  <span>You Save:</span>
                  <span>
                    ${(featuredBundle.originalPrice - featuredBundle.price).toFixed(2)} ({featuredBundle.discount}%)
                  </span>
                </div>

                <Button className="mt-6 w-full">Add Bundle to Cart</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Bundles */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">All Bundles</h2>
        {otherBundles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={Array(6)
                .fill(0)
                .map((_, i) => <BundleCardSkeleton key={i} />)}
            >
              {otherBundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} games={games} />
              ))}
            </Suspense>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No additional bundles available at this time.</p>
          </Card>
        )}
      </div>

      {/* Bundle Categories */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Bundle Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { title: "Publisher Bundles", description: "Collections from top publishers", icon: "publisher" },
            { title: "Genre Bundles", description: "Games grouped by genre", icon: "genre" },
            { title: "Franchise Bundles", description: "Complete game series", icon: "franchise" },
            { title: "Indie Bundles", description: "Collections of indie gems", icon: "indie" },
          ].map((category) => (
            <Card key={category.title} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-2 pt-6 text-white">
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/bundles/${category.icon}`}>
                    View Bundles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

