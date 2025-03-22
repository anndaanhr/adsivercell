"use client"

import type React from "react"
import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In | Zafago",
  description: "Sign in to your Zafago account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-full items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
