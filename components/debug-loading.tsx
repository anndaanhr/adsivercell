"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function DebugLoading() {
  const [isVisible, setIsVisible] = useState(false)
  const [loadingTimes, setLoadingTimes] = useState<{ path: string; time: number; timestamp: number }[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV !== "development") return

    const startTime = performance.now()
    const path = window.location.pathname + window.location.search

    const checkLoading = () => {
      const loadingElements = document.querySelectorAll(".animate-pulse")
      if (loadingElements.length > 0) {
        return true
      }
      return false
    }

    const interval = setInterval(() => {
      if (!checkLoading()) {
        const endTime = performance.now()
        const loadTime = Math.round(endTime - startTime)

        setLoadingTimes((prev) => {
          const newTimes = [...prev, { path, time: loadTime, timestamp: Date.now() }]
          // Keep only the last 10 entries
          return newTimes.slice(-10)
        })

        clearInterval(interval)
      }
    }, 100)

    // If still loading after 5 seconds, show debug panel
    const timeout = setTimeout(() => {
      if (checkLoading()) {
        setIsVisible(true)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Loading Debug</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Loading is taking longer than expected.</p>
            <Button variant="link" size="sm" className="h-6 p-0 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Hide details" : "Show details"}
            </Button>

            {isExpanded && (
              <div className="mt-2 space-y-1">
                <p>Recent loading times:</p>
                <ul className="space-y-1">
                  {loadingTimes.map((item, i) => (
                    <li key={i}>
                      {new URL(item.path, window.location.origin).pathname}: {item.time}ms
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

