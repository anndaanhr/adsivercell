"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to create a product" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("imageUrl") as string
  const category = formData.get("category") as string

  if (!name || !description || isNaN(price)) {
    return { success: false, error: "Missing required fields" }
  }

  // Insert the product into the database
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      image_url: imageUrl,
      category,
      user_id: user.id,
    })
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  // Revalidate the products page
  revalidatePath("/products")

  return { success: true, data }
}

export async function getProducts() {
  const supabase = createServerActionClient({ cookies })

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data
}

