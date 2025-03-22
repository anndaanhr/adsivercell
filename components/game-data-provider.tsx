"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { initialGames, initialBundles, initialReviews } from "@/lib/game-data"
import type { Game, Bundle, Review } from "@/lib/types"

interface GameDataContextType {
  games: Game[]
  bundles: Bundle[]
  reviews: Review[]
  updateGame: (id: string, updatedGame: Partial<Game>) => void
  addGame: (game: Game) => void
  removeGame: (id: string) => void
  updateBundle: (id: string, updatedBundle: Partial<Bundle>) => void
  addBundle: (bundle: Bundle) => void
  removeBundle: (id: string) => void
  addReview: (review: Review) => void
  updateReview: (id: string, updatedReview: Partial<Review>) => void
  removeReview: (id: string) => void
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined)

export function GameDataProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedGames = localStorage.getItem("games")
    const storedBundles = localStorage.getItem("bundles")
    const storedReviews = localStorage.getItem("reviews")

    if (storedGames) setGames(JSON.parse(storedGames))
    if (storedBundles) setBundles(JSON.parse(storedBundles))
    if (storedReviews) setReviews(JSON.parse(storedReviews))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games))
  }, [games])

  useEffect(() => {
    localStorage.setItem("bundles", JSON.stringify(bundles))
  }, [bundles])

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews))
  }, [reviews])

  // Game CRUD operations
  const updateGame = (id: string, updatedGame: Partial<Game>) => {
    setGames((prevGames) => prevGames.map((game) => (game.id === id ? { ...game, ...updatedGame } : game)))
  }

  const addGame = (game: Game) => {
    setGames((prevGames) => [...prevGames, game])
  }

  const removeGame = (id: string) => {
    setGames((prevGames) => prevGames.filter((game) => game.id !== id))
  }

  // Bundle CRUD operations
  const updateBundle = (id: string, updatedBundle: Partial<Bundle>) => {
    setBundles((prevBundles) =>
      prevBundles.map((bundle) => (bundle.id === id ? { ...bundle, ...updatedBundle } : bundle)),
    )
  }

  const addBundle = (bundle: Bundle) => {
    setBundles((prevBundles) => [...prevBundles, bundle])
  }

  const removeBundle = (id: string) => {
    setBundles((prevBundles) => prevBundles.filter((bundle) => bundle.id !== id))
  }

  // Review CRUD operations
  const addReview = (review: Review) => {
    setReviews((prevReviews) => [...prevReviews, review])
  }

  const updateReview = (id: string, updatedReview: Partial<Review>) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => (review.id === id ? { ...review, ...updatedReview } : review)),
    )
  }

  const removeReview = (id: string) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id))
  }

  return (
    <GameDataContext.Provider
      value={{
        games,
        bundles,
        reviews,
        updateGame,
        addGame,
        removeGame,
        updateBundle,
        addBundle,
        removeBundle,
        addReview,
        updateReview,
        removeReview,
      }}
    >
      {children}
    </GameDataContext.Provider>
  )
}

export function useGameData() {
  const context = useContext(GameDataContext)
  if (context === undefined) {
    throw new Error("useGameData must be used within a GameDataProvider")
  }
  return context
}

