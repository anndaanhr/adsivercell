import { put, type PutBlobResult } from "@vercel/blob"

// Define types for our data models
export interface StoredUser {
  id: string
  name: string
  email: string
  password: string // In a real app, you would never store plain passwords
  isVerified: boolean
  createdAt: string
}

export interface StoredGame {
  id: string
  title: string
  price: number
  description?: string
  image?: string
  developer?: string
  publisher?: string
  releaseDate?: string
  genres?: string[]
  platforms?: string[]
  discount?: number
  rating?: number
  isPreorder?: boolean
  preorderDate?: string
  // Add other game properties
}

export interface StoredOrder {
  id: string
  userId: string
  items: Array<{
    gameId: string
    quantity: number
    price: number
  }>
  total: number
  date: string
  status: "pending" | "completed" | "cancelled"
}

export interface StoredReview {
  id: string
  userId: string
  gameId: string
  rating: number
  text: string
  date: string
}

// Storage paths
const STORAGE_PATHS = {
  USERS: "data/users.json",
  GAMES: "data/games.json",
  ORDERS: "data/orders.json",
  REVIEWS: "data/reviews.json",
  VERIFICATION_TOKENS: "data/verification-tokens.json",
  VERIFIED_USERS: "data/verified-users.json",
}

// Generic function to get data from Vercel Blob
export async function getBlobData<T>(path: string, defaultValue: T): Promise<T> {
  try {
    const response = await fetch(`https://ul2z73ze8tn6rm1l.public.blob.vercel-storage.com/${path}`)

    if (!response.ok) {
      if (response.status === 404) {
        // If the file doesn't exist yet, return the default value
        return defaultValue
      }
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Error retrieving data from Vercel Blob (${path}):`, error)
    return defaultValue
  }
}

// Generic function to set data in Vercel Blob
export async function setBlobData<T>(path: string, data: T): Promise<PutBlobResult> {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
    const result = await put(path, blob, { access: "public" })
    return result
  } catch (error) {
    console.error(`Error storing data in Vercel Blob (${path}):`, error)
    throw error
  }
}

// User-related functions
export async function getUsers(): Promise<StoredUser[]> {
  return getBlobData<StoredUser[]>(STORAGE_PATHS.USERS, [])
}

export async function getUserById(id: string): Promise<StoredUser | undefined> {
  const users = await getUsers()
  return users.find((user) => user.id === id)
}

export async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await getUsers()
  return users.find((user) => user.email === email)
}

export async function createUser(user: Omit<StoredUser, "id" | "createdAt" | "isVerified">): Promise<StoredUser> {
  const users = await getUsers()

  // Check if email already exists
  if (users.some((u) => u.email === user.email)) {
    throw new Error("User with this email already exists")
  }

  const newUser: StoredUser = {
    ...user,
    id: `user_${Date.now()}`,
    isVerified: false,
    createdAt: new Date().toISOString(),
  }

  await setBlobData(STORAGE_PATHS.USERS, [...users, newUser])
  return newUser
}

export async function updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser> {
  const users = await getUsers()
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const updatedUser = { ...users[userIndex], ...updates }
  users[userIndex] = updatedUser

  await setBlobData(STORAGE_PATHS.USERS, users)
  return updatedUser
}

export async function deleteUser(id: string): Promise<void> {
  const users = await getUsers()
  await setBlobData(
    STORAGE_PATHS.USERS,
    users.filter((user) => user.id !== id),
  )
}

// Verification-related functions
export async function setUserVerified(email: string, isVerified: boolean): Promise<void> {
  const verifiedUsers = await getBlobData<string[]>(STORAGE_PATHS.VERIFIED_USERS, [])

  if (isVerified && !verifiedUsers.includes(email)) {
    await setBlobData(STORAGE_PATHS.VERIFIED_USERS, [...verifiedUsers, email])
  } else if (!isVerified && verifiedUsers.includes(email)) {
    await setBlobData(
      STORAGE_PATHS.VERIFIED_USERS,
      verifiedUsers.filter((e) => e !== email),
    )
  }

  // Also update the user record
  const users = await getUsers()
  const userIndex = users.findIndex((user) => user.email === email)

  if (userIndex !== -1) {
    users[userIndex].isVerified = isVerified
    await setBlobData(STORAGE_PATHS.USERS, users)
  }
}

export async function isUserVerified(email: string): Promise<boolean> {
  const verifiedUsers = await getBlobData<string[]>(STORAGE_PATHS.VERIFIED_USERS, [])
  return verifiedUsers.includes(email)
}

// Game-related functions
export async function getGames(): Promise<StoredGame[]> {
  return getBlobData<StoredGame[]>(STORAGE_PATHS.GAMES, [])
}

export async function getGameById(id: string): Promise<StoredGame | undefined> {
  const games = await getGames()
  return games.find((game) => game.id === id)
}

export async function createGame(game: Omit<StoredGame, "id">): Promise<StoredGame> {
  const games = await getGames()

  const newGame: StoredGame = {
    ...game,
    id: `game_${Date.now()}`,
  }

  await setBlobData(STORAGE_PATHS.GAMES, [...games, newGame])
  return newGame
}

export async function updateGame(id: string, updates: Partial<StoredGame>): Promise<StoredGame> {
  const games = await getGames()
  const gameIndex = games.findIndex((game) => game.id === id)

  if (gameIndex === -1) {
    throw new Error("Game not found")
  }

  const updatedGame = { ...games[gameIndex], ...updates }
  games[gameIndex] = updatedGame

  await setBlobData(STORAGE_PATHS.GAMES, games)
  return updatedGame
}

export async function deleteGame(id: string): Promise<void> {
  const games = await getGames()
  await setBlobData(
    STORAGE_PATHS.GAMES,
    games.filter((game) => game.id !== id),
  )
}

// Order-related functions
export async function getOrders(): Promise<StoredOrder[]> {
  return getBlobData<StoredOrder[]>(STORAGE_PATHS.ORDERS, [])
}

export async function getOrderById(id: string): Promise<StoredOrder | undefined> {
  const orders = await getOrders()
  return orders.find((order) => order.id === id)
}

export async function getOrdersByUserId(userId: string): Promise<StoredOrder[]> {
  const orders = await getOrders()
  return orders.filter((order) => order.userId === userId)
}

export async function createOrder(order: Omit<StoredOrder, "id" | "date">): Promise<StoredOrder> {
  const orders = await getOrders()

  const newOrder: StoredOrder = {
    ...order,
    id: `order_${Date.now()}`,
    date: new Date().toISOString(),
  }

  await setBlobData(STORAGE_PATHS.ORDERS, [...orders, newOrder])
  return newOrder
}

export async function updateOrder(id: string, updates: Partial<StoredOrder>): Promise<StoredOrder> {
  const orders = await getOrders()
  const orderIndex = orders.findIndex((order) => order.id === id)

  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  const updatedOrder = { ...orders[orderIndex], ...updates }
  orders[orderIndex] = updatedOrder

  await setBlobData(STORAGE_PATHS.ORDERS, orders)
  return updatedOrder
}

// Review-related functions
export async function getReviews(): Promise<StoredReview[]> {
  return getBlobData<StoredReview[]>(STORAGE_PATHS.REVIEWS, [])
}

export async function getReviewsByGameId(gameId: string): Promise<StoredReview[]> {
  const reviews = await getReviews()
  return reviews.filter((review) => review.gameId === gameId)
}

export async function getReviewsByUserId(userId: string): Promise<StoredReview[]> {
  const reviews = await getReviews()
  return reviews.filter((review) => review.userId === userId)
}

export async function createReview(review: Omit<StoredReview, "id" | "date">): Promise<StoredReview> {
  const reviews = await getReviews()

  // Check if user already reviewed this game
  const existingReview = reviews.find((r) => r.userId === review.userId && r.gameId === review.gameId)
  if (existingReview) {
    throw new Error("You have already reviewed this game")
  }

  const newReview: StoredReview = {
    ...review,
    id: `review_${Date.now()}`,
    date: new Date().toISOString(),
  }

  await setBlobData(STORAGE_PATHS.REVIEWS, [...reviews, newReview])
  return newReview
}

export async function updateReview(id: string, updates: Partial<StoredReview>): Promise<StoredReview> {
  const reviews = await getReviews()
  const reviewIndex = reviews.findIndex((review) => review.id === id)

  if (reviewIndex === -1) {
    throw new Error("Review not found")
  }

  const updatedReview = { ...reviews[reviewIndex], ...updates }
  reviews[reviewIndex] = updatedReview

  await setBlobData(STORAGE_PATHS.REVIEWS, reviews)
  return updatedReview
}

export async function deleteReview(id: string): Promise<void> {
  const reviews = await getReviews()
  await setBlobData(
    STORAGE_PATHS.REVIEWS,
    reviews.filter((review) => review.id !== id),
  )
}

// Initialize with sample data
export async function initializeWithSampleData(): Promise<void> {
  // Check if users already exist
  const existingUsers = await getUsers()
  if (existingUsers.length === 0) {
    // Sample users
    const users: StoredUser[] = [
      {
        id: "user_1",
        name: "John Doe",
        email: "john@example.com",
        password: "password123", // In a real app, this would be hashed
        isVerified: true,
        createdAt: "2023-01-01T00:00:00Z",
      },
      {
        id: "user_2",
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        isVerified: false,
        createdAt: "2023-02-01T00:00:00Z",
      },
    ]

    await setBlobData(STORAGE_PATHS.USERS, users)
    await setBlobData(STORAGE_PATHS.VERIFIED_USERS, ["john@example.com"])
  }

  // Check if games already exist
  const existingGames = await getGames()
  if (existingGames.length === 0) {
    // Import mock games from game-database
    const { games: mockGames } = await import("@/lib/game-database")

    // Convert mock games to StoredGame format
    const games = mockGames.map((game) => ({
      id: game.id,
      title: game.title,
      price: game.price,
      description: game.description,
      image: game.image,
      developer: game.developer,
      publisher: game.publisher,
      releaseDate: game.releaseDate,
      genres: game.genres,
      platforms: game.platforms,
      discount: game.discount,
      rating: game.rating,
      isPreorder: game.isPreorder,
      preorderDate: game.preorderDate,
    }))

    await setBlobData(STORAGE_PATHS.GAMES, games)
  }

  // Sample notifications
  const existingNotifications = await getBlobData<any[]>("data/notifications.json", [])
  if (existingNotifications.length === 0) {
    const notifications = [
      {
        id: "notif_1",
        userId: "user_1",
        type: "order",
        title: "Order Completed",
        message: "Your order #ORD-123456 has been completed. Your game keys are now available.",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        link: "/account/orders",
      },
      {
        id: "notif_2",
        userId: "user_1",
        type: "deal",
        title: "Flash Sale Alert",
        message: "A game on your wishlist is now 75% off! Don't miss this limited-time offer.",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        link: "/deals",
      },
      {
        id: "notif_3",
        userId: "user_1",
        type: "wishlist",
        title: "Wishlist Item on Sale",
        message: "Cyberpunk 2077 from your wishlist is now on sale for $29.99!",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        link: "/games/1",
      },
      {
        id: "notif_4",
        userId: "user_1",
        type: "message",
        title: "New Message",
        message: "You have a new message from support regarding your recent purchase.",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        link: "/account/messages",
      },
    ]

    await setBlobData("data/notifications.json", notifications)
  }

  // Sample payment methods
  const existingPaymentMethods = await getBlobData<any[]>("data/payment-methods.json", [])
  if (existingPaymentMethods.length === 0) {
    const paymentMethods = [
      {
        id: "payment_1",
        userId: "user_1",
        type: "credit_card",
        isDefault: true,
        details: {
          cardNumber: "**** **** **** 4242",
          cardHolder: "John Doe",
          expiryDate: "12/25",
        },
      },
    ]

    await setBlobData("data/payment-methods.json", paymentMethods)
  }

  // Sample orders
  const existingOrders = await getOrders()
  if (existingOrders.length === 0) {
    const orders = [
      {
        id: "order_1",
        userId: "user_1",
        items: [
          {
            gameId: "1",
            quantity: 1,
            price: 59.99,
          },
        ],
        total: 59.99,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        status: "completed",
      },
      {
        id: "order_2",
        userId: "user_1",
        items: [
          {
            gameId: "2",
            quantity: 1,
            price: 49.99,
          },
          {
            gameId: "3",
            quantity: 1,
            price: 39.99,
          },
        ],
        total: 89.98,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
        status: "completed",
      },
    ]

    await setBlobData(STORAGE_PATHS.ORDERS, orders)
  }

  // Sample wishlist
  const existingWishlist = await getBlobData<any[]>("data/wishlist.json", [])
  if (existingWishlist.length === 0) {
    const wishlist = [
      {
        id: "wishlist_1",
        userId: "user_1",
        gameId: "4",
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      },
      {
        id: "wishlist_2",
        userId: "user_1",
        gameId: "5",
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      },
    ]

    await setBlobData("data/wishlist.json", wishlist)
  }
}

