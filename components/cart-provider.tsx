"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Game } from "@/lib/types"

export interface CartItem extends Game {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (game: Game) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (game: Game) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === game.id)

      if (existingItem) {
        // If item already exists, increase quantity
        return prevCart.map((item) => (item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Otherwise, add new item with quantity 1
        return [...prevCart, { ...game, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

