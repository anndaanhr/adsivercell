"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function initializeDatabase() {
  const supabase = createServerActionClient({ cookies })

  try {
    // First, check if we already have games in the database
    const { count, error: countError } = await supabase.from("games").select("*", { count: "exact", head: true })

    if (countError) throw countError

    // If we already have games, don't initialize again
    if (count && count > 0) {
      return { success: true, message: "Database already initialized with games" }
    }

    // Sample games data
    const sampleGames = [
      {
        title: "Cyberpunk 2077",
        description:
          "An open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.",
        price: 59.99,
        discount: 25,
        release_date: "2020-12-10",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        cover_image_url: "https://example.com/images/cyberpunk.jpg",
        genres: ["RPG", "Action", "Open World"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "Elden Ring",
        description:
          "An action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring.",
        price: 69.99,
        discount: 0,
        release_date: "2022-02-25",
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        cover_image_url: "https://example.com/images/elden-ring.jpg",
        genres: ["RPG", "Action", "Open World"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      },
      {
        title: "God of War Ragnarök",
        description:
          "An action-adventure game that continues the story of Kratos and his son Atreus as they prepare for Ragnarök.",
        price: 69.99,
        discount: 15,
        release_date: "2022-11-09",
        developer: "Santa Monica Studio",
        publisher: "Sony Interactive Entertainment",
        cover_image_url: "https://example.com/images/god-of-war.jpg",
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5", "PlayStation 4"],
      },
    ]

    // Insert sample games
    const { error: insertError } = await supabase.from("games").insert(sampleGames)

    if (insertError) throw insertError

    // Revalidate the games page
    revalidatePath("/games")

    return { success: true, message: "Database initialized successfully with sample games" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initialize database",
    }
  }
}

export async function initializeDb() {
  try {
    await initializeDatabase()
    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, message: "Failed to initialize database" }
  }
}

