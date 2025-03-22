"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, StarHalf, User, ThumbsUp, Flag, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import type { Review } from "@/lib/types"

interface GameReviewsProps {
  gameId: string
  initialReviews: Review[]
}

export function GameReviews({ gameId, initialReviews }: GameReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating)
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to leave a review.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (newReview.trim() === "") {
      toast({
        title: "Review cannot be empty",
        description: "Please write something in your review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You need to give a star rating for your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/games/${gameId}/reviews`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text: newReview, rating }),
      // })
      // const data = await response.json()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new review object
      const newReviewObj: Review = {
        id: `review_${Date.now()}`,
        gameId,
        userId: user.id,
        userName: user.name || user.email.split("@")[0],
        text: newReview,
        rating,
        date: new Date().toISOString(),
        likes: 0,
        userImage: user.image,
      }

      // Add the new review to the list
      setReviews([newReviewObj, ...reviews])
      setNewReview("")
      setRating(0)
      setHoveredRating(0)

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeReview = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to like reviews.",
        variant: "destructive",
      })
      return
    }

    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }

    return stars
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">{renderStars(averageRating)}</div>
          <span className="font-medium">
            {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {/* Write a review */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium">Write a Review</h3>
        <div className="mb-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
              onMouseLeave={() => handleRatingHover(0)}
              className="rounded-full p-1 transition-colors hover:bg-muted"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `You rated this ${rating} ${rating === 1 ? "star" : "stars"}` : "Select a rating"}
          </span>
        </div>
        <Textarea
          placeholder="Share your experience with this game..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button onClick={handleSubmitReview} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.userImage} alt={review.userName} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLikeReview(review.id)}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Like
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-muted-foreground">{review.text}</p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleLikeReview(review.id)}>
                  <ThumbsUp className="mr-2 h-3 w-3" />
                  Helpful ({review.likes})
                </Button>
              </div>
              <Separator />
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this game!</p>
          </div>
        )}
      </div>
    </div>
  )
}

