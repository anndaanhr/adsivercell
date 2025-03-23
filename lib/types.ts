export interface Game {
  id: string
  title: string
  description: string
  price: number
  discount: number
  image?: string
  releaseDate: string
  developer: string
  publisher: string
  // Support both new and old property names
  genreIds?: string[]
  platformIds?: string[]
  // Keep these for backward compatibility
  genres?: string[]
  platforms?: string[]
  rating?: number
  tags?: string[]
  features?: string[]
  systemRequirements?: {
    minimum: SystemRequirements
    recommended: SystemRequirements
  }
  preOrder?: boolean
  dlc?: DLC[]
  editions?: GameEdition[]
  languages?: string[]
  stock?: number
}

export interface SystemRequirements {
  os: string
  processor: string
  memory: string
  graphics: string
  storage: string
}

export interface DLC {
  id: string
  title: string
  price: number
  discount: number
}

export interface GameEdition {
  id: string
  title: string
  price: number
  discount: number
}

export interface Review {
  id: string
  gameId: string
  userId: string
  userName: string
  userImage?: string
  text: string
  rating: number
  date: string
  likes: number
}

export interface GameKey {
  id: string
  gameId: string
  orderId: string
  platform: string
  key: string
  isRedeemed: boolean
  redeemedAt?: string
}

export interface User {
  id: string
  name?: string
  email: string
  image?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  date: string
  status: "completed" | "processing" | "failed"
}

export interface OrderItem {
  gameId: string
  quantity: number
  price: number
  keys: GameKey[]
}

export interface Bundle {
  id: string
  title: string
  description: string
  gameIds: string[]
  price: number
  originalPrice: number
  discount: number
  image?: string
  featured?: boolean
}

export interface Publisher {
  id: string
  name: string
  logo?: string
  description?: string
  founded?: string
  headquarters?: string
  website?: string
}

export interface Developer {
  id: string
  name: string
  publisherId?: string
}

export interface Genre {
  id: string
  name: string
}

export interface Platform {
  id: string
  name: string
  icon: string
}

export interface WishlistItem {
  id: string
  userId: string
  gameId: string
  addedAt: string
}

export interface CartItem {
  gameId: string
  quantity: number
  price: number
  edition?: string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "credit_card" | "paypal" | "crypto"
  isDefault: boolean
  details: any
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  minPurchase?: number
  validUntil: string
  usageLimit?: number
  usageCount: number
  applicableGames?: string[] // empty means all games
}

// New Digital Products Types
export type DigitalProductType = "wallet_topup" | "game_currency" | "subscription" | "gift_card"

export interface DigitalProduct {
  id: string
  title: string
  description: string
  type: DigitalProductType
  platform: string
  image: string
  price: number
  discount: number
  featured?: boolean
  popular?: boolean
  options?: DigitalProductOption[]
  instructions?: string
  requirements?: string[]
  stock: number
}

export interface DigitalProductOption {
  id: string
  name: string
  value: string
  price: number
  discount?: number
}

export interface DigitalProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  featured?: boolean
}

