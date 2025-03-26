"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { initializeDatabase } from "@/app/actions/initialize-db"

export function InitializeDbButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleInitialize = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const result = await initializeDatabase()
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleInitialize} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing...
          </>
        ) : (
          "Initialize Database with Sample Games"
        )}
      </Button>

      {result && (
        <div className={`p-4 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {result.success ? result.message : `Error: ${result.error}`}
        </div>
      )}
    </div>
  )
}

