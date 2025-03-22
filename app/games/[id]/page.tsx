"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Star, Calendar, Users, ShoppingCart, Heart, Share2 } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AnimatedButton } from "@/components/animated-button"
import { GameRecommendations } from "@/components/game-recommendations"
import { PreOrderButton } from "@/components/pre-order-button"
import { games, getGenreById, getPlatformById, getDeveloperById, getPublisherById } from "@/lib/game-database"
import { OneClickCheckout } from "@/components/one-click-checkout"
import { ReviewForm } from "@/components/review-form"
import { ReviewList } from "@/components/review-list"
import { useRecommendations } from "@/components/recommendations-provider"

interface GamePageProps {
  params: {
    id: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const game = games.find((g) => g.id === params.id)

  if (!game) {
    notFound()
  }

  // Calculate discounted price
  const discountedPrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price

  // Get related entities
  const developer = getDeveloperById(game.developer)
  const publisher = getPublisherById(game.publisher)

  // Format release date
  const releaseDate = new Date(game.releaseDate)
  const formattedReleaseDate = releaseDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Check if game is a pre-order
  const isPreOrder = game.preOrder || new Date(game.releaseDate) > new Date()

  const { addToRecentlyViewed } = useRecommendations()

  useEffect(() => {
    // Add this game to recently viewed
    addToRecentlyViewed(game.id)
  }, [game.id, addToRecentlyViewed])

  return (
    <div className="container px-4 py-8">
      <Link href="/games">
        <Button variant="ghost" className="mb-4 flex items-center gap-2 pl-0 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Games
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr]">
        <div>
          {/* Game Header */}
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{game.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{game.rating.toFixed(1)}/5</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formattedReleaseDate}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>{developer?.name || game.developer}</span>
              </div>
            </div>
          </div>

          {/* Game Image */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
            <Image
              src={game.image || "/placeholder.svg?height=500&width=900"}
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

          {/* Game Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="system">System Requirements</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-xl font-bold">About This Game</h2>
                  <p className="text-muted-foreground">{game.description}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <h3 className="mb-2 font-semibold">Genres</h3>
                    <div className="flex flex-wrap gap-1">
                      {game.genreIds.map((genreId) => {
                        const genre = getGenreById(genreId)
                        return genre ? (
                          <Badge key={genreId} variant="outline">
                            {genre.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Features</h3>
                    <div className="flex flex-wrap gap-1">
                      {game.features.map((feature) => (
                        <Badge key={feature} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {game.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-semibold">Developer</h3>
                    <p className="text-muted-foreground">{developer?.name || game.developer}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Publisher</h3>
                    <p className="text-muted-foreground">{publisher?.name || game.publisher}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="pt-4">
              {game.systemRequirements ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-3 text-xl font-bold">System Requirements</h2>
                    <p className="text-muted-foreground">
                      Make sure your system meets these requirements before purchasing.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="mb-4 text-lg font-semibold">Minimum Requirements</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">OS</dt>
                            <dd>{game.systemRequirements.minimum.os}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Processor</dt>
                            <dd>{game.systemRequirements.minimum.processor}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Memory</dt>
                            <dd>{game.systemRequirements.minimum.memory}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Graphics</dt>
                            <dd>{game.systemRequirements.minimum.graphics}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Storage</dt>
                            <dd>{game.systemRequirements.minimum.storage}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="mb-4 text-lg font-semibold">Recommended Requirements</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">OS</dt>
                            <dd>{game.systemRequirements.recommended.os}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Processor</dt>
                            <dd>{game.systemRequirements.recommended.processor}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Memory</dt>
                            <dd>{game.systemRequirements.recommended.memory}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Graphics</dt>
                            <dd>{game.systemRequirements.recommended.graphics}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Storage</dt>
                            <dd>{game.systemRequirements.recommended.storage}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  System requirements not available for this game.
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-8">
                <ReviewForm gameId={game.id} gameName={game.title} />
                <ReviewList gameId={game.id} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Games */}
          <div className="mt-12">
            <GameRecommendations currentGameId={game.id} title="Similar Games You Might Like" type="related" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="mb-2 flex items-end gap-2">
                  {game.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">${game.price.toFixed(2)}</span>
                  )}
                  <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
                  {game.discount > 0 && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      {game.discount}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {game.stock > 0 ? (
                    <>
                      <span className="text-green-500">In Stock</span> - Instant delivery via email
                    </>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </p>
              </div>

              <div className="mb-4 space-y-2">
                <h3 className="font-semibold">Available Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platformIds.map((platformId) => {
                    const platform = getPlatformById(platformId)
                    return platform ? (
                      <Badge key={platformId} variant="outline" className="flex items-center gap-1">
                        {platform.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              <div className="mb-6 space-y-3">
                {isPreOrder ? (
                  <PreOrderButton game={game} className="w-full" />
                ) : (
                  <>
                    <AddToCartButton game={game} className="w-full" />
                    <OneClickCheckout
                      gameId={game.id}
                      price={game.price}
                      discount={game.discount}
                      platforms={game.platformIds.map((id) => {
                        const platform = getPlatformById(id)
                        return platform ? platform.name : id
                      })}
                    />
                  </>
                )}

                <AnimatedButton variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </AnimatedButton>

                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              {game.editions && game.editions.length > 1 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Available Editions</h3>
                  {game.editions.map((edition) => (
                    <div key={edition.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{edition.title}</p>
                        <div className="flex items-center gap-2">
                          {edition.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${edition.price.toFixed(2)}
                            </span>
                          )}
                          <span className="font-bold">
                            ${(edition.price * (1 - edition.discount / 100)).toFixed(2)}
                          </span>
                          {edition.discount > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                            >
                              {edition.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* DLC Card */}
          {game.dlc && game.dlc.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 font-semibold">Available DLC</h3>
                <div className="space-y-3">
                  {game.dlc.map((dlc) => (
                    <div key={dlc.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{dlc.title}</p>
                        <div className="flex items-center gap-2">
                          {dlc.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">${dlc.price.toFixed(2)}</span>
                          )}
                          <span className="font-bold">${(dlc.price * (1 - dlc.discount / 100)).toFixed(2)}</span>
                          {dlc.discount > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                            >
                              {dlc.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Info Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Game Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Developer</dt>
                  <dd>{developer?.name || game.developer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Publisher</dt>
                  <dd>{publisher?.name || game.publisher}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Release Date</dt>
                  <dd>{formattedReleaseDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Platforms</dt>
                  <dd>
                    {game.platformIds
                      .map((platformId) => {
                        const platform = getPlatformById(platformId)
                        return platform ? platform.name : platformId
                      })
                      .join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Genres</dt>
                  <dd>
                    {game.genreIds
                      .map((genreId) => {
                        const genre = getGenreById(genreId)
                        return genre ? genre.name : genreId
                      })
                      .join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                  <dd>{game.tags.join(", ")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
