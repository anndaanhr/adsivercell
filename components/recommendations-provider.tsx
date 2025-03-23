"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { games, getRelatedGames } from "@/lib/game-database"
import type { Game } from "@/lib/types"

interface RecommendationsContextType {
  recentlyViewed: Game[]
  addToRecentlyViewed: (gameId: string) => void
  clearRecentlyViewed: () => void
  getPersonalizedRecommendations: (limit?: number) => Game[]
  getSimilarToRecentlyViewed: (limit?: number) => Game[]
  getBasedOnCart: (limit?: number) => Game[]
  getPopularInGenres: (genreIds: string[], limit?: number) => Game[]
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined)

const MAX_RECENTLY_VIEWED = 20
const isServer = typeof window === "undefined"

export function RecommendationsProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Game[]>([])
  const { user } = useAuth()
  const { cart } = useCart()

  // Load recently viewed games from localStorage on initial render
  useEffect(() => {
    if (!user || isServer) return

    const userId = user.id
    const recentlyViewedKey = `zafago_recently_viewed_${userId}`
    const storedRecentlyViewed = localStorage.getItem(recentlyViewedKey)

    if (storedRecentlyViewed) {
      try {
        const gameIds = JSON.parse(storedRecentlyViewed)
        const loadedGames = gameIds.map((id) => games.find((game) => game.id === id)).filter(Boolean) as Game[]
        setRecentlyViewed(loadedGames)
      } catch (error) {
        console.error("Failed to parse recently viewed games from localStorage:", error)
      }
    }
  }, [user])

  // Save recently viewed games to localStorage whenever they change
  useEffect(() => {
    if (!user || isServer) return

    const userId = user.id
    const recentlyViewedKey = `zafago_recently_viewed_${userId}`
    const gameIds = recentlyViewed.map((game) => game.id)
    localStorage.setItem(recentlyViewedKey, JSON.stringify(gameIds))
  }, [recentlyViewed, user])

  const addToRecentlyViewed = (gameId: string) => {
    const game = games.find((g) => g.id === gameId)
    if (!game) return

    setRecentlyViewed((prev) => {
      // Remove the game if it's already in the list
      const filtered = prev.filter((g) => g.id !== gameId)
      // Add the game to the beginning of the list
      const updated = [game, ...filtered]
      // Limit the list to MAX_RECENTLY_VIEWED items
      return updated.slice(0, MAX_RECENTLY_VIEWED)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const getPersonalizedRecommendations = (limit = 10): Game[] => {
    // Start with an empty set of recommendations
    const recommendations: Game[] = []

    // Add games based on recently viewed
    const recentlyViewedRecs = getSimilarToRecentlyViewed(limit / 2)
    recommendations.push(...recentlyViewedRecs)

    // Add games based on cart
    const cartRecs = getBasedOnCart(limit / 2)
    recommendations.push(...cartRecs)

    // If we still need more recommendations, add popular games
    if (recommendations.length < limit) {
      // Get popular games that aren't already in the recommendations
      const popularGames = [...games]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .filter((game) => !recommendations.some((rec) => rec.id === game.id))
        .slice(0, limit - recommendations.length)

      recommendations.push(...popularGames)
    }

    // Shuffle the recommendations to mix them up
    return shuffleArray(recommendations.slice(0, limit))
  }

  const getSimilarToRecentlyViewed = (limit = 5): Game[] => {
    if (recentlyViewed.length === 0) return []

    // Get recommendations based on the most recently viewed games
    const recentGames = recentlyViewed.slice(0, 3)
    const recommendations: Game[] = []

    for (const game of recentGames) {
      const similar = getRelatedGames(game.id, limit / recentGames.length).filter(
        (g) => !recommendations.some((rec) => rec.id === g.id),
      )
      recommendations.push(...similar)
    }

    return recommendations.slice(0, limit)
  }

  const getBasedOnCart = (limit = 5): Game[] => {
    if (cart.length === 0) return []

    // Get recommendations based on the games in the cart
    const cartGames = cart.map((item) => games.find((g) => g.id === item.id)).filter(Boolean) as Game[]
    const recommendations: Game[] = []

    for (const game of cartGames) {
      const similar = getRelatedGames(game.id, limit / cartGames.length).filter(
        (g) => !recommendations.some((rec) => rec.id === g.id),
      )
      recommendations.push(...similar)
    }

    return recommendations.slice(0, limit)
  }

  const getPopularInGenres = (genreIds: string[], limit = 5): Game[] => {
    if (genreIds.length === 0) return []

    // Get popular games in the specified genres
    const genreGames = games
      .filter((game) => game.genreIds?.some((id) => genreIds.includes(id)))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)

    return genreGames
  }

  // Helper function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  return (
    <RecommendationsContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        getPersonalizedRecommendations,
        getSimilarToRecentlyViewed,
        getBasedOnCart,
        getPopularInGenres,
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  )
}

export function useRecommendations() {
  const context = useContext(RecommendationsContext)
  if (context === undefined) {
    throw new Error("useRecommendations must be used within a RecommendationsProvider")
  }
  return context
}

