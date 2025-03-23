"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { GameCard } from "@/components/game-card"
import { useRecommendations } from "@/components/recommendations-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentlyViewed() {
  const [isClient, setIsClient] = useState(false)
  const { recentlyViewed, clearRecentlyViewed } = useRecommendations()

  // Only run on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recently Viewed</h2>
          <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            Clear history
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recently Viewed</h2>
        <button
          onClick={() => clearRecentlyViewed()}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Clear history
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recentlyViewed.slice(0, 4).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

