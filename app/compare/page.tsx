import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GameComparison } from "@/components/game-comparison"

export default function ComparePage() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <Link href="/games">
          <Button variant="ghost" className="mb-4 flex items-center gap-2 pl-0 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Compare Games</h1>
        <p className="text-muted-foreground">
          Compare features, prices, and specifications of different games side by side
        </p>
      </div>

      <Suspense fallback={<div>Loading comparison...</div>}>
        <GameComparison />
      </Suspense>
    </div>
  )
}

