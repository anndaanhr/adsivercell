"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

export default function WithdrawalRequestsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "",
    payment_details: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

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

      // Fetch withdrawal requests
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (withdrawalError) {
        throw withdrawalError
      }

      setWithdrawals(withdrawalData || [])

      // Calculate available balance (total sales minus withdrawals)
      const { data: salesData, error: salesError } = await supabase
        .from("orders")
        .select("total")
        .eq("seller_id", user.id)

      if (salesError) {
        throw salesError
      }

      const totalSales = (salesData || []).reduce((sum, order) => sum + order.total, 0)

      const totalWithdrawn = (withdrawalData || [])
        .filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + w.amount, 0)

      const pendingWithdrawals = (withdrawalData || [])
        .filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + w.amount, 0)

      setAvailableBalance(totalSales - totalWithdrawn - pendingWithdrawals)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load your withdrawal data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Validate form
      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid withdrawal amount.",
          variant: "destructive",
        })
        return
      }

      if (amount > availableBalance) {
        toast({
          title: "Insufficient Balance",
          description: "Your withdrawal amount exceeds your available balance.",
          variant: "destructive",
        })
        return
      }

      if (!formData.payment_method || !formData.payment_details) {
        toast({
          title: "Missing Information",
          description: "Please provide your payment method and details.",
          variant: "destructive",
        })
        return
      }

      // Insert withdrawal request
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .insert({
          seller_id: user.id,
          amount,
          payment_method: formData.payment_method,
          payment_details: formData.payment_details,
          notes: formData.notes,
          status: "pending",
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for approval.",
      })

      // Reset form
      setFormData({
        amount: "",
        payment_method: "",
        payment_details: "",
        notes: "",
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Error submitting withdrawal request:", error)
      toast({
        title: "Error",
        description: "Failed to submit your withdrawal request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Request withdrawals of your earnings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${availableBalance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {withdrawals
                .filter((w) => w.status === "pending")
                .reduce((sum, w) => sum + w.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {withdrawals
                .filter((w) => w.status === "approved")
                .reduce((sum, w) => sum + w.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Request a withdrawal of your available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Available balance: ${availableBalance.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Input
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  placeholder="PayPal, Bank Transfer, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_details">Payment Details</Label>
                <Textarea
                  id="payment_details"
                  name="payment_details"
                  value={formData.payment_details}
                  onChange={handleChange}
                  placeholder="PayPal email, bank account details, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" onClick={handleSubmit} disabled={submitting || availableBalance <= 0}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>View your past and pending withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : withdrawals.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">${withdrawal.amount.toFixed(2)}</TableCell>
                        <TableCell>{withdrawal.payment_method}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              withdrawal.status === "approved"
                                ? "bg-green-500 hover:bg-green-600"
                                : withdrawal.status === "pending"
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-red-500 hover:bg-red-600"
                            }
                          >
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No withdrawals yet</h3>
                <p className="text-sm text-muted-foreground mb-4">You haven't made any withdrawal requests yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

