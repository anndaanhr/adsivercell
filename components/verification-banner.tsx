"use client"

import { useState } from "react"
import { Mail, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useVerification } from "@/components/verification-provider"
import { useAuth } from "@/components/auth-provider"

export function VerificationBanner() {
  const { user } = useAuth()
  const { isVerified, isPending, sendVerificationEmail } = useVerification()
  const [dismissed, setDismissed] = useState(false)

  // Don't show banner if user is not logged in, is verified, or banner was dismissed
  if (!user || isVerified || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 px-4 py-3 dark:bg-amber-900/30">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Please verify your email address to access all features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-amber-600 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900"
            onClick={() => sendVerificationEmail()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Email"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

