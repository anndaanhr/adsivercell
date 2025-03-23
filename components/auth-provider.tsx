"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserByEmail } from "@/lib/data"
import type { StoredUser } from "@/lib/blob-storage"

interface AuthContextType {
  user: StoredUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, you would check with your backend
        // For now, we'll just check localStorage
        const userId = localStorage.getItem("zafago_current_user")

        if (userId) {
          // Simulate fetching user data
          // In a real app, you would fetch from your API
          const storedUsers = JSON.parse(localStorage.getItem("zafago_users") || "[]")
          const foundUser = storedUsers.find((u: any) => u.id === userId)

          if (foundUser) {
            setUser(foundUser)
          } else {
            // Clear invalid session
            localStorage.removeItem("zafago_current_user")
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would call your API
      // For now, we'll simulate authentication
      const foundUser = await getUserByEmail(email)

      if (!foundUser || foundUser.password !== password) {
        return { success: false, message: "Invalid email or password" }
      }

      // Store user in state
      setUser(foundUser)

      // Store user ID in localStorage
      localStorage.setItem("zafago_current_user", foundUser.id)

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)

      // Check if user already exists
      const existingUser = await getUserByEmail(email)

      if (existingUser) {
        return { success: false, message: "Email already in use" }
      }

      // In a real app, you would call your API
      // For now, we'll simulate registration
      const newUser = {
        name,
        email,
        password,
      }

      // Store in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("zafago_users") || "[]")
      const userId = `user_${Date.now()}`
      const userWithId = {
        ...newUser,
        id: userId,
        isVerified: false,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("zafago_users", JSON.stringify([...storedUsers, userWithId]))

      // Auto login after registration
      setUser(userWithId)
      localStorage.setItem("zafago_current_user", userId)

      return { success: true, message: "Registration successful" }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "An error occurred during registration" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user from state
    setUser(null)

    // Clear from localStorage
    localStorage.removeItem("zafago_current_user")

    // Redirect to home page
    router.push("/")
  }

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would call your API to send a reset email
      // For now, we'll just simulate sending a reset email
      console.log(`Password reset requested for ${email}`)

      // Check if the user exists
      const existingUser = await getUserByEmail(email)

      if (!existingUser) {
        // Don't reveal that the email doesn't exist for security reasons
        return { success: true, message: "If your email is registered, you will receive a password reset link" }
      }

      // In a real app, you would generate a token and send an email
      // For demo purposes, we'll just store the token in localStorage
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      const tokens = JSON.parse(localStorage.getItem("zafago_reset_tokens") || "{}")
      tokens[resetToken] = { email, expires: Date.now() + 3600000 } // 1 hour expiry
      localStorage.setItem("zafago_reset_tokens", JSON.stringify(tokens))

      return { success: true, message: "If your email is registered, you will receive a password reset link" }
    } catch (error) {
      console.error("Forgot password error:", error)
      return { success: false, message: "An error occurred while processing your request" }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would validate the token with your API
      // For now, we'll check localStorage
      const tokens = JSON.parse(localStorage.getItem("zafago_reset_tokens") || "{}")
      const tokenData = tokens[token]

      if (!tokenData || tokenData.expires < Date.now()) {
        return { success: false, message: "Invalid or expired reset token" }
      }

      // Update the user's password
      const storedUsers = JSON.parse(localStorage.getItem("zafago_users") || "[]")
      const userIndex = storedUsers.findIndex((u: any) => u.email === tokenData.email)

      if (userIndex === -1) {
        return { success: false, message: "User not found" }
      }

      storedUsers[userIndex].password = password
      localStorage.setItem("zafago_users", JSON.stringify(storedUsers))

      // Remove the used token
      delete tokens[token]
      localStorage.setItem("zafago_reset_tokens", JSON.stringify(tokens))

      return { success: true, message: "Password reset successful" }
    } catch (error) {
      console.error("Reset password error:", error)
      return { success: false, message: "An error occurred while resetting your password" }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

