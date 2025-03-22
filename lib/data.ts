import * as blobStorage from "@/lib/blob-storage"
import { games as mockGames } from "@/lib/game-database"
import { genres as mockGenres, platforms as mockPlatforms, publishers as mockPublishers } from "@/lib/game-database"

// Re-export types from blob-storage
export type { StoredUser, StoredGame, StoredOrder, StoredReview } from "@/lib/blob-storage"

// Function to get all games
export async function getGames() {
  // First try to get games from blob storage
  try {
    const storedGames = await blobStorage.getGames()
    if (storedGames && storedGames.length > 0) {
      return storedGames
    }
  } catch (error) {
    console.error("Error fetching games from blob storage:", error)
  }

  // Fallback to mock data
  return mockGames
}

// Function to get a game by ID
export async function getGame(id: string) {
  // First try to get the game from blob storage
  try {
    const game = await blobStorage.getGameById(id)
    if (game) {
      return game
    }
  } catch (error) {
    console.error(`Error fetching game ${id} from blob storage:`, error)
  }

  // Fallback to mock data
  return mockGames.find((game) => game.id === id)
}

// Function to get all bundles
export async function getBundles() {
  // For now, return mock data
  return [
    {
      id: "bundle_1",
      title: "Ultimate RPG Bundle",
      description: "Get the best RPG games in one package and save big!",
      gameIds: ["1", "3", "5"],
      price: 99.99,
      originalPrice: 149.97,
      discount: 33,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "bundle_2",
      title: "Action Pack",
      description: "Experience the most thrilling action games!",
      gameIds: ["2", "4"],
      price: 79.99,
      originalPrice: 109.98,
      discount: 27,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "bundle_3",
      title: "Indie Collection",
      description: "Support indie developers with this amazing collection!",
      gameIds: ["6", "7", "8"],
      price: 49.99,
      originalPrice: 74.97,
      discount: 33,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "bundle_4",
      title: "Strategy Masters",
      description: "Plan, conquer, and rule with these strategy games!",
      gameIds: ["9", "10"],
      price: 69.99,
      originalPrice: 89.98,
      discount: 22,
      image: "/placeholder.svg?height=400&width=600",
    },
  ]
}

// Function to get all users
export async function getUsers() {
  return blobStorage.getUsers()
}

// Function to get a user by ID
export async function getUser(id: string) {
  return blobStorage.getUserById(id)
}

// Function to get a user by email
export async function getUserByEmail(email: string) {
  return blobStorage.getUserByEmail(email)
}

// Function to create a user
export async function createUser(user: any) {
  return blobStorage.createUser(user)
}

// Function to update a user
export async function updateUser(id: string, updates: any) {
  return blobStorage.updateUser(id, updates)
}

// Function to delete a user
export async function deleteUser(id: string) {
  return blobStorage.deleteUser(id)
}

// Function to get all orders
export async function getOrders() {
  return blobStorage.getOrders()
}

// Function to get an order by ID
export async function getOrder(id: string) {
  return blobStorage.getOrderById(id)
}

// Function to get orders by user ID
export async function getOrdersByUser(userId: string) {
  return blobStorage.getOrdersByUserId(userId)
}

// Function to create an order
export async function createOrder(order: any) {
  return blobStorage.createOrder(order)
}

// Function to update an order
export async function updateOrder(id: string, updates: any) {
  return blobStorage.updateOrder(id, updates)
}

// Function to get all reviews
export async function getReviews() {
  return blobStorage.getReviews()
}

// Function to get reviews by game ID
export async function getReviewsByGame(gameId: string) {
  return blobStorage.getReviewsByGameId(gameId)
}

// Function to get reviews by user ID
export async function getReviewsByUser(userId: string) {
  return blobStorage.getReviewsByUserId(userId)
}

// Function to create a review
export async function createReview(review: any) {
  return blobStorage.createReview(review)
}

// Function to update a review
export async function updateReview(id: string, updates: any) {
  return blobStorage.updateReview(id, updates)
}

// Function to delete a review
export async function deleteReview(id: string) {
  return blobStorage.deleteReview(id)
}

// Function to initialize the database with sample data
export async function initializeDatabase() {
  await blobStorage.initializeWithSampleData()
}

export async function getGenres() {
  return mockGenres.map((genre) => genre.name)
}

export async function getPlatforms() {
  return mockPlatforms.map((platform) => platform.name)
}

export async function getPublishers() {
  return mockPublishers.map((publisher) => publisher.name)
}

