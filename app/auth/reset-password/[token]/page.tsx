"use client"

import type React from "react"
import { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password | Zafago",
  description: "Set a new password for your Zafago account",
}

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="container flex h-full items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
