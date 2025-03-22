"use client"

import { useState, useEffect } from "react"
import { Star, Edit, Trash, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useReviews } from "@/components/review-provider"
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

interface ReviewFormProps {
  gameId: string
  gameName: string
}

export function ReviewForm({ gameId, gameName }: ReviewFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { addReview, updateReview, deleteReview, getUserHasReviewed, getUserReview } = useReviews()

  const [text, setText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Check if user has already reviewed this game
  const hasReviewed = getUserHasReviewed(gameId)
  const userReview = getUserReview(gameId)

  // Load user's existing review if they have one
  useEffect(() => {
    if (userReview && isEditing) {
      setText(userReview.text)
      setRating(userReview.rating)
    }
  }, [userReview, isEditing])

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (text.trim() === "") {
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
      if (isEditing && userReview) {
        // Update existing review
        await updateReview(userReview.id, {
          text,
          rating,
        })

        toast({
          title: "Review updated",
          description: "Your review has been updated successfully.",
        })

        setIsEditing(false)
      } else {
        // Add new review
        await addReview({
          gameId,
          userId: user.id,
          userName: user.name || user.email.split("@")[0],
          userImage: user.image,
          text,
          rating,
        })

        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        })
      }

      // Reset form
      setText("")
      setRating(0)
      setHoveredRating(0)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setText("")
    setRating(0)
  }

  const handleDelete = async () => {
    if (!userReview) return

    try {
      await deleteReview(userReview.id)

      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      })

      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete review. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Please log in to leave a review.</p>
        </div>
      </div>
    )
  }

  if (hasReviewed && !isEditing) {
    return (
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">Your Review</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your review for {gameName}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mb-2 flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= (userReview?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <p className="text-muted-foreground">{userReview?.text}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 font-medium">{isEditing ? "Edit Your Review" : "Write a Review"}</h3>
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
        placeholder={`Share your experience with ${gameName}...`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4 min-h-[100px]"
      />
      <div className="flex justify-end gap-2">
        {isEditing && (
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </div>
  )
}

