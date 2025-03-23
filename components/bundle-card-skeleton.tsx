import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function BundleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[2/1] w-full" />
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="mb-4 h-8 w-full" />

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

