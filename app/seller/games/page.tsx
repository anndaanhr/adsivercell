"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function SellerGamesPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [gameToDelete, setGameToDelete] = useState(null)

  useEffect(() => {
    fetchGames()
  }, [])

  async function fetchGames() {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Fetch games for this seller
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setGames(data || [])
    } catch (error) {
      console.error("Error fetching games:", error)
      toast({
        title: "Error",
        description: "Failed to load your games. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteGame() {
    if (!gameToDelete) return

    try {
      const { error } = await supabase.from("games").delete().eq("id", gameToDelete.id)

      if (error) {
        throw error
      }

      // Remove from local state
      setGames(games.filter((game) => game.id !== gameToDelete.id))

      toast({
        title: "Game Deleted",
        description: `"${gameToDelete.title}" has been removed from your catalog.`,
      })

      setGameToDelete(null)
    } catch (error) {
      console.error("Error deleting game:", error)
      toast({
        title: "Error",
        description: "Failed to delete the game. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter games based on search query
  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Your Games</h1>
          <p className="text-muted-foreground">View, edit, and manage your game catalog</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/seller/games/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Game
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Game Catalog</CardTitle>
          <CardDescription>
            You have {games.length} game{games.length !== 1 ? "s" : ""} in your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>${game.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {game.discount > 0 ? (
                          <Badge className="bg-green-500 hover:bg-green-600">{game.discount}% OFF</Badge>
                        ) : (
                          <span className="text-muted-foreground">No discount</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/games/${game.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/seller/games/edit/${game.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setGameToDelete(game)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{gameToDelete?.title}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setGameToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteGame} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Trash2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No games found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "No games match your search query." : "You haven't added any games to your catalog yet."}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/seller/games/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Game
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

