"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Create a separate client component to use searchParams
function SearchDialogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize search from URL if available
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearch(query)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      setIsLoading(true)
      router.push(`/games?q=${encodeURIComponent(search.trim())}`)

      // Reset loading state after a short delay
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full flex-1">
      <Input
        type="text"
        placeholder="Search games, products, or categories..."
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={isLoading}
      />
    </form>
  )
}

// Main component that doesn't directly use searchParams
export function SearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Suspense fallback={<div className="w-full h-10 bg-muted animate-pulse rounded-md"></div>}>
            <SearchDialogContent />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}

