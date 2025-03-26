"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/games"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/games" || pathname.startsWith("/games/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Games
      </Link>
      <Link
        href="/marketplace"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/marketplace" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Marketplace
      </Link>
      <Link
        href="/integrations"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/integrations" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Integrations
      </Link>
    </nav>
  )
}

