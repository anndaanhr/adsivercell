"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CreditCard, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getStoredData, setStoredData } from "@/lib/storage"

interface PaymentMethod {
  id: string
  userId: string
  type: "credit_card" | "paypal"
  isDefault: boolean
  lastUsed?: string
  details: {
    cardNumber?: string
    cardHolder?: string
    expiryDate?: string
    email?: string
  }
}

export default function PaymentMethodsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "credit_card",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      // Load payment methods
      const allPaymentMethods = getStoredData<PaymentMethod[]>("zafago_payment_methods", [])
      const userPaymentMethods = allPaymentMethods.filter((method) => method.userId === user.id)
      setPaymentMethods(userPaymentMethods)
      setIsLoading(false)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as "credit_card" | "paypal" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validate form
    if (formData.type === "credit_card") {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    } else if (formData.type === "paypal") {
      if (!formData.email) {
        toast({
          title: "Missing information",
          description: "Please enter your PayPal email.",
          variant: "destructive",
        })
        return
      }
    }

    // Create new payment method
    const newPaymentMethod: PaymentMethod = {
      id: `payment_${Date.now()}`,
      userId: user.id,
      type: formData.type,
      isDefault: paymentMethods.length === 0, // Make default if it's the first one
      details: {
        ...(formData.type === "credit_card"
          ? {
              cardNumber: formData.cardNumber.replace(/\d(?=\d{4})/g, "*"), // Mask card number
              cardHolder: formData.cardHolder,
              expiryDate: formData.expiryDate,
            }
          : {
              email: formData.email,
            }),
      },
    }

    // Save to localStorage
    const allPaymentMethods = getStoredData<PaymentMethod[]>("zafago_payment_methods", [])
    setStoredData("zafago_payment_methods", [...allPaymentMethods, newPaymentMethod])

    // Update local state
    setPaymentMethods([...paymentMethods, newPaymentMethod])

    // Reset form
    setFormData({
      type: "credit_card",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      email: "",
    })
    setShowAddForm(false)

    toast({
      title: "Payment method added",
      description: "Your payment method has been added successfully.",
    })
  }

  const setDefaultPaymentMethod = (id: string) => {
    const allPaymentMethods = getStoredData<PaymentMethod[]>("zafago_payment_methods", [])
    const updatedMethods = allPaymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id && method.userId === user?.id,
    }))

    setStoredData("zafago_payment_methods", updatedMethods)

    // Update local state
    setPaymentMethods(updatedMethods.filter((method) => method.userId === user?.id))

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  const deletePaymentMethod = (id: string) => {
    const allPaymentMethods = getStoredData<PaymentMethod[]>("zafago_payment_methods", [])
    const methodToDelete = allPaymentMethods.find((method) => method.id === id)
    const wasDefault = methodToDelete?.isDefault

    const updatedMethods = allPaymentMethods.filter((method) => method.id !== id)

    // If the deleted method was the default, make another one default
    if (wasDefault && updatedMethods.length > 0) {
      const userMethods = updatedMethods.filter((method) => method.userId === user?.id)
      if (userMethods.length > 0) {
        userMethods[0].isDefault = true
      }
    }

    setStoredData("zafago_payment_methods", updatedMethods)

    // Update local state
    setPaymentMethods(updatedMethods.filter((method) => method.userId === user?.id))

    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed.",
    })
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Loading your payment methods...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods for purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {method.type === "credit_card" ? (
                        <>
                          <p className="font-medium">
                            {method.details.cardNumber}
                            {method.isDefault && <span className="ml-2 text-xs text-primary">(Default)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {method.details.cardHolder} • Expires {method.details.expiryDate}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">
                            PayPal
                            {method.isDefault && <span className="ml-2 text-xs text-primary">(Default)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">{method.details.email}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No payment methods</h3>
              <p className="mb-4 text-sm text-muted-foreground">You haven't added any payment methods yet.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className="w-full gap-1">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full">
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
            <CardDescription>Enter your payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.type === "credit_card" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Cardholder Name</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      placeholder="John Doe"
                      value={formData.cardHolder}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">PayPal Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Save Payment Method
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

