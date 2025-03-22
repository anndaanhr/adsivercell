"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useVerification } from "@/components/verification-provider"
import { useToast } from "@/hooks/use-toast"
import { getUserByEmail, updateUser } from "@/lib/storage"

export default function SecurityPage() {
  const { user } = useAuth()
  const { isVerified, sendVerificationEmail } = useVerification()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validatePasswordForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
      valid = false
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
      valid = false
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      valid = false
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
      valid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (!validatePasswordForm()) return

    setIsLoading(true)

    try {
      // Get the full user record
      const storedUser = getUserByEmail(user.email)

      if (!storedUser) {
        throw new Error("User not found")
      }

      // Verify current password
      if (storedUser.password !== passwordData.currentPassword) {
        setErrors((prev) => ({ ...prev, currentPassword: "Current password is incorrect" }))
        throw new Error("Current password is incorrect")
      }

      // Update password
      updateUser(storedUser.id, {
        password: passwordData.newPassword,
      })

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      if (!(error instanceof Error) || error.message !== "Current password is incorrect") {
        toast({
          title: "Update failed",
          description: "There was an error updating your password. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Verification</h3>
                <p className="text-sm text-muted-foreground">Verify your email address to secure your account</p>
              </div>
              <div>
                {isVerified ? (
                  <Button variant="outline" size="sm" disabled>
                    Verified
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => sendVerificationEmail()}>
                    Verify Email
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch disabled={!isVerified} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Login Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone logs into your account
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 ${errors.currentPassword ? "border-red-500" : ""}`}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 ${errors.newPassword ? "border-red-500" : ""}`}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
              </div>
              {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

