import { Skeleton } from "@/components/ui/skeleton"

export function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[3/4]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="mb-1 h-5 w-full" />
        <Skeleton className="mb-3 h-6 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}

