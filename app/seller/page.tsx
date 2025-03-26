"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Package, DollarSign, BarChart, FileText, Plus } from "lucide-react"
import Link from "next/link"

export default function SellerDashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGames: 0,
    totalSales: 0,
    pendingWithdrawals: 0,
    revenue: 0,
  })

  useEffect(() => {
    checkSellerAndFetchStats()
  }, [])

  async function checkSellerAndFetchStats() {
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

      // Check if user has seller role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== "seller") {
        router.push("/unauthorized")
        return
      }

      // Fetch seller stats
      // For now, we'll just use placeholder data
      // In a real implementation, you would fetch this from your database
      setStats({
        totalGames: 12,
        totalSales: 156,
        pendingWithdrawals: 2,
        revenue: 3240.5,
      })
    } catch (error) {
      console.error("Error fetching seller stats:", error)
      toast({
        title: "Error",
        description: "Failed to load seller dashboard. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your games, track sales, and handle withdrawals</p>
        </div>
        <Button asChild>
          <Link href="/seller/games/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Game
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.totalGames}</div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.totalSales}</div>
              <BarChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">${stats.revenue.toFixed(2)}</div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.pendingWithdrawals}</div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your most recent game sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">No recent sales to display</p>
          </CardContent>
        </Card>

        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common seller tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/seller/games">
                <Package className="mr-2 h-4 w-4" />
                Manage Games
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/seller/sales">
                <BarChart className="mr-2 h-4 w-4" />
                View Sales History
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/seller/withdrawals">
                <DollarSign className="mr-2 h-4 w-4" />
                Request Withdrawal
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/seller/reports">
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Games</CardTitle>
            <CardDescription>Your best selling games</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">No data to display</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

