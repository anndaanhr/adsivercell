"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useVerification } from "@/components/verification-provider"
import { useAuth } from "@/components/auth-provider"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { verifyEmail, sendVerificationEmail, isPending } = useVerification()

  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error" | "no-token">("loading")
  const token = searchParams.get("token")

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setVerificationState("no-token")
        return
      }

      if (!user) {
        // If user is not logged in, redirect to login page with return URL
        router.push(`/auth/login?returnUrl=${encodeURIComponent(`/verify-email?token=${token}`)}`)
        return
      }

      try {
        const success = await verifyEmail(token)
        setVerificationState(success ? "success" : "error")
      } catch (error) {
        console.error("Error during verification:", error)
        setVerificationState("error")
      }
    }

    verifyToken()
  }, [token, user, verifyEmail, router])

  const handleResendVerification = async () => {
    await sendVerificationEmail()
  }

  return (
    <div className="container flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationState === "loading" && "Verifying your email address..."}
            {verificationState === "success" && "Your email has been verified!"}
            {verificationState === "error" && "Verification failed"}
            {verificationState === "no-token" && "No verification token provided"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pb-6 pt-2">
          {verificationState === "loading" && <Loader2 className="h-16 w-16 animate-spin text-primary" />}

          {verificationState === "success" && (
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <p className="mb-2 text-lg font-medium">Verification Successful</p>
              <p className="text-muted-foreground">
                Your email address has been successfully verified. You can now access all features of Zafago.
              </p>
            </div>
          )}

          {verificationState === "error" && (
            <div className="text-center">
              <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              <p className="mb-2 text-lg font-medium">Verification Failed</p>
              <p className="text-muted-foreground">
                We couldn't verify your email address. The verification link may have expired or is invalid.
              </p>
            </div>
          )}

          {verificationState === "no-token" && (
            <div className="text-center">
              <XCircle className="mx-auto mb-4 h-16 w-16 text-amber-500" />
              <p className="mb-2 text-lg font-medium">No Verification Token</p>
              <p className="text-muted-foreground">
                No verification token was provided. Please use the link from your verification email.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {(verificationState === "error" || verificationState === "no-token") && (
            <Button onClick={handleResendVerification} className="w-full" disabled={isPending || !user}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          )}

          <Button asChild variant={verificationState === "success" ? "default" : "outline"} className="w-full">
            <Link href={verificationState === "success" ? "/account" : "/"}>
              {verificationState === "success" ? "Go to Account" : "Return to Home"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

