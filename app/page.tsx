import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ArrowRight, ChevronRight, Gamepad2, Zap, ShieldCheck, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GameCard } from "@/components/game-card"
import { FeaturedGame } from "@/components/featured-game"
import { getGames } from "@/lib/data"

export default async function Home() {
  const games = await getGames()

  // Add a check to ensure games array is not empty
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">No games available</h1>
        <p className="text-muted-foreground mb-8">Please check back later for our game catalog.</p>
        <Button asChild>
          <Link href="/marketplace">Visit Marketplace</Link>
        </Button>
      </div>
    )
  }

  const featuredGame = games[0]
  const newReleases = games.slice(1, 5)
  const topSellers = [...games].sort(() => Math.random() - 0.5).slice(0, 4)
  const deals = [...games]
    .filter((game) => game.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background pt-8">
        <div className="container px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit">Summer Sale - Up to 80% Off</Badge>
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Discover and Play <span className="text-primary">Amazing Games</span>
              </h1>
              <p className="mb-8 max-w-md text-muted-foreground">
                Get the best deals on game keys for Steam, Epic Games, and more. Instant delivery, secure payments, and
                24/7 customer support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/games">
                    Browse Games
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/deals">View Deals</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Featured games collage"
                width={800}
                height={600}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Featured Game */}
      <section className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Game</h2>
          <Link
            href="/games"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <FeaturedGame game={featuredGame} />
      </section>

      {/* Personalized Recommendations and Recently Viewed sections are removed from server component */}
      {/* They will be added in a client component */}

      {/* New Releases */}
      <section className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">New Releases</h2>
          <Link
            href="/games/new"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Top Sellers */}
      <section className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Top Sellers</h2>
          <Link
            href="/games/top"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topSellers.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Special Deals */}
      <section className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Special Deals</h2>
          <Link
            href="/deals"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {deals.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-12">
        <div className="container px-4">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Why Choose Zafago</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Huge Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Thousands of games for Steam, Epic Games, and other platforms at competitive prices.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Get your game keys instantly after purchase. No waiting, start playing right away.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Your transactions are protected with industry-standard encryption and secure payment methods.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                  <Tag className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Best Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Regular discounts, special offers, and competitive pricing to give you the best deals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container px-4">
        <div className="rounded-lg bg-primary/10 p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Stay Updated</h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to our newsletter to get the latest deals, game releases, and exclusive offers.
            </p>
            <form className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit" className="sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Client-side components that use localStorage */}
      <Suspense fallback={null}>
        <ClientRecommendations />
      </Suspense>
    </div>
  )
}

// Import the client component at the bottom to avoid issues with server component imports
import { ClientRecommendations } from "./client-recommendations"

