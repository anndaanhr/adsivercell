// This is a placeholder for the Supabase client
// We'll implement this properly when we set up Supabase

export const createClient = () => {
  // This will be implemented when we add Supabase
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  }
}

