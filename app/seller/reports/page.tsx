"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Download, BarChart, PieChart, LineChart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState("sales")
  const [timeRange, setTimeRange] = useState("month")
  const [salesData, setSalesData] = useState([])

  useEffect(() => {
    fetchData()
  }, [timeRange])

  async function fetchData() {
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

      // Build query based on time range
      let query = supabase.from("orders").select("*, games(*)").eq("seller_id", user.id)

      if (timeRange === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        query = query.gte("created_at", weekAgo.toISOString())
      } else if (timeRange === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        query = query.gte("created_at", monthAgo.toISOString())
      } else if (timeRange === "year") {
        const yearAgo = new Date()
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)
        query = query.gte("created_at", yearAgo.toISOString())
      }

      // Execute query
      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setSalesData(data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load your sales data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setGenerating(true)

      // Create CSV content based on report type
      let csvContent = ""
      let filename = ""

      if (reportType === "sales") {
        csvContent = "Order ID,Date,Game,Price,Total\n"
        salesData.forEach((sale) => {
          const date = new Date(sale.created_at).toLocaleDateString()
          csvContent += `${sale.id},${date},${sale.games?.title || "Unknown Game"},$${sale.games?.price || 0},$${sale.total}\n`
        })
        filename = `sales-report-${new Date().toISOString().split("T")[0]}.csv`
      } else if (reportType === "revenue") {
        // Group by date
        const revenueByDate = {}
        salesData.forEach((sale) => {
          const date = new Date(sale.created_at).toLocaleDateString()
          revenueByDate[date] = (revenueByDate[date] || 0) + sale.total
        })

        csvContent = "Date,Revenue\n"
        Object.entries(revenueByDate).forEach(([date, revenue]) => {
          csvContent += `${date},$${revenue}\n`
        })
        filename = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`
      } else if (reportType === "games") {
        // Group by game
        const salesByGame = {}
        salesData.forEach((sale) => {
          const gameTitle = sale.games?.title || "Unknown Game"
          if (!salesByGame[gameTitle]) {
            salesByGame[gameTitle] = {
              count: 0,
              revenue: 0,
            }
          }
          salesByGame[gameTitle].count += 1
          salesByGame[gameTitle].revenue += sale.total
        })

        csvContent = "Game,Units Sold,Revenue\n"
        Object.entries(salesByGame).forEach(([game, data]) => {
          csvContent += `${game},${data.count},$${data.revenue}\n`
        })
        filename = `games-report-${new Date().toISOString().split("T")[0]}.csv`
      }

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report Generated",
        description: "Your report has been generated and downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  // Calculate summary statistics
  const totalSales = salesData.length
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0)
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  // Get unique games
  const uniqueGames = new Set(salesData.map((sale) => sale.games?.title)).size

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sales Reports</h1>
        <p className="text-muted-foreground">Generate and download detailed reports of your sales</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Games Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueGames}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select report type and time range to generate a downloadable report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">
                    <div className="flex items-center">
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>Sales Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="revenue">
                    <div className="flex items-center">
                      <LineChart className="mr-2 h-4 w-4" />
                      <span>Revenue Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="games">
                    <div className="flex items-center">
                      <PieChart className="mr-2 h-4 w-4" />
                      <span>Games Performance</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last 12 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} disabled={generating || salesData.length === 0}>
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate & Download"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
            <CardDescription>Different types of reports available for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Sales Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed breakdown of all sales transactions, including order IDs, dates, games, and amounts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Revenue Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily, weekly, or monthly revenue breakdown to track your earnings over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Games Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Analysis of which games are selling best, including units sold and revenue generated per game.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Tips</CardTitle>
            <CardDescription>How to get the most out of your sales reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Regular Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Download and review reports weekly to stay on top of your sales performance and identify trends.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Compare Time Periods</h3>
                <p className="text-sm text-muted-foreground">
                  Generate reports for different time periods to compare performance and track growth over time.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Game Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Use the Games Performance report to identify your best-selling titles and focus your marketing
                  efforts.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Tax Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  Save your reports for tax purposes and to maintain accurate financial records for your business.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

