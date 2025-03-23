"use client"

import { useEffect } from "react"
import { initializeWithSampleData } from "@/lib/storage"

export default function InitData() {
  useEffect(() => {
    // Initialize sample data when the app loads
    initializeWithSampleData()
  }, [])

  return null
}

