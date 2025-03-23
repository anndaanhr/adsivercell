import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, Calendar, Tag, Filter, SortDesc } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GameCard } from "@/components/game-card"
import { getGames, getPublishers } from "@/lib/data"

interface PublisherPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    genre?: string
  }
}

export default async function PublisherPage({ params, searchParams }: PublisherPageProps) {
  const publisherName = decodeURIComponent(params.slug)
  const allGames = await getGames()
  const publishers = await getPublishers()

  // Check if publisher exists
  if (!publishers.includes(publisherName)) {
    notFound()
  }

  // Get games by this publisher
  let publisherGames = allGames.filter((game) => game.publisher === publisherName)

  // Apply genre filter if provided
  if (searchParams.genre) {
    publisherGames = publisherGames.filter((game) => game.genres.includes(searchParams.genre!))
  }

  // Sort games
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        publisherGames.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
          return priceA - priceB
        })
        break
      case "price-desc":
        publisherGames.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
          return priceB - priceA
        })
        break
      case "name-asc":
        publisherGames.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        publisherGames.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "release-date":
        publisherGames.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      case "discount":
        publisherGames.sort((a, b) => b.discount - a.discount)
        break
      default:
        publisherGames.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    }
  } else {
    // Default sort by release date (newest first)
    publisherGames.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  }

  // Get unique genres from this publisher's games
  const publisherGenres = [...new Set(publisherGames.flatMap((game) => game.genres))]

  // Calculate stats
  const totalGames = publisherGames.length
  const latestGame = publisherGames.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  )[0]
  const discountedGames = publisherGames.filter((game) => game.discount > 0)
  const highestDiscount = discountedGames.length > 0 ? Math.max(...discountedGames.map((game) => game.discount)) : 0

  return (
    <div className="container px-4 py-8">
      <Link
        href="/publishers"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Publishers
      </Link>

      {/* Publisher Header */}
      <div className="mb-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{publisherName}</h1>
            <p className="text-muted-foreground">
              {totalGames} {totalGames === 1 ? "game" : "games"} available
            </p>
          </div>
          <Button asChild>
            <Link href={`https://www.google.com/search?q=${encodeURIComponent(publisherName)} games`} target="_blank">
              Visit Official Website
            </Link>
          </Button>
        </div>
      </div>

      {/* Publisher Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Building2 className="h-10 w-10 text-slate-500" />
            <div>
              <h3 className="font-medium">Total Games</h3>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Calendar className="h-10 w-10 text-slate-500" />
            <div>
              <h3 className="font-medium">Latest Release</h3>
              <p className="text-lg font-bold">{latestGame?.releaseDate || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Tag className="h-10 w-10 text-slate-500" />
            <div>
              <h3 className="font-medium">Highest Discount</h3>
              <p className="text-2xl font-bold">{highestDiscount}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publisher Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About {publisherName}</CardTitle>
          <CardDescription>Publisher information and history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {publisherName} is a renowned game publisher with a diverse portfolio of titles across various genres. With
            a focus on quality and innovation, they have established themselves as a leading force in the gaming
            industry. Their catalog includes everything from indie gems to AAA blockbusters, catering to a wide range of
            gaming preferences.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <h4 className="mr-2 font-medium">Popular Genres:</h4>
            {publisherGenres.slice(0, 5).map((genre) => (
              <Link key={genre} href={`/publishers/${params.slug}?genre=${genre}`}>
                <Button variant="outline" size="sm">
                  {genre}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Games by {publisherName}</h2>
          <div className="flex items-center gap-4">
            <Select defaultValue={searchParams.genre || "all"}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {publisherGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue={searchParams.sort || "release-date"}>
              <SelectTrigger className="w-[180px]">
                <SortDesc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="release-date">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="discount">Biggest Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {publisherGames.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {publisherGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-medium">No games found</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              No games match your current filters. Try adjusting your selection.
            </p>
            <Button asChild>
              <Link href={`/publishers/${params.slug}`}>Reset Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

