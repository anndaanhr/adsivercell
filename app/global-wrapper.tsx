"use client"

import { Suspense, type ReactNode } from "react"

export default function GlobalWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-background"></div>}>{children}</Suspense>
}

