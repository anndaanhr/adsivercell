"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DollarSign, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function AdminWithdrawalsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState("")
  const [actionNote, setActionNote] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkAdminAndFetchWithdrawals()
  }, [statusFilter])

  async function checkAdminAndFetchWithdrawals() {
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

      // Fetch withdrawal requests
      let query = supabase.from("withdrawal_requests").select("*, profiles(username, full_name, email)")

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setWithdrawals(data || [])
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
      toast({
        title: "Error",
        description: "Failed to load withdrawal requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdrawalAction() {
    if (!selectedWithdrawal || !actionType) return

    try {
      setProcessing(true)

      // Get current admin user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Update withdrawal request
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: actionType,
          admin_notes: actionNote,
          processed_by: user.id,
          processed_at: new Date().toISOString(),
        })
        .eq("id", selectedWithdrawal.id)

      if (error) {
        throw error
      }

      toast({
        title: actionType === "approved" ? "Withdrawal Approved" : "Withdrawal Rejected",
        description: `The withdrawal request has been ${actionType}.`,
      })

      // Reset state and refresh withdrawals
      setActionDialogOpen(false)
      setSelectedWithdrawal(null)
      setActionType("")
      setActionNote("")
      checkAdminAndFetchWithdrawals()
    } catch (error) {
      console.error("Error processing withdrawal:", error)
      toast({
        title: "Error",
        description: "Failed to process withdrawal request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Manage and process seller withdrawal requests</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{withdrawals.filter((w) => w.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Approved</CardTitle>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {withdrawals
                .filter((w) => w.status === "rejected")
                .reduce((sum, w) => sum + w.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>Review and process seller withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="all">All Requests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : withdrawals.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">
                        {withdrawal.profiles?.username ||
                          withdrawal.profiles?.full_name ||
                          withdrawal.profiles?.email ||
                          "Unknown Seller"}
                      </TableCell>
                      <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell>{withdrawal.payment_method}</TableCell>
                      <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={viewDialogOpen && selectedWithdrawal?.id === withdrawal.id}
                            onOpenChange={(open) => {
                              setViewDialogOpen(open)
                              if (!open) setSelectedWithdrawal(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedWithdrawal(withdrawal)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Withdrawal Request Details</DialogTitle>
                                <DialogDescription>
                                  View the complete details of this withdrawal request
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Seller</p>
                                    <p>
                                      {withdrawal.profiles?.username ||
                                        withdrawal.profiles?.full_name ||
                                        withdrawal.profiles?.email}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                                    <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                                    <p>{withdrawal.payment_method}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Date Requested</p>
                                    <p>{new Date(withdrawal.created_at).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
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
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Payment Details</p>
                                  <p className="whitespace-pre-wrap">{withdrawal.payment_details}</p>
                                </div>
                                {withdrawal.notes && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Seller Notes</p>
                                    <p className="whitespace-pre-wrap">{withdrawal.notes}</p>
                                  </div>
                                )}
                                {withdrawal.admin_notes && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Admin Notes</p>
                                    <p className="whitespace-pre-wrap">{withdrawal.admin_notes}</p>
                                  </div>
                                )}
                                {withdrawal.processed_at && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Processed On</p>
                                    <p>{new Date(withdrawal.processed_at).toLocaleString()}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {withdrawal.status === "pending" && (
                            <>
                              <Dialog
                                open={
                                  actionDialogOpen &&
                                  selectedWithdrawal?.id === withdrawal.id &&
                                  actionType === "approved"
                                }
                                onOpenChange={(open) => {
                                  setActionDialogOpen(open)
                                  if (!open) {
                                    setSelectedWithdrawal(null)
                                    setActionType("")
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 text-green-500 hover:text-green-600"
                                    onClick={() => {
                                      setSelectedWithdrawal(withdrawal)
                                      setActionType("approved")
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Withdrawal</DialogTitle>
                                    <DialogDescription>
                                      Confirm that you want to approve this withdrawal request
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Amount:</p>
                                      <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Seller:</p>
                                      <p>
                                        {withdrawal.profiles?.username ||
                                          withdrawal.profiles?.full_name ||
                                          withdrawal.profiles?.email}
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Payment Method:</p>
                                      <p>{withdrawal.payment_method}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Admin Notes (Optional):</p>
                                      <Textarea
                                        value={actionNote}
                                        onChange={(e) => setActionNote(e.target.value)}
                                        placeholder="Add any notes about this approval..."
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleWithdrawalAction}
                                      className="bg-green-500 hover:bg-green-600"
                                      disabled={processing}
                                    >
                                      {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Confirm Approval
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={
                                  actionDialogOpen &&
                                  selectedWithdrawal?.id === withdrawal.id &&
                                  actionType === "rejected"
                                }
                                onOpenChange={(open) => {
                                  setActionDialogOpen(open)
                                  if (!open) {
                                    setSelectedWithdrawal(null)
                                    setActionType("")
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                    onClick={() => {
                                      setSelectedWithdrawal(withdrawal)
                                      setActionType("rejected")
                                    }}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Withdrawal</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this withdrawal request
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Amount:</p>
                                      <p className="font-bold">${withdrawal.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Seller:</p>
                                      <p>
                                        {withdrawal.profiles?.username ||
                                          withdrawal.profiles?.full_name ||
                                          withdrawal.profiles?.email}
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Reason for Rejection:</p>
                                      <Textarea
                                        value={actionNote}
                                        onChange={(e) => setActionNote(e.target.value)}
                                        placeholder="Explain why this withdrawal is being rejected..."
                                        required
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleWithdrawalAction}
                                      className="bg-red-500 hover:bg-red-600"
                                      disabled={processing || !actionNote.trim()}
                                    >
                                      {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Confirm Rejection
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
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
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No withdrawal requests</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {statusFilter !== "all"
                  ? `There are no ${statusFilter} withdrawal requests.`
                  : "There are no withdrawal requests yet."}
              </p>
              {statusFilter !== "all" && (
                <Button variant="outline" onClick={() => setStatusFilter("all")}>
                  View All Requests
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Process</CardTitle>
            <CardDescription>Understanding the withdrawal approval workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-yellow-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">1. Request Submission</h3>
                  <p className="text-sm text-muted-foreground">
                    Sellers submit withdrawal requests specifying the amount and payment details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">2. Admin Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Administrators review the request, verifying the seller's balance and payment information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">3. Approval & Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Once approved, the payment is processed through the specified payment method.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-500/10 p-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">4. Rejection (If Necessary)</h3>
                  <p className="text-sm text-muted-foreground">
                    If there are issues with the request, it may be rejected with a clear explanation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Guidelines</CardTitle>
            <CardDescription>Best practices for processing withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Verify Available Balance</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure the seller has sufficient funds in their account before approving a withdrawal.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Check Payment Details</h3>
                <p className="text-sm text-muted-foreground">
                  Verify that the payment details provided are complete and valid for processing.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Provide Clear Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  When rejecting a request, always provide a clear explanation to help the seller correct any issues.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Process Promptly</h3>
                <p className="text-sm text-muted-foreground">
                  Aim to process withdrawal requests within 1-3 business days to maintain seller satisfaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

