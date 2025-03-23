"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { initializeDb } from "@/app/actions/initialize-db"
import { useToast } from "@/hooks/use-toast"

export function InitializeDbButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInitializeDb = async () => {
    setIsLoading(true)
    try {
      const result = await initializeDb()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleInitializeDb} disabled={isLoading}>
      {isLoading ? "Initializing..." : "Initialize Database"}
    </Button>
  )
}

