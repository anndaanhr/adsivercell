"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export function GlobalLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const isMounted = useRef(true)
  const currentPathRef = useRef("")
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialRender = useRef(true)

  // Set up initial path and mounted state
  useEffect(() => {
    isMounted.current = true
    currentPathRef.current = pathname + searchParams.toString()

    // Skip loading indicator on initial page load
    if (isInitialRender.current) {
      isInitialRender.current = false
    }

    // Cleanup function
    return () => {
      isMounted.current = false

      // Clear all timeouts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }
    }
  }, [])

  // Handle path changes
  useEffect(() => {
    // Skip if not mounted or on initial render
    if (!isMounted.current) return

    const newPath = pathname + searchParams.toString()

    // Only trigger loading if the path has actually changed
    if (currentPathRef.current !== newPath) {
      // Set loading state
      if (isMounted.current) {
        setIsLoading(true)
      }

      currentPathRef.current = newPath

      // Clear any existing timeouts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
      }

      // Set a timeout to hide the loading indicator
      loadingTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }, 500)

      // Safety timeout to ensure loading state is always cleared
      safetyTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }, 3000)
    }

    // Cleanup function
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }
    }
  }, [pathname, searchParams])

  // Don't render anything if not loading
  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-transparent overflow-hidden">
      <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-full shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  )
}

