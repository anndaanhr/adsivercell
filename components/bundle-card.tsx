"use client"

import Link from "next/link"
import { Package, Percent } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Bundle, Game } from "@/lib/types"

interface BundleCardProps {
  bundle: Bundle
  games: Game[]
}

export function BundleCard({ bundle, games = [] }: BundleCardProps) {
  // Ensure gameIds is an array before filtering
  const gameIds = Array.isArray(bundle.gameIds) ? bundle.gameIds : []
  const includedGames = gameIds.map((id) => games.find((game) => game.id === id)).filter(Boolean) as Game[]

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-r from-blue-600/90 to-indigo-600/90 p-4">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{bundle.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  <Package className="mr-1 h-3 w-3" />
                  {gameIds.length} Games
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  <Percent className="mr-1 h-3 w-3" />
                  {bundle.discount}% OFF
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 rounded-tl-lg bg-primary/90 px-3 py-1 text-lg font-bold text-white">
          ${bundle.price.toFixed(2)}
        </div>
      </div>
      <CardContent className="p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{bundle.description}</p>
        <div className="mt-3 space-y-2">
          {includedGames.slice(0, 3).map((game) => (
            <div key={game.id} className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                <img
                  src={game.image || "/placeholder.svg?height=32&width=32"}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs">{game.title}</span>
            </div>
          ))}
          {includedGames.length > 3 && (
            <div className="text-xs text-muted-foreground">+{includedGames.length - 3} more games</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm">
          <span className="text-muted-foreground line-through">${bundle.originalPrice.toFixed(2)}</span>
          <span className="ml-2 text-green-600 dark:text-green-500">
            Save ${(bundle.originalPrice - bundle.price).toFixed(2)}
          </span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

