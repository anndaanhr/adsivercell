import type { DigitalProduct, DigitalProductCategory } from "./types"

// Digital Product Categories
export const digitalProductCategories: DigitalProductCategory[] = [
  {
    id: "wallet-topups",
    name: "Wallet Top-ups",
    slug: "wallet-topups",
    description: "Add funds to your gaming platform wallets",
    image: "/digital-products/categories/wallet-topups.jpg",
    featured: true,
  },
  {
    id: "game-currencies",
    name: "Game Currencies",
    slug: "game-currencies",
    description: "Purchase in-game currencies for your favorite games",
    image: "/digital-products/categories/game-currencies.jpg",
    featured: true,
  },
  {
    id: "subscriptions",
    name: "Premium Subscriptions",
    slug: "subscriptions",
    description: "Get access to premium services and content",
    image: "/digital-products/categories/subscriptions.jpg",
    featured: true,
  },
  {
    id: "gift-cards",
    name: "Gift Cards",
    slug: "gift-cards",
    description: "Digital gift cards for various platforms and services",
    image: "/digital-products/categories/gift-cards.jpg",
    featured: false,
  },
]

// Digital Products
export const digitalProducts: DigitalProduct[] = [
  // Wallet Top-ups
  {
    id: "steam-wallet-1",
    title: "Steam Wallet Code",
    description: "Add funds to your Steam Wallet to purchase games, software, hardware, and more.",
    type: "wallet_topup",
    platform: "Steam",
    image: "/digital-products/steam-wallet.jpg",
    price: 20,
    discount: 0,
    featured: true,
    popular: true,
    options: [
      { id: "steam-5", name: "$5 USD", value: "5", price: 5 },
      { id: "steam-10", name: "$10 USD", value: "10", price: 10 },
      { id: "steam-20", name: "$20 USD", value: "20", price: 20 },
      { id: "steam-50", name: "$50 USD", value: "50", price: 50 },
      { id: "steam-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions:
      "You will receive a code that can be redeemed on Steam. Go to Steam > Games > Redeem a Steam Wallet Code.",
    requirements: ["Steam account"],
    stock: 500,
  },
  {
    id: "xbox-gift-card-1",
    title: "Xbox Gift Card",
    description: "Add funds to your Microsoft account to purchase games, add-ons, and more on Xbox and Windows.",
    type: "wallet_topup",
    platform: "Xbox",
    image: "/digital-products/xbox-gift-card.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "xbox-10", name: "$10 USD", value: "10", price: 10 },
      { id: "xbox-25", name: "$25 USD", value: "25", price: 25 },
      { id: "xbox-50", name: "$50 USD", value: "50", price: 50 },
      { id: "xbox-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on Xbox. Go to Settings > Account > Redeem code.",
    requirements: ["Microsoft account", "Xbox console or Windows PC"],
    stock: 300,
  },
  {
    id: "psn-card-1",
    title: "PlayStation Store Gift Card",
    description: "Add funds to your PlayStation wallet to purchase games, add-ons, and more.",
    type: "wallet_topup",
    platform: "PlayStation",
    image: "/digital-products/psn-card.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "psn-10", name: "$10 USD", value: "10", price: 10 },
      { id: "psn-25", name: "$25 USD", value: "25", price: 25 },
      { id: "psn-50", name: "$50 USD", value: "50", price: 50 },
      { id: "psn-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on PlayStation Store. Go to Store > Redeem Codes.",
    requirements: ["PlayStation Network account"],
    stock: 300,
  },
  {
    id: "nintendo-eshop-1",
    title: "Nintendo eShop Card",
    description: "Add funds to your Nintendo eShop account to purchase games, add-ons, and more.",
    type: "wallet_topup",
    platform: "Nintendo",
    image: "/digital-products/nintendo-eshop.jpg",
    price: 20,
    discount: 0,
    options: [
      { id: "nintendo-10", name: "$10 USD", value: "10", price: 10 },
      { id: "nintendo-20", name: "$20 USD", value: "20", price: 20 },
      { id: "nintendo-35", name: "$35 USD", value: "35", price: 35 },
      { id: "nintendo-50", name: "$50 USD", value: "50", price: 50 },
    ],
    instructions: "You will receive a code that can be redeemed on Nintendo eShop. Go to Nintendo eShop > Redeem Code.",
    requirements: ["Nintendo account", "Nintendo Switch, 3DS, or Wii U"],
    stock: 250,
  },

  // Game Currencies
  {
    id: "mobile-legends-diamonds-1",
    title: "Mobile Legends: Bang Bang Diamonds",
    description: "Purchase Diamonds for Mobile Legends: Bang Bang to buy heroes, skins, and more.",
    type: "game_currency",
    platform: "Mobile",
    image: "/digital-products/mobile-legends-diamonds.jpg",
    price: 10,
    discount: 5,
    popular: true,
    options: [
      { id: "ml-50", name: "50 Diamonds", value: "50", price: 1.99 },
      { id: "ml-100", name: "100 Diamonds", value: "100", price: 3.99 },
      { id: "ml-250", name: "250 Diamonds", value: "250", price: 9.99 },
      { id: "ml-500", name: "500 Diamonds", value: "500", price: 19.99 },
      { id: "ml-1000", name: "1000 Diamonds", value: "1000", price: 39.99 },
    ],
    instructions:
      "Enter your Mobile Legends User ID and Zone ID. The diamonds will be added to your account within 24 hours.",
    requirements: ["Mobile Legends: Bang Bang account", "User ID", "Zone ID"],
    stock: 1000,
  },
  {
    id: "pubg-uc-1",
    title: "PUBG Mobile UC",
    description: "Purchase Unknown Cash (UC) for PUBG Mobile to buy outfits, weapons, and more.",
    type: "game_currency",
    platform: "Mobile",
    image: "/digital-products/pubg-uc.jpg",
    price: 10,
    discount: 0,
    options: [
      { id: "pubg-60", name: "60 UC", value: "60", price: 0.99 },
      { id: "pubg-300", name: "300 UC", value: "300", price: 4.99 },
      { id: "pubg-600", name: "600 UC", value: "600", price: 9.99 },
      { id: "pubg-1500", name: "1500 UC", value: "1500", price: 24.99 },
      { id: "pubg-3000", name: "3000 UC", value: "3000", price: 49.99 },
    ],
    instructions: "Enter your PUBG Mobile User ID. The UC will be added to your account within 24 hours.",
    requirements: ["PUBG Mobile account", "User ID"],
    stock: 1000,
  },
  {
    id: "fortnite-vbucks-1",
    title: "Fortnite V-Bucks",
    description: "Purchase V-Bucks for Fortnite to buy Battle Passes, outfits, and more.",
    type: "game_currency",
    platform: "Multi-platform",
    image: "/digital-products/fortnite-vbucks.jpg",
    price: 10,
    discount: 0,
    featured: true,
    options: [
      { id: "vbucks-1000", name: "1,000 V-Bucks", value: "1000", price: 9.99 },
      { id: "vbucks-2800", name: "2,800 V-Bucks", value: "2800", price: 24.99 },
      { id: "vbucks-5000", name: "5,000 V-Bucks", value: "5000", price: 39.99 },
      { id: "vbucks-13500", name: "13,500 V-Bucks", value: "13500", price: 99.99 },
    ],
    instructions: "You will receive a code that can be redeemed on the Epic Games Store or within Fortnite.",
    requirements: ["Epic Games account", "Fortnite installed"],
    stock: 800,
  },
  {
    id: "roblox-robux-1",
    title: "Roblox Robux",
    description: "Purchase Robux for Roblox to buy items, accessories, and more.",
    type: "game_currency",
    platform: "Multi-platform",
    image: "/digital-products/roblox-robux.jpg",
    price: 10,
    discount: 0,
    options: [
      { id: "robux-400", name: "400 Robux", value: "400", price: 4.99 },
      { id: "robux-800", name: "800 Robux", value: "800", price: 9.99 },
      { id: "robux-1700", name: "1,700 Robux", value: "1700", price: 19.99 },
      { id: "robux-4500", name: "4,500 Robux", value: "4500", price: 49.99 },
      { id: "robux-10000", name: "10,000 Robux", value: "10000", price: 99.99 },
    ],
    instructions: "You will receive a code that can be redeemed on the Roblox website.",
    requirements: ["Roblox account"],
    stock: 700,
  },

  // Subscriptions
  {
    id: "youtube-premium-1",
    title: "YouTube Premium",
    description: "Enjoy ad-free videos, background play, and YouTube Music Premium.",
    type: "subscription",
    platform: "Multi-platform",
    image: "/digital-products/youtube-premium.jpg",
    price: 11.99,
    discount: 0,
    options: [
      { id: "yt-1month", name: "1 Month", value: "1", price: 11.99 },
      { id: "yt-3month", name: "3 Months", value: "3", price: 35.97, discount: 10 },
      { id: "yt-12month", name: "12 Months", value: "12", price: 143.88, discount: 15 },
    ],
    instructions: "You will receive a code that can be redeemed on YouTube. Go to youtube.com/redeem.",
    requirements: ["Google account"],
    stock: 500,
  },
  {
    id: "spotify-premium-1",
    title: "Spotify Premium",
    description: "Enjoy ad-free music, offline listening, and high-quality audio.",
    type: "subscription",
    platform: "Multi-platform",
    image: "/digital-products/spotify-premium.jpg",
    price: 9.99,
    discount: 0,
    popular: true,
    options: [
      { id: "spotify-1month", name: "1 Month", value: "1", price: 9.99 },
      { id: "spotify-3month", name: "3 Months", value: "3", price: 29.97, discount: 10 },
      { id: "spotify-12month", name: "12 Months", value: "12", price: 119.88, discount: 15 },
    ],
    instructions: "You will receive a code that can be redeemed on Spotify. Go to spotify.com/redeem.",
    requirements: ["Spotify account"],
    stock: 500,
  },
  {
    id: "netflix-1",
    title: "Netflix Gift Card",
    description: "Watch TV shows and movies on your favorite devices.",
    type: "subscription",
    platform: "Multi-platform",
    image: "/digital-products/netflix.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "netflix-25", name: "$25 USD", value: "25", price: 25 },
      { id: "netflix-50", name: "$50 USD", value: "50", price: 50 },
      { id: "netflix-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on Netflix. Go to netflix.com/redeem.",
    requirements: ["Netflix account"],
    stock: 400,
  },
  {
    id: "xbox-game-pass-1",
    title: "Xbox Game Pass Ultimate",
    description: "Get unlimited access to over 100 high-quality games, Xbox Live Gold, and EA Play.",
    type: "subscription",
    platform: "Xbox/PC",
    image: "/digital-products/xbox-game-pass.jpg",
    price: 14.99,
    discount: 10,
    featured: true,
    options: [
      { id: "gamepass-1month", name: "1 Month", value: "1", price: 14.99 },
      { id: "gamepass-3month", name: "3 Months", value: "3", price: 44.97, discount: 10 },
      { id: "gamepass-12month", name: "12 Months", value: "12", price: 179.88, discount: 15 },
    ],
    instructions: "You will receive a code that can be redeemed on Xbox or PC. Go to microsoft.com/redeem.",
    requirements: ["Microsoft account", "Xbox console or Windows PC"],
    stock: 600,
  },

  // Gift Cards
  {
    id: "amazon-gift-card-1",
    title: "Amazon Gift Card",
    description: "Shop millions of products on Amazon with an Amazon Gift Card.",
    type: "gift_card",
    platform: "Amazon",
    image: "/digital-products/amazon-gift-card.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "amazon-10", name: "$10 USD", value: "10", price: 10 },
      { id: "amazon-25", name: "$25 USD", value: "25", price: 25 },
      { id: "amazon-50", name: "$50 USD", value: "50", price: 50 },
      { id: "amazon-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on Amazon. Go to amazon.com/redeem.",
    requirements: ["Amazon account"],
    stock: 500,
  },
  {
    id: "google-play-1",
    title: "Google Play Gift Card",
    description: "Get apps, games, movies, books, and more on Google Play.",
    type: "gift_card",
    platform: "Google Play",
    image: "/digital-products/google-play.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "google-10", name: "$10 USD", value: "10", price: 10 },
      { id: "google-25", name: "$25 USD", value: "25", price: 25 },
      { id: "google-50", name: "$50 USD", value: "50", price: 50 },
      { id: "google-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on Google Play. Go to play.google.com/redeem.",
    requirements: ["Google account"],
    stock: 500,
  },
  {
    id: "apple-app-store-1",
    title: "App Store & iTunes Gift Card",
    description:
      "Get apps, games, music, movies, TV shows, books, and more on the App Store, iTunes Store, and Apple Books.",
    type: "gift_card",
    platform: "Apple",
    image: "/digital-products/apple-gift-card.jpg",
    price: 25,
    discount: 0,
    options: [
      { id: "apple-10", name: "$10 USD", value: "10", price: 10 },
      { id: "apple-25", name: "$25 USD", value: "25", price: 25 },
      { id: "apple-50", name: "$50 USD", value: "50", price: 50 },
      { id: "apple-100", name: "$100 USD", value: "100", price: 100 },
    ],
    instructions: "You will receive a code that can be redeemed on the App Store or iTunes Store.",
    requirements: ["Apple ID"],
    stock: 500,
  },
]

// Helper functions
export function getDigitalProductById(id: string): DigitalProduct | undefined {
  return digitalProducts.find((product) => product.id === id)
}

export function getDigitalProductsByType(type: string): DigitalProduct[] {
  return digitalProducts.filter((product) => product.type === type)
}

export function getDigitalProductsByCategory(categoryId: string): DigitalProduct[] {
  switch (categoryId) {
    case "wallet-topups":
      return getDigitalProductsByType("wallet_topup")
    case "game-currencies":
      return getDigitalProductsByType("game_currency")
    case "subscriptions":
      return getDigitalProductsByType("subscription")
    case "gift-cards":
      return getDigitalProductsByType("gift_card")
    default:
      return []
  }
}

export function getFeaturedDigitalProducts(limit = 6): DigitalProduct[] {
  return digitalProducts.filter((product) => product.featured).slice(0, limit)
}

export function getPopularDigitalProducts(limit = 6): DigitalProduct[] {
  return digitalProducts.filter((product) => product.popular).slice(0, limit)
}

export function getCategoryById(id: string): DigitalProductCategory | undefined {
  return digitalProductCategories.find((category) => category.id === id)
}

