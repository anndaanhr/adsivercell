"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"

interface ReviewContextType {
  reviews: Review[]
  userReviews: Review[]
  addReview: (review: Omit<Review, "id" | "date" | "likes">) => Promise<Review>
  updateReview: (id: string, updates: Partial<Omit<Review, "id" | "userId" | "gameId">>) => Promise<Review>
  deleteReview: (id: string) => Promise<void>
  likeReview: (id: string) => Promise<void>
  unlikeReview: (id: string) => Promise<void>
  getGameReviews: (gameId: string) => Review[]
  getUserHasReviewed: (gameId: string) => boolean
  getUserReview: (gameId: string) => Review | undefined
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  // Load reviews from localStorage on initial render
  useEffect(() => {
    const storedReviews = localStorage.getItem("zafago_reviews")
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews))
      } catch (error) {
        console.error("Failed to parse reviews from localStorage:", error)
      }
    }
  }, [])

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zafago_reviews", JSON.stringify(reviews))
  }, [reviews])

  // Get reviews for the current user
  const userReviews = user ? reviews.filter((review) => review.userId === user.id) : []

  // Add a new review
  const addReview = async (reviewData: Omit<Review, "id" | "date" | "likes">): Promise<Review> => {
    if (!user) {
      throw new Error("You must be logged in to leave a review")
    }

    // Check if user has already reviewed this game
    const existingReview = reviews.find((review) => review.userId === user.id && review.gameId === reviewData.gameId)

    if (existingReview) {
      throw new Error("You have already reviewed this game")
    }

    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      date: new Date().toISOString(),
      likes: 0,
      userLikes: [],
    }

    setReviews((prev) => [newReview, ...prev])
    return newReview
  }

  // Update an existing review
  const updateReview = async (
    id: string,
    updates: Partial<Omit<Review, "id" | "userId" | "gameId">>,
  ): Promise<Review> => {
    if (!user) {
      throw new Error("You must be logged in to update a review")
    }

    const reviewIndex = reviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error("Review not found")
    }

    const review = reviews[reviewIndex]
    if (review.userId !== user.id) {
      throw new Error("You can only update your own reviews")
    }

    const updatedReview = {
      ...review,
      ...updates,
      date: new Date().toISOString(), // Update the date to show it was edited
    }

    const updatedReviews = [...reviews]
    updatedReviews[reviewIndex] = updatedReview

    setReviews(updatedReviews)
    return updatedReview
  }

  // Delete a review
  const deleteReview = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to delete a review")
    }

    const review = reviews.find((review) => review.id === id)
    if (!review) {
      throw new Error("Review not found")
    }

    if (review.userId !== user.id) {
      throw new Error("You can only delete your own reviews")
    }

    setReviews((prev) => prev.filter((review) => review.id !== id))
  }

  // Like a review
  const likeReview = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to like a review")
    }

    const reviewIndex = reviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error("Review not found")
    }

    const review = reviews[reviewIndex]

    // Check if user has already liked this review
    if (review.userLikes && review.userLikes.includes(user.id)) {
      throw new Error("You have already liked this review")
    }

    const updatedReview = {
      ...review,
      likes: review.likes + 1,
      userLikes: [...(review.userLikes || []), user.id],
    }

    const updatedReviews = [...reviews]
    updatedReviews[reviewIndex] = updatedReview

    setReviews(updatedReviews)
  }

  // Unlike a review
  const unlikeReview = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to unlike a review")
    }

    const reviewIndex = reviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error("Review not found")
    }

    const review = reviews[reviewIndex]

    // Check if user has liked this review
    if (!review.userLikes || !review.userLikes.includes(user.id)) {
      throw new Error("You haven't liked this review")
    }

    const updatedReview = {
      ...review,
      likes: Math.max(0, review.likes - 1),
      userLikes: review.userLikes.filter((userId) => userId !== user.id),
    }

    const updatedReviews = [...reviews]
    updatedReviews[reviewIndex] = updatedReview

    setReviews(updatedReviews)
  }

  // Get reviews for a specific game
  const getGameReviews = (gameId: string): Review[] => {
    return reviews
      .filter((review) => review.gameId === gameId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Check if the current user has reviewed a specific game
  const getUserHasReviewed = (gameId: string): boolean => {
    if (!user) return false
    return reviews.some((review) => review.userId === user.id && review.gameId === gameId)
  }

  // Get the current user's review for a specific game
  const getUserReview = (gameId: string): Review | undefined => {
    if (!user) return undefined
    return reviews.find((review) => review.userId === user.id && review.gameId === gameId)
  }

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        userReviews,
        addReview,
        updateReview,
        deleteReview,
        likeReview,
        unlikeReview,
        getGameReviews,
        getUserHasReviewed,
        getUserReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider")
  }
  return context
}

