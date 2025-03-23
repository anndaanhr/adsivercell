"use client"

import { Suspense } from "react"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { RecentlyViewed } from "@/components/recently-viewed"

export function ClientRecommendations() {
  return (
    <>
      {/* Personalized Recommendations */}
      <section className="container px-4 order-3">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted"></div>}>
          <PersonalizedRecommendations />
        </Suspense>
      </section>

      {/* Recently Viewed */}
      <section className="container px-4 order-2">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted"></div>}>
          <RecentlyViewed />
        </Suspense>
      </section>
    </>
  )
}

