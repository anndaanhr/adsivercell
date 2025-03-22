"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const isMounted = useRef(true)
  const prevPathRef = useRef("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set up initial state and cleanup
  useEffect(() => {
    isMounted.current = true
    prevPathRef.current = pathname || ""

    return () => {
      isMounted.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // Handle path changes with proper lifecycle management
  useEffect(() => {
    // Skip if not mounted or on initial render
    if (!isMounted.current || !pathname) return

    // Only trigger transition if the path has actually changed
    if (prevPathRef.current !== pathname) {
      setIsTransitioning(true)
      prevPathRef.current = pathname

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a timeout to update children and complete transition
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setDisplayChildren(children)

          // Small delay before removing transition effect
          setTimeout(() => {
            if (isMounted.current) {
              setIsTransitioning(false)
            }
          }, 50)
        }
      }, 300)
    } else {
      // If path hasn't changed but children have, update without transition
      setDisplayChildren(children)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning ? "opacity-0 translate-y-4 scale-98" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {displayChildren}
    </div>
  )
}

