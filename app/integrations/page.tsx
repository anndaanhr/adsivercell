"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { AIChat } from "@/components/ai-chat"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"

export default function IntegrationsPage() {
  const [user, setUser] = useState<any>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  // Check for user on component mount
  useState(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  })

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/integrations`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Integrations Demo</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates the integration of Supabase, Vercel Blob, and xAI Grok in the Zafago platform.
      </p>

      <Tabs defaultValue="supabase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supabase">Supabase Auth</TabsTrigger>
          <TabsTrigger value="blob">Vercel Blob</TabsTrigger>
          <TabsTrigger value="ai">xAI Grok</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Authentication</CardTitle>
              <CardDescription>
                Supabase provides a complete authentication system with multiple providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">User ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSignIn} className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In with Google
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blob">
          <Card>
            <CardHeader>
              <CardTitle>Vercel Blob Storage</CardTitle>
              <CardDescription>Upload and store files securely with Vercel Blob.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload onUploadComplete={(url) => setUploadedUrl(url)} folder="zafago/uploads" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>xAI Grok Assistant</CardTitle>
              <CardDescription>
                Interact with the xAI Grok AI assistant for gaming recommendations and help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIChat />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

