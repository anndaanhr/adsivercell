// A simple data persistence layer using localStorage

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

// Storage keys
const STORAGE_KEYS = {
  USERS: "zafago_users",
  GAMES: "zafago_games",
  ORDERS: "zafago_orders",
  REVIEWS: "zafago_reviews",
  VERIFICATION_TOKENS: "zafago_verification_tokens",
  VERIFIED_USERS: "zafago_verified_users",
  CURRENT_USER: "zafago_current_user",
  CART: "zafago_cart",
}

// Check if we're running on the server or in the browser
const isServer = typeof window === "undefined"

// Generic function to get data from localStorage
export function getStoredData<T>(key: string, defaultValue: T): T {
  if (isServer) {
    return defaultValue // Return default when running on server
  }

  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : defaultValue
  } catch (error) {
    console.error(`Error retrieving data from localStorage (${key}):`, error)
    return defaultValue
  }
}

// Generic function to set data in localStorage
export function setStoredData<T>(key: string, data: T): void {
  if (isServer) {
    return // Do nothing when running on server
  }

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error storing data in localStorage (${key}):`, error)
  }
}

// User-related functions
export function getUsers(): StoredUser[] {
  return getStoredData<StoredUser[]>(STORAGE_KEYS.USERS, [])
}

export function getUserById(id: string): StoredUser | undefined {
  const users = getUsers()
  return users.find((user) => user.id === id)
}

export function getUserByEmail(email: string): StoredUser | undefined {
  const users = getUsers()
  return users.find((user) => user.email === email)
}

export function createUser(user: Omit<StoredUser, "id" | "createdAt" | "isVerified">): StoredUser {
  const users = getUsers()

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

  setStoredData(STORAGE_KEYS.USERS, [...users, newUser])
  return newUser
}

export function updateUser(id: string, updates: Partial<StoredUser>): StoredUser {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  const updatedUser = { ...users[userIndex], ...updates }
  users[userIndex] = updatedUser

  setStoredData(STORAGE_KEYS.USERS, users)
  return updatedUser
}

export function deleteUser(id: string): void {
  const users = getUsers()
  setStoredData(
    STORAGE_KEYS.USERS,
    users.filter((user) => user.id !== id),
  )
}

// Verification-related functions
export function setUserVerified(email: string, isVerified: boolean): void {
  if (isServer) return

  const verifiedUsers = getStoredData<string[]>(STORAGE_KEYS.VERIFIED_USERS, [])

  if (isVerified && !verifiedUsers.includes(email)) {
    setStoredData(STORAGE_KEYS.VERIFIED_USERS, [...verifiedUsers, email])
  } else if (!isVerified && verifiedUsers.includes(email)) {
    setStoredData(
      STORAGE_KEYS.VERIFIED_USERS,
      verifiedUsers.filter((e) => e !== email),
    )
  }

  // Also update the user record
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.email === email)

  if (userIndex !== -1) {
    users[userIndex].isVerified = isVerified
    setStoredData(STORAGE_KEYS.USERS, users)
  }
}

export function isUserVerified(email: string): boolean {
  const verifiedUsers = getStoredData<string[]>(STORAGE_KEYS.VERIFIED_USERS, [])
  return verifiedUsers.includes(email)
}

// Game-related functions
export function getGames(): StoredGame[] {
  return getStoredData<StoredGame[]>(STORAGE_KEYS.GAMES, [])
}

export function getGameById(id: string): StoredGame | undefined {
  const games = getGames()
  return games.find((game) => game.id === id)
}

export function createGame(game: Omit<StoredGame, "id">): StoredGame {
  const games = getGames()

  const newGame: StoredGame = {
    ...game,
    id: `game_${Date.now()}`,
  }

  setStoredData(STORAGE_KEYS.GAMES, [...games, newGame])
  return newGame
}

export function updateGame(id: string, updates: Partial<StoredGame>): StoredGame {
  const games = getGames()
  const gameIndex = games.findIndex((game) => game.id === id)

  if (gameIndex === -1) {
    throw new Error("Game not found")
  }

  const updatedGame = { ...games[gameIndex], ...updates }
  games[gameIndex] = updatedGame

  setStoredData(STORAGE_KEYS.GAMES, games)
  return updatedGame
}

export function deleteGame(id: string): void {
  const games = getGames()
  setStoredData(
    STORAGE_KEYS.GAMES,
    games.filter((game) => game.id !== id),
  )
}

// Order-related functions
export function getOrders(): StoredOrder[] {
  return getStoredData<StoredOrder[]>(STORAGE_KEYS.ORDERS, [])
}

export function getOrderById(id: string): StoredOrder | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === id)
}

export function getOrdersByUserId(userId: string): StoredOrder[] {
  const orders = getOrders()
  return orders.filter((order) => order.userId === userId)
}

export function createOrder(order: Omit<StoredOrder, "id" | "date">): StoredOrder {
  const orders = getOrders()

  const newOrder: StoredOrder = {
    ...order,
    id: `order_${Date.now()}`,
    date: new Date().toISOString(),
  }

  setStoredData(STORAGE_KEYS.ORDERS, [...orders, newOrder])
  return newOrder
}

export function updateOrder(id: string, updates: Partial<StoredOrder>): StoredOrder {
  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === id)

  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  const updatedOrder = { ...orders[orderIndex], ...updates }
  orders[orderIndex] = updatedOrder

  setStoredData(STORAGE_KEYS.ORDERS, orders)
  return updatedOrder
}

// Review-related functions
export function getReviews(): StoredReview[] {
  return getStoredData<StoredReview[]>(STORAGE_KEYS.REVIEWS, [])
}

export function getReviewsByGameId(gameId: string): StoredReview[] {
  const reviews = getReviews()
  return reviews.filter((review) => review.gameId === gameId)
}

export function getReviewsByUserId(userId: string): StoredReview[] {
  const reviews = getReviews()
  return reviews.filter((review) => review.userId === userId)
}

export function createReview(review: Omit<StoredReview, "id" | "date">): StoredReview {
  const reviews = getReviews()

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

  setStoredData(STORAGE_KEYS.REVIEWS, [...reviews, newReview])
  return newReview
}

export function updateReview(id: string, updates: Partial<StoredReview>): StoredReview {
  const reviews = getReviews()
  const reviewIndex = reviews.findIndex((review) => review.id === id)

  if (reviewIndex === -1) {
    throw new Error("Review not found")
  }

  const updatedReview = { ...reviews[reviewIndex], ...updates }
  reviews[reviewIndex] = updatedReview

  setStoredData(STORAGE_KEYS.REVIEWS, reviews)
  return updatedReview
}

export function deleteReview(id: string): void {
  const reviews = getReviews()
  setStoredData(
    STORAGE_KEYS.REVIEWS,
    reviews.filter((review) => review.id !== id),
  )
}

// Current user session management
export function getCurrentUser(): string | null {
  if (isServer) return null

  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
}

export function setCurrentUser(userId: string | null): void {
  if (isServer) return

  if (userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId)
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Clear all data (useful for testing)
export function clearAllData(): void {
  if (isServer) return

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

// Export a function to initialize with sample data
export function initializeWithSampleData(): void {
  if (isServer) return

  // Only initialize if data doesn't exist
  if (getUsers().length === 0) {
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

    setStoredData(STORAGE_KEYS.USERS, users)
    setStoredData(STORAGE_KEYS.VERIFIED_USERS, ["john@example.com"])

    // Add more sample data as needed
  }

  // Sample notifications
  if (getStoredData<any[]>("zafago_notifications", []).length === 0) {
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

    setStoredData("zafago_notifications", notifications)
  }

  // Sample payment methods
  if (getStoredData<any[]>("zafago_payment_methods", []).length === 0) {
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

    setStoredData("zafago_payment_methods", paymentMethods)
  }

  // Sample orders
  if (getStoredData<any[]>("zafago_orders", []).length === 0) {
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

    setStoredData("zafago_orders", orders)
  }

  // Sample wishlist
  if (getStoredData<any[]>("zafago_wishlist", []).length === 0) {
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

    setStoredData("zafago_wishlist", wishlist)
  }
}

