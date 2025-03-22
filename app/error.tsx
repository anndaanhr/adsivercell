"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <AlertTriangle className="mb-6 h-20 w-20 text-destructive" />
      <h1 className="mb-4 text-4xl font-bold">Something went wrong!</h1>
      <p className="mb-2 max-w-md text-muted-foreground">We're sorry, but we encountered an unexpected error.</p>
      <p className="mb-6 text-sm text-muted-foreground">
        {error.message || "Please try again or contact support if the problem persists."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

