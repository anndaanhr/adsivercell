import { Metadata } from "next"
import { EmailVerification } from "@/components/auth/email-verification"

export const metadata: Metadata = {
  title: "Verify Email | Zafago",
  description: "Verify your email address to activate your Zafago account",
}

export default function VerifyEmailPage() {
  return (
    <div className="container flex h-full items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <EmailVerification status="pending" />
      </div>
    </div>
  )
}
