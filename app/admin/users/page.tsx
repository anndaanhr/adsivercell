"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Search, Shield, User, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    checkAdminAndFetchUsers()
  }, [])

  async function checkAdminAndFetchUsers() {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user has admin role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== "admin") {
        router.push("/unauthorized")
        return
      }

      // Fetch all users
      const { data, error } = await supabase.from("profiles").select("*, banned_users(*)")

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleBanUser() {
    if (!selectedUser || !banReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for banning this user.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get current admin user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Insert into banned_users table
      const { error } = await supabase.from("banned_users").insert({
        user_id: selectedUser.id,
        banned_by: user.id,
        reason: banReason,
      })

      if (error) {
        throw error
      }

      toast({
        title: "User Banned",
        description: `${selectedUser.username || selectedUser.full_name || "User"} has been banned.`,
      })

      // Reset state and refresh users
      setBanDialogOpen(false)
      setBanReason("")
      setSelectedUser(null)
      checkAdminAndFetchUsers()
    } catch (error) {
      console.error("Error banning user:", error)
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleUnbanUser(userId) {
    try {
      // Delete from banned_users table
      const { error } = await supabase.from("banned_users").delete().eq("user_id", userId)

      if (error) {
        throw error
      }

      toast({
        title: "User Unbanned",
        description: "The user has been unbanned successfully.",
      })

      // Refresh users
      checkAdminAndFetchUsers()
    } catch (error) {
      console.error("Error unbanning user:", error)
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleChangeRole(userId, newRole) {
    try {
      // Update user role
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) {
        throw error
      }

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      })

      // Refresh users
      checkAdminAndFetchUsers()
    } catch (error) {
      console.error("Error changing role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage all users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username, name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username || user.full_name || "Anonymous User"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select defaultValue={user.role} onValueChange={(value) => handleChangeRole(user.id, value)}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.banned_users && user.banned_users.length > 0 ? (
                          <Badge className="bg-red-500 hover:bg-red-600">Banned</Badge>
                        ) : (
                          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.banned_users && user.banned_users.length > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnbanUser(user.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Unban</span>
                            </Button>
                          ) : (
                            <Dialog
                              open={banDialogOpen && selectedUser?.id === user.id}
                              onOpenChange={(open) => {
                                setBanDialogOpen(open)
                                if (!open) setSelectedUser(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Ban className="h-4 w-4" />
                                  <span>Ban</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ban User</DialogTitle>
                                  <DialogDescription>
                                    This will prevent the user from accessing the platform. Please provide a reason for
                                    banning.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">User:</p>
                                    <p>{user.username || user.full_name || user.email}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">Reason for ban:</p>
                                    <Textarea
                                      value={banReason}
                                      onChange={(e) => setBanReason(e.target.value)}
                                      placeholder="Enter reason for banning this user..."
                                      required
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleBanUser} className="bg-red-500 hover:bg-red-600">
                                    Ban User
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No users found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || roleFilter !== "all"
                  ? "No users match your search criteria."
                  : "There are no users on the platform yet."}
              </p>
              {(searchQuery || roleFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setRoleFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Understanding the different user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">User</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard users can browse the store, purchase games, leave reviews, and manage their own account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Seller</h3>
                  <p className="text-sm text-muted-foreground">
                    Sellers can list games for sale, manage their catalog, view sales reports, and request withdrawals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Admin</h3>
                  <p className="text-sm text-muted-foreground">
                    Administrators have full access to the platform, including user management, content moderation, and
                    system settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management Tips</CardTitle>
            <CardDescription>Best practices for managing users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Seller Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Before granting seller privileges, verify the user's identity and ensure they understand the
                  platform's policies.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Banning Users</h3>
                <p className="text-sm text-muted-foreground">
                  Only ban users for serious violations of the terms of service. Always provide a clear reason for the
                  ban.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Admin Privileges</h3>
                <p className="text-sm text-muted-foreground">
                  Limit admin access to trusted team members only. Admins have extensive control over the platform.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Regular Audits</h3>
                <p className="text-sm text-muted-foreground">
                  Periodically review user roles and permissions to ensure they are appropriate and up-to-date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

