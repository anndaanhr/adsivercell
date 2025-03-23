"use client"

import { Loader2 } from "lucide-react"

interface LoadingIndicatorProps {
  fullScreen?: boolean
  message?: string
}

export function LoadingIndicator({ fullScreen = false, message = "Loading..." }: LoadingIndicatorProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8"

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

