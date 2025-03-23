"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import type { CartItem } from "@/lib/types"
import { useCart } from "@/components/cart-provider"

interface SavedCart {
  id: string
  name: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

interface SavedCartContextType {
  savedCarts: SavedCart[]
  saveCurrentCart: (name: string) => void
  loadSavedCart: (id: string) => void
  deleteSavedCart: (id: string) => void
  renameSavedCart: (id: string, name: string) => void
}

const SavedCartContext = createContext<SavedCartContextType | undefined>(undefined)

export function SavedCartProvider({ children }: { children: React.ReactNode }) {
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([])
  const { toast } = useToast()
  const { user } = useAuth()
  const { cart, clearCart, addToCart } = useCart()

  // Load saved carts from localStorage on initial render
  useEffect(() => {
    if (!user) return

    const userId = user.id
    const savedCartsKey = `zafago_saved_carts_${userId}`
    const savedCartsData = localStorage.getItem(savedCartsKey)

    if (savedCartsData) {
      try {
        setSavedCarts(JSON.parse(savedCartsData))
      } catch (error) {
        console.error("Failed to parse saved carts from localStorage:", error)
      }
    }
  }, [user])

  // Save carts to localStorage whenever they change
  useEffect(() => {
    if (!user) return

    const userId = user.id
    const savedCartsKey = `zafago_saved_carts_${userId}`
    localStorage.setItem(savedCartsKey, JSON.stringify(savedCarts))
  }, [savedCarts, user])

  const saveCurrentCart = (name: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save your cart.",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before saving.",
        variant: "destructive",
      })
      return
    }

    const newSavedCart: SavedCart = {
      id: `cart_${Date.now()}`,
      name,
      items: cart,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSavedCarts((prev) => [...prev, newSavedCart])

    toast({
      title: "Cart saved",
      description: `Your cart has been saved as "${name}".`,
    })
  }

  const loadSavedCart = (id: string) => {
    const savedCart = savedCarts.find((cart) => cart.id === id)

    if (!savedCart) {
      toast({
        title: "Cart not found",
        description: "The saved cart could not be found.",
        variant: "destructive",
      })
      return
    }

    // Clear current cart and add saved items
    clearCart()
    savedCart.items.forEach((item) => {
      addToCart(item)
    })

    toast({
      title: "Cart loaded",
      description: `Your saved cart "${savedCart.name}" has been loaded.`,
    })
  }

  const deleteSavedCart = (id: string) => {
    setSavedCarts((prev) => prev.filter((cart) => cart.id !== id))

    toast({
      title: "Cart deleted",
      description: "Your saved cart has been deleted.",
    })
  }

  const renameSavedCart = (id: string, name: string) => {
    setSavedCarts((prev) =>
      prev.map((cart) => (cart.id === id ? { ...cart, name, updatedAt: new Date().toISOString() } : cart)),
    )

    toast({
      title: "Cart renamed",
      description: `Your saved cart has been renamed to "${name}".`,
    })
  }

  return (
    <SavedCartContext.Provider
      value={{
        savedCarts,
        saveCurrentCart,
        loadSavedCart,
        deleteSavedCart,
        renameSavedCart,
      }}
    >
      {children}
    </SavedCartContext.Provider>
  )
}

export function useSavedCart() {
  const context = useContext(SavedCartContext)
  if (context === undefined) {
    throw new Error("useSavedCart must be used within a SavedCartProvider")
  }
  return context
}

