"use client"

import Link from "next/link"
import { User, LogIn, LogOut, ShoppingCart, Heart, Settings, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useVerification } from "@/components/verification-provider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function UserNav() {
  const { user, logout } = useAuth()
  const { isVerified, sendVerificationEmail } = useVerification()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleVerifyEmail = () => {
    sendVerificationEmail()
    toast({
      title: "Verification Email Sent",
      description: "Please check your inbox and click the verification link",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>{user ? user.name.charAt(0) : "G"}</AvatarFallback>
          </Avatar>
          {user && !isVerified && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                {!isVerified && <Badge className="mt-1 w-fit bg-amber-500 hover:bg-amber-600">Unverified</Badge>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isVerified && (
              <>
                <DropdownMenuItem onClick={handleVerifyEmail}>
                  <Mail className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Verify Email</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/security">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/register">
                <User className="mr-2 h-4 w-4" />
                <span>Sign up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

