import { createClient } from '@supabase/supabase-js'

// Define environment variables with proper type checking
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rvdpjmnrecooxfohislz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZHBqbW5yZWNvb3hmb2hpc2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjExNjgsImV4cCI6MjA1ODIzNzE2OH0.Q4VtBPtSv0heZjCO784TUc2cj_DmI-fVY5kLj5RPieo'

// Create a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to fetch digital products from the Supabase database
export async function fetchDigitalProducts() {
  const { data, error } = await supabase
    .from('digital_products')
    .select('*')

  if (error) {
    console.error('Error fetching digital products:', error)
    return []
  }

  return data
}

// Function to fetch a specific digital product by ID
export async function fetchDigitalProductById(id: string) {
  const { data, error } = await supabase
    .from('digital_products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching digital product with ID ${id}:`, error)
    return null
  }

  return data
}

// Function to create a new order
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()

  if (error) {
    console.error('Error creating order:', error)
    return null
  }

  return data[0]
}

// Function to fetch user orders
export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    return []
  }

  return data
}
