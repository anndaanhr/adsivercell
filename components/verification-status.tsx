"use client"

import { CheckCircle, XCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useVerification } from "@/components/verification-provider"

export function VerificationStatus({ showButton = true }: { showButton?: boolean }) {
  const { isVerified, isPending, sendVerificationEmail } = useVerification()

  return (
    <div className="flex items-center gap-2">
      {isVerified ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-600 dark:text-green-500">Email Verified</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-600 dark:text-red-500">Email Not Verified</span>

          {showButton && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 h-7 text-xs"
              onClick={() => sendVerificationEmail()}
              disabled={isPending}
            >
              <Mail className="mr-1 h-3 w-3" />
              {isPending ? "Sending..." : "Verify Now"}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

