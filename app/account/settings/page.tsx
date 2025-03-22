"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getStoredData, setStoredData } from "@/lib/storage"

interface UserSettings {
  userId: string
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  wishlistAlerts: boolean
  language: string
  currency: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Default settings
  const defaultSettings: UserSettings = {
    userId: user?.id || "",
    theme: "system",
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    wishlistAlerts: true,
    language: "en",
    currency: "USD",
  }

  // Get user settings from localStorage or use defaults
  const getUserSettings = (): UserSettings => {
    if (!user) return defaultSettings

    const allSettings = getStoredData<UserSettings[]>("zafago_user_settings", [])
    const userSettings = allSettings.find((s) => s.userId === user.id)

    return userSettings || defaultSettings
  }

  const [settings, setSettings] = useState<UserSettings>(getUserSettings())
  const [isLoading, setIsLoading] = useState(false)

  const saveSettings = () => {
    if (!user) return

    setIsLoading(true)

    try {
      const allSettings = getStoredData<UserSettings[]>("zafago_user_settings", [])
      const otherSettings = allSettings.filter((s) => s.userId !== user.id)

      setStoredData("zafago_user_settings", [...otherSettings, settings])

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your preferences.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Zafago looks for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting("theme", value as "light" | "dark" | "system")}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how Zafago appears to you. Set to system to follow your device settings.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive email notifications for important updates</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="orderUpdates">Order Updates</Label>
              <p className="text-xs text-muted-foreground">Receive notifications about your orders</p>
            </div>
            <Switch
              id="orderUpdates"
              checked={settings.orderUpdates}
              onCheckedChange={(checked) => updateSetting("orderUpdates", checked)}
              disabled={!settings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="wishlistAlerts">Wishlist Alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when items in your wishlist go on sale</p>
            </div>
            <Switch
              id="wishlistAlerts"
              checked={settings.wishlistAlerts}
              onCheckedChange={(checked) => updateSetting("wishlistAlerts", checked)}
              disabled={!settings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-xs text-muted-foreground">Receive promotional emails and special offers</p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
              disabled={!settings.emailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}

