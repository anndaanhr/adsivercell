"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Package, CreditCard, LogOut, Settings, ShoppingCart, Heart, Key, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useVerification } from "@/components/verification-provider"
import { VerificationStatus } from "@/components/verification-status"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserByEmail, updateUser } from "@/lib/storage"
import { ProfileForm } from "@/components/auth/profile-form"

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { isVerified, sendVerificationEmail } = useVerification()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [showVerificationReminder, setShowVerificationReminder] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const orders = [
    {
      id: "ORD-123456",
      date: "2023-06-15",
      total: "$59.99",
      status: "Completed",
      items: [{ title: "Cyberpunk 2077", platform: "Steam" }],
    },
    {
      id: "ORD-789012",
      date: "2023-05-22",
      total: "$29.99",
      status: "Completed",
      items: [{ title: "Elden Ring", platform: "Steam" }],
    },
  ]

  const gameKeys = [
    {
      id: "1",
      game: "Cyberpunk 2077",
      platform: "Steam",
      key: "XXXX-XXXX-XXXX-XXXX",
      purchaseDate: "2023-06-15",
    },
    {
      id: "2",
      game: "Elden Ring",
      platform: "Steam",
      key: "XXXX-XXXX-XXXX-XXXX",
      purchaseDate: "2023-05-22",
    },
  ]

  const wishlist = [
    {
      id: "3",
      title: "God of War",
      price: 49.99,
      platform: "Steam",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      title: "Red Dead Redemption 2",
      price: 59.99,
      platform: "Epic",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    } else if (!isVerified) {
      // Show verification reminder after a delay
      const timer = setTimeout(() => {
        setShowVerificationReminder(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, router, isVerified])

  // Handle verification reminder
  useEffect(() => {
    if (showVerificationReminder && !isVerified) {
      toast({
        title: "Verify Your Email",
        description: "Please verify your email to access all features of your account",
        action: (
          <Button variant="outline" size="sm" onClick={() => sendVerificationEmail()}>
            Verify Now
          </Button>
        ),
      })
    }
  }, [showVerificationReminder, isVerified, sendVerificationEmail, toast])

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsLoading(true)

    try {
      // Get the full user record
      const storedUser = getUserByEmail(user.email)

      if (!storedUser) {
        throw new Error("User not found")
      }

      // Update user data
      updateUser(storedUser.id, {
        name: formData.name,
        // We don't update email here as it would require re-verification
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
        <div className="md:col-span-1">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Account</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        <div className="md:col-span-1">
          <ProfileForm />
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-64">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <VerificationStatus />

            <Separator />

            <nav className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "profile" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "orders" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("orders")}
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={activeTab === "keys" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("keys")}
              >
                <Key className="mr-2 h-4 w-4" />
                Game Keys
              </Button>
              <Button
                variant={activeTab === "wishlist" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Button>
              <Button
                variant={activeTab === "payment" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Button>
              <Button
                variant={activeTab === "security" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("security")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled={true} // Email can't be changed directly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed directly. Please contact support if you need to update your
                        email.
                      </p>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
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
                        <p className="text-sm text-muted-foreground">
                          Verify your email address to secure your account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isVerified ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
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
                      <Button variant="outline" size="sm" disabled={!isVerified}>
                        {isVerified ? "Enable" : "Verify Email First"}
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Change your password regularly to keep your account secure
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login History</h3>
                        <p className="text-sm text-muted-foreground">View your recent login activity</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.total}</p>
                              <p className="text-sm text-green-600 dark:text-green-500">{order.status}</p>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <p className="text-sm">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.platform}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-medium">No orders yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        You haven't made any purchases yet. Start shopping to see your orders here.
                      </p>
                      <Button asChild>
                        <Link href="/games">Browse Games</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs remain the same */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
