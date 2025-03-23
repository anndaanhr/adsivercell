"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, CreditCard, LogOut, Settings, Heart, Key, Shield, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { VerificationStatus } from "@/components/verification-status"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("")

  // Set active tab based on URL path
  useEffect(() => {
    const path = window.location.pathname
    if (path === "/account") setActiveTab("profile")
    else if (path === "/account/orders") setActiveTab("orders")
    else if (path === "/account/keys") setActiveTab("keys")
    else if (path === "/account/wishlist") setActiveTab("wishlist")
    else if (path === "/account/payment") setActiveTab("payment")
    else if (path === "/account/security") setActiveTab("security")
    else if (path === "/account/settings") setActiveTab("settings")
    else if (path === "/account/notifications") setActiveTab("notifications")
  }, [])

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?returnUrl=/account")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  if (!user) {
    return null // Don't render anything until we redirect
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-64">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <VerificationStatus />

            <Separator />

            <nav className="flex flex-col space-y-1">
              <Button variant={activeTab === "profile" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant={activeTab === "orders" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button variant={activeTab === "keys" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/keys">
                  <Key className="mr-2 h-4 w-4" />
                  Game Keys
                </Link>
              </Button>
              <Button variant={activeTab === "wishlist" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </Button>
              <Button variant={activeTab === "payment" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Link>
              </Button>
              <Button variant={activeTab === "notifications" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
              <Button variant={activeTab === "security" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Link>
              </Button>
              <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href="/account/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

