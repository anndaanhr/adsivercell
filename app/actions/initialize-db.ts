"use server"

import { initializeDatabase } from "@/lib/data"

export async function initializeDb() {
  try {
    await initializeDatabase()
    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, message: "Failed to initialize database" }
  }
}

