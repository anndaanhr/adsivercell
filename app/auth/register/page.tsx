"use client"

import type React from "react"
import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account | Zafago",
  description: "Create a new Zafago account",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-full items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
