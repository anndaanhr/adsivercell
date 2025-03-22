import Link from "next/link"
import { Building2, Users, ArrowRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getPublishers, getGames } from "@/lib/data"

interface PublishersPageProps {
  searchParams: {
    q?: string
  }
}

export default async function PublishersPage({ searchParams }: PublishersPageProps) {
  const allPublishers = await getPublishers()
  const games = await getGames()

  // Filter publishers based on search query
  let publishers = [...allPublishers]
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase()
    publishers = publishers.filter((publisher) => publisher.toLowerCase().includes(query))
  }

  // Sort publishers alphabetically
  publishers.sort((a, b) => a.localeCompare(b))

  // Get featured publishers (those with most games)
  const publisherGameCounts = allPublishers.map((publisher) => {
    const publisherGames = games.filter((game) => game.publisher === publisher)
    return {
      name: publisher,
      gameCount: publisherGames.length,
      games: publisherGames,
    }
  })

  publisherGameCounts.sort((a, b) => b.gameCount - a.gameCount)
  const featuredPublishers = publisherGameCounts.slice(0, 4)

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Game Publishers</h1>
            <p className="mt-2 max-w-xl">
              Browse games by your favorite publishers. Discover complete collections and exclusive titles.
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search publishers..." className="pl-10 text-slate-900 dark:text-slate-50" />
          </div>
        </div>
      </div>

      {/* Featured Publishers */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Publishers</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPublishers.map((publisher) => (
            <Card key={publisher.name} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  {publisher.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {publisher.gameCount} {publisher.gameCount === 1 ? "game" : "games"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-1 p-1">
                  {publisher.games.slice(0, 3).map((game) => (
                    <div key={game.id} className="aspect-square overflow-hidden">
                      <img
                        src={game.image || "/placeholder.svg?height=100&width=100"}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/publishers/${encodeURIComponent(publisher.name)}`}>
                    View All Games
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* All Publishers */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">All Publishers</h2>

        {/* Alphabet Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
            <Link
              key={letter}
              href={`#${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground"
            >
              {letter}
            </Link>
          ))}
        </div>

        <div className="space-y-8">
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => {
            const publishersWithLetter = publishers.filter((publisher) => publisher.charAt(0).toUpperCase() === letter)

            if (publishersWithLetter.length === 0) return null

            return (
              <div key={letter} id={letter}>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {letter}
                  </div>
                  <span>Publishers</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {publishersWithLetter.map((publisher) => {
                    const publisherGames = games.filter((game) => game.publisher === publisher)
                    return (
                      <Link
                        key={publisher}
                        href={`/publishers/${encodeURIComponent(publisher)}`}
                        className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <h4 className="font-medium group-hover:text-primary">{publisher}</h4>
                        <p className="text-sm text-muted-foreground">
                          {publisherGames.length} {publisherGames.length === 1 ? "game" : "games"}
                        </p>
                      </Link>
                    )
                  })}
                </div>

                <Separator className="mt-6" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

