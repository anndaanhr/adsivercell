import { BundleCardSkeleton } from "@/components/bundle-card-skeleton"

export default function BundlesLoading() {
  return (
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
  )
}

