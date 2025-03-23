"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Key, Copy, Check, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getOrdersByUserId } from "@/lib/storage"

interface GameKey {
  id: string
  gameId: string
  key: string
  platform: string
  isRedeemed: boolean
  redeemedAt?: string
}

export default function GameKeysPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [gameKeys, setGameKeys] = useState<GameKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      // Load orders to extract game keys
      const userOrders = getOrdersByUserId(user.id)

      // In a real app, you would have a separate table for game keys
      // For this demo, we'll generate mock keys from orders
      const keys: GameKey[] = []

      userOrders.forEach((order) => {
        if (order.status === "completed") {
          order.items.forEach((item, index) => {
            // Generate a mock key for each item
            keys.push({
              id: `key_${order.id}_${index}`,
              gameId: item.gameId,
              key: `XXXX-XXXX-XXXX-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              platform: ["Steam", "Epic", "GOG"][Math.floor(Math.random() * 3)],
              isRedeemed: Math.random() > 0.5,
              redeemedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
            })
          })
        }
      })

      setGameKeys(keys)
      setIsLoading(false)
    }
  }, [user])

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKeys({ ...copiedKeys, [key]: true })

    toast({
      title: "Key copied",
      description: "Game key has been copied to clipboard",
    })

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKeys({ ...copiedKeys, [key]: false })
    }, 2000)
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Game Keys</CardTitle>
          <CardDescription>Loading your game keys...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Game Keys</CardTitle>
        <CardDescription>Access and manage your purchased game keys</CardDescription>
      </CardHeader>
      <CardContent>
        {gameKeys.length > 0 ? (
          <div className="space-y-4">
            {gameKeys.map((gameKey) => (
              <div key={gameKey.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Game #{gameKey.gameId}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{gameKey.platform}</span>
                      {gameKey.isRedeemed && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Redeemed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleCopyKey(gameKey.key)}
                      disabled={gameKey.isRedeemed}
                    >
                      {copiedKeys[gameKey.key] ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a
                        href={`https://${gameKey.platform.toLowerCase()}.com/activate`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Activate
                      </a>
                    </Button>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">{gameKey.key}</div>
                  {gameKey.isRedeemed && gameKey.redeemedAt && (
                    <div className="text-xs text-muted-foreground">
                      Redeemed on {new Date(gameKey.redeemedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Key className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No game keys yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              You haven't purchased any games yet. Buy games to receive your activation keys here.
            </p>
            <Button asChild>
              <Link href="/games">Browse Games</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

