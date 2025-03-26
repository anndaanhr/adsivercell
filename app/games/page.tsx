import { Suspense } from "react"
import { Gamepad2 } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { GameCardSkeleton } from "@/components/game-card-skeleton"
import { AdvancedFilter } from "@/components/advanced-filter"

export const dynamic = "force-dynamic"

async function GamesContent({ searchParams }: { searchParams: any }) {
  const supabase = createServerComponentClient({ cookies })

  // Start with a base query
  let query = supabase.from("games").select("*")

  // Apply filters based on search params
  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`)
  }

  if (searchParams.genre) {
    const genres = Array.isArray(searchParams.genre) ? searchParams.genre : [searchParams.genre]

    // This assumes genres are stored as a JSON array
    genres.forEach((genre) => {
      query = query.contains("genres", [genre])
    })
  }

  if (searchParams.platform) {
    const platforms = Array.isArray(searchParams.platform) ? searchParams.platform : [searchParams.platform]

    platforms.forEach((platform) => {
      query = query.contains("platforms", [platform])
    })
  }

  if (searchParams.min) {
    query = query.gte("price", Number.parseFloat(searchParams.min))
  }

  if (searchParams.max) {
    query = query.lte("price", Number.parseFloat(searchParams.max))
  }

  if (searchParams.sale === "true") {
    query = query.gt("discount", 0)
  }

  // Apply sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "name-asc":
        query = query.order("title", { ascending: true })
        break
      case "name-desc":
        query = query.order("title", { ascending: false })
        break
      case "release-desc":
        query = query.order("release_date", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    // Default sorting
    query = query.order("created_at", { ascending: false })
  }

  const { data: games, error } = await query

  if (error) {
    console.error("Error fetching games:", error)
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Gamepad2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-medium">Error loading games</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          There was a problem fetching the games. Please try again later.
        </p>
      </div>
    )
  }

  // Convert Supabase data to match the Game type
  const formattedGames = games.map((game) => ({
    id: game.id,
    title: game.title,
    description: game.description,
    price: game.price,
    discount: game.discount || 0,
    image: game.cover_image_url,
    releaseDate: game.release_date,
    developer: game.developer,
    publisher: game.publisher,
    genres: Array.isArray(game.genres) ? game.genres : [],
    platforms: Array.isArray(game.platforms) ? game.platforms : [],
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{formattedGames.length}</span> games
        </p>
      </div>

      {formattedGames.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {formattedGames.map((game) => (
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
          <Button href="/games">Reset Filters</Button>
        </div>
      )}
    </div>
  )
}

export default function GamesPage({ searchParams }: { searchParams: any }) {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Games Catalog</h1>
        <p className="text-muted-foreground">Browse our collection of games for various platforms</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <AdvancedFilter
          totalGames={0} // This will be updated by the client component
          initialFilters={{
            search: searchParams.q || "",
            genres: Array.isArray(searchParams.genre)
              ? searchParams.genre
              : searchParams.genre
                ? [searchParams.genre]
                : [],
            platforms: Array.isArray(searchParams.platform)
              ? searchParams.platform
              : searchParams.platform
                ? [searchParams.platform]
                : [],
            priceRange: [Number(searchParams.min || 0), Number(searchParams.max || 100)],
            rating: searchParams.rating ? Number(searchParams.rating) : null,
            releaseYear: searchParams.year || null,
            onSale: searchParams.sale === "true",
            sortBy: searchParams.sort || "relevance",
          }}
        />

        {/* Games Grid */}
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
            </div>
          }
        >
          <GamesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

