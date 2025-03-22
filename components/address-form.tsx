"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddressFormProps {
  onAddressChange: (address: Address) => void
  initialAddress?: Partial<Address>
}

interface Address {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Mock function to simulate address validation and suggestion
const validateAddress = async (address: Partial<Address>): Promise<{ valid: boolean; suggestions?: Address[] }> => {
  // In a real app, this would call an address validation API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate validation
  if (!address.addressLine1 || !address.city || !address.postalCode) {
    return { valid: false }
  }

  // Simulate suggestions
  if (address.addressLine1 && address.city && address.postalCode) {
    // If the address is mostly complete, suggest a standardized version
    return {
      valid: true,
      suggestions: [
        {
          ...(address as Address),
          addressLine1: address.addressLine1.toUpperCase(),
          city: address.city.toUpperCase(),
        },
      ],
    }
  }

  return { valid: true }
}

export function AddressForm({ onAddressChange, initialAddress = {} }: AddressFormProps) {
  const [address, setAddress] = useState<Partial<Address>>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    ...initialAddress,
  })

  const [validating, setValidating] = useState(false)
  const [suggestions, setSuggestions] = useState<Address[]>([])
  const [validated, setValidated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Reset validation state when address changes
    if (validated) {
      setValidated(false)
    }
  }, [address.addressLine1, address.city, address.postalCode, validated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleValidate = async () => {
    setValidating(true)
    setSuggestions([])

    try {
      const result = await validateAddress(address)

      if (!result.valid) {
        toast({
          title: "Invalid address",
          description: "Please check your address and try again.",
          variant: "destructive",
        })
        return
      }

      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions)
      } else {
        setValidated(true)
        onAddressChange(address as Address)
        toast({
          title: "Address validated",
          description: "Your address has been validated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Validation failed",
        description: "There was an error validating your address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  const handleUseSuggestion = (suggestion: Address) => {
    setAddress(suggestion)
    setSuggestions([])
    setValidated(true)
    onAddressChange(suggestion)
  }

  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    // Add more countries as needed
  ]

  const states = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    // Add more states as needed
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={address.firstName} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={address.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input id="addressLine1" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input id="addressLine2" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={address.city} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Select value={address.state} onValueChange={(value) => handleSelectChange("state", value)}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" name="postalCode" value={address.postalCode} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={address.country} onValueChange={(value) => handleSelectChange("country", value)}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-md border p-4">
          <h3 className="mb-2 font-medium">Suggested Address</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            We found a standardized version of your address. Would you like to use it?
          </p>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="mb-2 rounded-md border p-3">
              <p>{suggestion.addressLine1}</p>
              {suggestion.addressLine2 && <p>{suggestion.addressLine2}</p>}
              <p>
                {suggestion.city}, {suggestion.state} {suggestion.postalCode}
              </p>
              <p>{countries.find((c) => c.code === suggestion.country)?.name}</p>
              <Button size="sm" className="mt-2" onClick={() => handleUseSuggestion(suggestion)}>
                Use This Address
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" onClick={handleValidate} disabled={validating || validated} className="gap-2">
          {validating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : validated ? (
            <>
              <Check className="h-4 w-4" />
              Validated
            </>
          ) : (
            "Validate Address"
          )}
        </Button>
      </div>
    </div>
  )
}

