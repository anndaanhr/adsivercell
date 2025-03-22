/**
 * Configuration file for environment variables
 * This centralizes all environment variable access and provides default values
 */

// Supabase configuration
export const SUPABASE = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rvdpjmnrecooxfohislz.supabase.co',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZHBqbW5yZWNvb3hmb2hpc2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjExNjgsImV4cCI6MjA1ODIzNzE2OH0.Q4VtBPtSv0heZjCO784TUc2cj_DmI-fVY5kLj5RPieo',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
};

// Postgres database configuration
export const POSTGRES = {
  URL: process.env.POSTGRES_URL,
  PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  USER: process.env.POSTGRES_USER,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DATABASE: process.env.POSTGRES_DATABASE,
  HOST: process.env.POSTGRES_HOST,
};

// Vercel Blob storage configuration
export const BLOB_STORAGE = {
  READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_Ul2z73ze8Tn6rM1L_7PEcXMOLGhryZ9cRBPgq9VRrEZ7fKD',
};

// X AI (Grok) configuration
export const XAI = {
  API_KEY: process.env.XAI_API_KEY || 'xai-C2PepxGUGsq8xQZ5zPdRSQwbiDryn9Dg5x9tPTBLt1Pv38YfWTHKGDnWTmwa8lz7GUNspARMJ5XHvmYh',
  BASE_URL: 'https://api.x.ai/v1',
};

// Site configuration
export const SITE = {
  NAME: 'Zafago',
  DESCRIPTION: 'Digital game store selling top-up cards, game currencies, and premium subscriptions',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://zafago.vercel.app',
  SUPPORT_EMAIL: 'support@zafago.com',
  CONTACT_EMAIL: 'contact@zafago.com',
};

// Payment configuration (placeholder - you would integrate real payment providers)
export const PAYMENT = {
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
  PROVIDERS: ['stripe', 'paypal', 'crypto'],
};

// Feature flags
export const FEATURES = {
  USE_AI_RECOMMENDATIONS: true,
  USE_AI_CUSTOMER_SUPPORT: true,
  ENABLE_WISHLIST: true,
  ENABLE_COMPARE: true,
  ENABLE_REVIEWS: true,
};

// Export the complete config object
export const CONFIG = {
  SUPABASE,
  POSTGRES,
  BLOB_STORAGE,
  XAI,
  SITE,
  PAYMENT,
  FEATURES,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

export default CONFIG;
