"use client"

import { useState } from "react"
import { Clock, Save, Trash, Edit, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSavedCart } from "@/components/saved-cart-provider"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns"

export function SavedCartsDialog() {
  const { savedCarts, saveCurrentCart, loadSavedCart, deleteSavedCart, renameSavedCart } = useSavedCart()
  const { user } = useAuth()
  const [newCartName, setNewCartName] = useState("")
  const [editCartId, setEditCartId] = useState<string | null>(null)
  const [editCartName, setEditCartName] = useState("")
  const [activeTab, setActiveTab] = useState<"load" | "save">("load")

  const handleSaveCart = () => {
    if (!newCartName.trim()) return
    saveCurrentCart(newCartName.trim())
    setNewCartName("")
  }

  const handleRenameCart = () => {
    if (!editCartId || !editCartName.trim()) return
    renameSavedCart(editCartId, editCartName.trim())
    setEditCartId(null)
    setEditCartName("")
  }

  if (!user) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Saved Carts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Saved Carts</DialogTitle>
          <DialogDescription>Save your current cart for later or load a previously saved cart.</DialogDescription>
        </DialogHeader>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "load" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("load")}
          >
            Load Cart
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "save" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("save")}
          >
            Save Current Cart
          </button>
        </div>

        {activeTab === "load" && (
          <div className="max-h-[300px] overflow-y-auto">
            {savedCarts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">You don't have any saved carts yet.</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {savedCarts.map((cart) => (
                  <div key={cart.id} className="rounded-md border p-4">
                    {editCartId === cart.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editCartName}
                          onChange={(e) => setEditCartName(e.target.value)}
                          placeholder="Cart name"
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleRenameCart}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditCartId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">{cart.name}</h3>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditCartId(cart.id)
                                setEditCartName(cart.name)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteSavedCart(cart.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Saved {formatDistanceToNow(new Date(cart.updatedAt))} ago</span>
                        </div>
                        <div className="mb-2 text-sm">
                          <span className="font-medium">{cart.items.length}</span> items in cart
                        </div>
                        <Button size="sm" onClick={() => loadSavedCart(cart.id)}>
                          Load Cart
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "save" && (
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cartName">Cart Name</Label>
                <Input
                  id="cartName"
                  value={newCartName}
                  onChange={(e) => setNewCartName(e.target.value)}
                  placeholder="e.g., Weekend Shopping, Gift Ideas"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button onClick={handleSaveCart} disabled={!newCartName.trim()}>
                Save Current Cart
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

