"use client"

import { useState } from "react"
import { User, Star, StarHalf, ThumbsUp, Flag, MoreHorizontal, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReviews } from "@/components/review-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"

interface ReviewListProps {
  gameId: string
}

export function ReviewList({ gameId }: ReviewListProps) {
  const { getGameReviews, likeReview, unlikeReview } = useReviews()
  const { user } = useAuth()
  const { toast } = useToast()

  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")
  const [filterBy, setFilterBy] = useState<"all" | "verified" | "5star" | "4star" | "3star" | "2star" | "1star">("all")

  // Get reviews for this game
  const allReviews = getGameReviews(gameId)

  // Filter reviews
  const filteredReviews = allReviews.filter((review) => {
    switch (filterBy) {
      case "verified":
        return review.verified === true
      case "5star":
        return review.rating === 5
      case "4star":
        return review.rating === 4
      case "3star":
        return review.rating === 3
      case "2star":
        return review.rating === 2
      case "1star":
        return review.rating === 1
      default:
        return true
    }
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Calculate average rating
  const averageRating =
    allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length : 0

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 1-star to 5-star counts
  allReviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++
    }
  })

  const handleLikeReview = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to like reviews.",
        variant: "destructive",
      })
      return
    }

    try {
      await likeReview(reviewId)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUnlikeReview = async (reviewId: string) => {
    if (!user) return

    try {
      await unlikeReview(reviewId)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unlike review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReport = (reviewId: string) => {
    toast({
      title: "Report submitted",
      description: "Thank you for reporting this review. We'll look into it.",
    })
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

  const userHasLiked = (review: Review) => {
    return review.userLikes && user && review.userLikes.includes(user.id)
  }

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center">{renderStars(averageRating)}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars - 1]
                const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0

                return (
                  <div key={stars} className="mb-1 flex items-center gap-2">
                    <div className="text-sm">{stars}</div>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 md:items-end">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <span className="text-sm">Filter:</span>
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="verified">Verified Purchases</SelectItem>
                <SelectItem value="5star">5 Star Only</SelectItem>
                <SelectItem value="4star">4 Star Only</SelectItem>
                <SelectItem value="3star">3 Star Only</SelectItem>
                <SelectItem value="2star">2 Star Only</SelectItem>
                <SelectItem value="1star">1 Star Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <span className="text-sm">Sort:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Reviews list */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
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
                      {review.verified && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                      </p>
                    </div>
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
                    <DropdownMenuItem onClick={() => handleReport(review.id)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-muted-foreground">{review.text}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-xs ${userHasLiked(review) ? "text-primary" : ""}`}
                  onClick={() => (userHasLiked(review) ? handleUnlikeReview(review.id) : handleLikeReview(review.id))}
                >
                  <ThumbsUp className="mr-2 h-3 w-3" />
                  Helpful ({review.likes})
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <MessageSquare className="mr-2 h-3 w-3" />
                  Comment
                </Button>
              </div>
              <Separator />
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">No reviews match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

