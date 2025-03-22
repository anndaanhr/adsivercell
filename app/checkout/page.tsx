"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Check, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import { generateGameKey } from "@/lib/key-generator"
import { AddressForm } from "@/components/address-form"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [address, setAddress] = useState<any>(null)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cart.reduce((total, item) => total + (item.discount / 100) * item.price * item.quantity, 0)
  const platformFee = subtotal * 0.05
  const total = subtotal - discount + platformFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19)
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      formattedValue = value.replace(/\//g, "")
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (step === 1) {
      // Validate email
      if (!formData.email) {
        newErrors.email = "Email is required"
        valid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format"
        valid = false
      }

      // Validate name
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
        valid = false
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
        valid = false
      }
    } else if (step === 2 && paymentMethod === "credit-card") {
      // Validate card number (16 digits)
      if (!formData.cardNumber.replace(/\s/g, "")) {
        newErrors.cardNumber = "Card number is required"
        valid = false
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Invalid card number format"
        valid = false
      }

      // Validate card name
      if (!formData.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required"
        valid = false
      }

      // Validate expiry date (MM/YY format)
      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required"
        valid = false
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid format (MM/YY)"
        valid = false
      } else {
        const [month, year] = formData.expiryDate.split("/").map(Number)
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        if (month < 1 || month > 12) {
          newErrors.expiryDate = "Invalid month"
          valid = false
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = "Card has expired"
          valid = false
        }
      }

      // Validate CVV (3 or 4 digits)
      if (!formData.cvv) {
        newErrors.cvv = "CVV is required"
        valid = false
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits"
        valid = false
      }
    }

    setErrors(newErrors)
    return valid
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1)
    }
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate game keys for each item in the cart
      const orderItems = cart.map((item) => {
        const keys = Array(item.quantity)
          .fill(0)
          .map(() => generateGameKey(item.platforms[0]))

        return {
          ...item,
          keys,
        }
      })

      // In a real app, you would save the order to the database
      const order = {
        id: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        date: new Date().toISOString(),
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        items: orderItems,
        subtotal,
        discount,
        platformFee,
        total,
      }

      // Store order in localStorage for demo purposes
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))
      localStorage.setItem("lastOrder", JSON.stringify(order))

      // Clear cart and redirect to success page
      clearCart()
      router.push("/checkout/success")
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-muted-foreground">Add some games to your cart before checking out.</p>
          <Button asChild>
            <Link href="/games">Browse Games</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <Link href="/cart" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <div>
            <div className="mb-6 flex justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 1 ? "bg-primary text-primary-foreground" : "border bg-muted"
                  }`}
                >
                  {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="font-medium">Customer Info</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 2 ? "bg-primary text-primary-foreground" : "border bg-muted"
                  }`}
                >
                  {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="font-medium">Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= 3 ? "bg-primary text-primary-foreground" : "border bg-muted"
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Confirmation</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        <p className="text-xs text-muted-foreground">
                          Your game keys will be sent to this email address.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="mb-4 font-medium">Shipping Address</h3>
                        <AddressForm onAddressChange={setAddress} />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button type="button" onClick={handleNextStep}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex flex-1 items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1">
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={errors.cardNumber ? "border-red-500" : ""}
                            maxLength={19}
                          />
                          {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="John Doe"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={errors.cardName ? "border-red-500" : ""}
                          />
                          {errors.cardName && <p className="text-xs text-red-500">{errors.cardName}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              className={errors.expiryDate ? "border-red-500" : ""}
                              maxLength={5}
                            />
                            {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              type="password"
                              value={formData.cvv}
                              onChange={handleChange}
                              className={errors.cvv ? "border-red-500" : ""}
                              maxLength={4}
                            />
                            {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Secure Payment</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextStep}>
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-medium">Customer Information</h3>
                      <div className="rounded-md bg-muted p-3">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Payment Method</h3>
                      <div className="rounded-md bg-muted p-3">
                        {paymentMethod === "credit-card" ? (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Card ending in {formData.cardNumber.slice(-4)}</span>
                          </div>
                        ) : (
                          <p>PayPal</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Order Summary</h3>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div>
                              <p>
                                {item.title} x {item.quantity}
                              </p>
                              <p className="text-sm text-muted-foreground">Platform: {item.platforms.join(", ")}</p>
                            </div>
                            <p className="font-medium">
                              ${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm">
                        By completing this purchase, you agree to our{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : `Complete Purchase ($${total.toFixed(2)})`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.title} x {item.quantity}
                      </span>
                      <span>${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-500">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (5%)</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

