import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { User, Menu, LogIn } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { VerificationProvider } from "@/components/verification-provider"
import { GameDataProvider } from "@/components/game-data-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchDialog } from "@/components/search-dialog"
import { CartSheet } from "@/components/cart-sheet"
import { UserNav } from "@/components/user-nav"
import { Toaster } from "@/components/ui/toaster"
import { VerificationBanner } from "@/components/verification-banner"
import { GlobalLoading } from "@/components/global-loading"
import { PageTransition } from "@/components/page-transition"
import InitData from "./init-data"
import GlobalWrapper from "./global-wrapper"
import { SavedCartProvider } from "@/components/saved-cart-provider"
import { ReviewProvider } from "@/components/review-provider"
import { RecommendationsProvider } from "@/components/recommendations-provider"
import { SupabaseProvider } from "@/lib/supabase/supabase-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zafago - Digital Game Store",
  description: "Buy game keys for Steam, Epic Games, and more at the best prices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <AuthProvider>
              <VerificationProvider>
                <GameDataProvider>
                  <CartProvider>
                    <SavedCartProvider>
                      <ReviewProvider>
                        <RecommendationsProvider>
                          <GlobalWrapper>
                            <div className="flex min-h-screen flex-col">
                              <GlobalLoading />
                              <VerificationBanner />
                              <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <div className="container flex h-16 items-center justify-between px-4">
                                  <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
                                    <Link href="/" className="flex items-center space-x-2">
                                      <span className="inline-block h-6 w-6 rounded-full bg-primary"></span>
                                      <span className="text-xl font-bold">Zafago</span>
                                    </Link>
                                    <nav className="hidden md:flex md:gap-6">
                                      <Link
                                        href="/games"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Games
                                      </Link>
                                      <Link
                                        href="/digital-products"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Digital Products
                                      </Link>
                                      <Link
                                        href="/deals"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Deals
                                      </Link>
                                      <Link
                                        href="/bundles"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Bundles
                                      </Link>
                                      <Link
                                        href="/publishers"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Publishers
                                      </Link>
                                      <Link
                                        href="/integrations"
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        Integrations
                                      </Link>
                                    </nav>
                                  </div>

                                  <div className="hidden items-center gap-4 md:flex">
                                    <SearchDialog />
                                    <CartSheet />
                                    <UserNav />
                                    <ThemeToggle />
                                  </div>

                                  <div className="flex items-center gap-2 md:hidden">
                                    <SearchDialog />
                                    <CartSheet />
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" aria-label="Menu">
                                          <Menu className="h-5 w-5" />
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent side="right" className="w-[80vw] sm:max-w-sm">
                                        <div className="grid gap-6 py-6">
                                          <div className="grid gap-3">
                                            <Link
                                              href="/games"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Games
                                            </Link>
                                            <Link
                                              href="/digital-products"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Digital Products
                                            </Link>
                                            <Link
                                              href="/deals"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Deals
                                            </Link>
                                            <Link
                                              href="/bundles"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Bundles
                                            </Link>
                                            <Link
                                              href="/publishers"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Publishers
                                            </Link>
                                            <Link
                                              href="/integrations"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              Integrations
                                            </Link>
                                          </div>
                                          <div className="grid gap-3">
                                            <Link
                                              href="/account"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              <User className="h-4 w-4" />
                                              Account
                                            </Link>
                                            <Link
                                              href="/auth/login"
                                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                              <LogIn className="h-4 w-4" />
                                              Login
                                            </Link>
                                          </div>
                                          <div className="flex items-center">
                                            <ThemeToggle />
                                          </div>
                                        </div>
                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
                              </header>
                              <main className="flex-1">
                                <PageTransition>{children}</PageTransition>
                              </main>
                              <footer className="border-t bg-muted/50">
                                <div className="container px-4 py-12">
                                  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                                    <div>
                                      <h3 className="mb-4 text-lg font-semibold">About Zafago</h3>
                                      <ul className="space-y-2 text-sm">
                                        <li>
                                          <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                            About Us
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                                            Careers
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                                            Blog
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h3 className="mb-4 text-lg font-semibold">Support</h3>
                                      <ul className="space-y-2 text-sm">
                                        <li>
                                          <Link href="/help" className="text-muted-foreground hover:text-foreground">
                                            Help Center
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                                            Contact Us
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                                            FAQs
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h3 className="mb-4 text-lg font-semibold">Legal</h3>
                                      <ul className="space-y-2 text-sm">
                                        <li>
                                          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                                            Terms of Service
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                                            Privacy Policy
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="/refund" className="text-muted-foreground hover:text-foreground">
                                            Refund Policy
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h3 className="mb-4 text-lg font-semibold">Connect</h3>
                                      <ul className="space-y-2 text-sm">
                                        <li>
                                          <Link
                                            href="https://twitter.com"
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            Twitter
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            href="https://facebook.com"
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            Facebook
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            href="https://discord.com"
                                            className="text-muted-foreground hover:text-foreground"
                                          >
                                            Discord
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                                    <p>© {new Date().getFullYear()} Zafago. All rights reserved.</p>
                                    <p className="mt-2">
                                      Zafago is not affiliated with Steam, Epic Games, or any other mentioned platforms.
                                    </p>
                                  </div>
                                </div>
                              </footer>
                            </div>
                            <Toaster />
                            <InitData />
                          </GlobalWrapper>
                        </RecommendationsProvider>
                      </ReviewProvider>
                    </SavedCartProvider>
                  </CartProvider>
                </GameDataProvider>
              </VerificationProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'