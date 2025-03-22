"use client"

import type React from "react"
import { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password | Zafago",
  description: "Reset your Zafago account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-full items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
