"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { isUserVerified, setUserVerified } from "@/lib/storage"

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_5ybtnfo"
const EMAILJS_TEMPLATE_ID = "template_5rdci7q"
const EMAILJS_PUBLIC_KEY = "cn7JoAelyYvtF96wf"

interface VerificationContextType {
  isVerified: boolean
  isPending: boolean
  sendVerificationEmail: () => Promise<void>
  verifyEmail: (token: string) => Promise<boolean>
  checkVerificationStatus: () => boolean
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined)

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  // Check verification status when user changes
  useEffect(() => {
    if (user) {
      const status = checkVerificationStatus()
      setIsVerified(status)
    } else {
      setIsVerified(false)
    }
  }, [user])

  // Generate a verification token
  const generateToken = (email: string): string => {
    // In a real app, you would use a more secure method to generate tokens
    // This is a simple implementation for demonstration purposes
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    return `${Buffer.from(email).toString("base64")}.${timestamp}.${randomString}`
  }

  // Store verification token in localStorage
  const storeVerificationToken = (email: string, token: string) => {
    const verificationData = JSON.parse(localStorage.getItem("verificationTokens") || "{}")
    verificationData[email] = {
      token,
      createdAt: Date.now(),
      // Token expires in 24 hours
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }
    localStorage.setItem("verificationTokens", JSON.stringify(verificationData))
  }

  // Check if a user is verified
  const checkVerificationStatus = (): boolean => {
    if (!user) return false
    return isUserVerified(user.email)
  }

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to verify your email",
        variant: "destructive",
      })
      return
    }

    if (isVerified) {
      toast({
        title: "Already Verified",
        description: "Your email is already verified",
      })
      return
    }

    setIsPending(true)

    try {
      // Generate verification token
      const token = generateToken(user.email)
      storeVerificationToken(user.email, token)

      // Create verification URL
      const verificationUrl = `${window.location.origin}/verify-email?token=${encodeURIComponent(token)}`

      // Prepare email template parameters
      const templateParams = {
        to_name: user.name || user.email.split("@")[0],
        to_email: user.email,
        verification_link: verificationUrl,
      }

      // Send email using EmailJS
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)

      if (response.status === 200) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox and click the verification link",
        })
      } else {
        throw new Error("Failed to send verification email")
      }
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  // Verify email with token
  const verifyEmail = async (token: string): Promise<boolean> => {
    if (!user) return false

    try {
      const verificationData = JSON.parse(localStorage.getItem("verificationTokens") || "{}")
      const userData = verificationData[user.email]

      if (!userData) {
        toast({
          title: "Invalid Token",
          description: "Verification token not found or has expired",
          variant: "destructive",
        })
        return false
      }

      if (userData.token !== token) {
        toast({
          title: "Invalid Token",
          description: "Verification token is invalid",
          variant: "destructive",
        })
        return false
      }

      if (userData.expiresAt < Date.now()) {
        toast({
          title: "Token Expired",
          description: "Verification token has expired. Please request a new one.",
          variant: "destructive",
        })
        return false
      }

      // Mark user as verified
      setUserVerified(user.email, true)

      // Remove the used token
      delete verificationData[user.email]
      localStorage.setItem("verificationTokens", JSON.stringify(verificationData))

      setIsVerified(true)

      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
        variant: "success",
      })

      return true
    } catch (error) {
      console.error("Error verifying email:", error)
      toast({
        title: "Error",
        description: "An error occurred during verification",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <VerificationContext.Provider
      value={{
        isVerified,
        isPending,
        sendVerificationEmail,
        verifyEmail,
        checkVerificationStatus,
      }}
    >
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const context = useContext(VerificationContext)
  if (context === undefined) {
    throw new Error("useVerification must be used within a VerificationProvider")
  }
  return context
}

