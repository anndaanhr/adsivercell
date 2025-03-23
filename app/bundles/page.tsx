import { Suspense } from "react"
import { BundleCardSkeleton } from "@/components/bundle-card-skeleton"
import { getBundles, getGames } from "@/lib/data"
import { BundlesClient } from "./page-client"

export default async function BundlesPage() {
  const bundles = await getBundles()
  const games = await getGames()

  // Calculate stats
  const totalBundles = bundles.length
  const highestDiscount = Math.max(...bundles.map((bundle) => bundle.discount))
  const biggestSavings = Math.max(
    ...bundles.map((bundle) => {
      const totalOriginalPrice = bundle.gameIds.reduce((total, gameId) => {
        const game = games.find((g) => g.id === gameId)
        return total + (game ? game.price : 0)
      }, 0)
      return totalOriginalPrice - bundle.price
    }),
  )

  return (
    <Suspense
      fallback={
        <div className="container px-4 py-8">
          <div className="mb-8 h-48 animate-pulse rounded-lg bg-muted"></div>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
            ))}
          </div>
          <div className="mb-12 h-96 animate-pulse rounded-lg bg-muted"></div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <BundleCardSkeleton key={i} />
              ))}
          </div>
        </div>
      }
    >
      <BundlesClient
        bundles={bundles}
        games={games}
        totalBundles={totalBundles}
        highestDiscount={highestDiscount}
        biggestSavings={biggestSavings}
      />
    </Suspense>
  )
}

