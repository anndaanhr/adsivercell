import { Suspense } from "react"
import GamesPage from "./page"
import { GameCardSkeleton } from "@/components/game-card-skeleton"

interface GamesPageServerProps {
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

export default function GamesPageServer({ searchParams }: GamesPageServerProps) {
  return (
    <Suspense
      fallback={
        <div className="container px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar Skeleton */}
            <div className="hidden md:block">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Games Grid Skeleton */}
            <div className="space-y-6">
              <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <GameCardSkeleton key={i} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <GamesPage searchParams={searchParams} />
    </Suspense>
  )
}

