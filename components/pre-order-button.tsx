"use client"

import type React from "react"

import { useState } from "react"
import { CalendarClock, Check, RefreshCw } from "lucide-react"

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
import { AnimatedButton } from "@/components/animated-button"
import { useToast } from "@/hooks/use-toast"
import type { Game } from "@/lib/types"

interface PreOrderButtonProps {
  game: Game
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function PreOrderButton({ game, variant = "default", size = "default", className = "" }: PreOrderButtonProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePreOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to pre-order this game",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      toast({
        title: "Pre-order successful!",
        description: `You'll be notified when ${game.title} is available.`,
        variant: "default",
      })
    }, 1500)
  }

  const resetForm = () => {
    setEmail("")
    setIsSuccess(false)
    setIsOpen(false)
  }

  const releaseDate = new Date(game.releaseDate)
  const formattedReleaseDate = releaseDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <CalendarClock className="mr-2 h-4 w-4" />
          Pre-order Now
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pre-order {game.title}</DialogTitle>
          <DialogDescription>Be the first to play when it releases on {formattedReleaseDate}.</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="h-5 w-5" />
                <h3 className="font-medium">Pre-order Confirmed!</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll notify you at {email} when {game.title} is available for download.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What happens next?</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>You'll receive a confirmation email shortly</li>
                <li>We'll notify you when the game is available for pre-load</li>
                <li>Your payment will be processed on the release date</li>
                <li>You'll get instant access when the game launches</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePreOrder} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">We'll notify you when the game is available for download.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Price:</span>
                <span className="font-bold">${game.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Release Date:</span>
                <span>{formattedReleaseDate}</span>
              </div>
            </div>
          </form>
        )}

        <DialogFooter>
          {isSuccess ? (
            <Button onClick={resetForm}>Close</Button>
          ) : (
            <AnimatedButton type="submit" onClick={handlePreOrder} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Pre-order"
              )}
            </AnimatedButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

