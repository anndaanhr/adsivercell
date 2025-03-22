import type { Game, Bundle, Review } from "./types"

// Initial game data
export const initialGames: Game[] = [
  {
    id: "1",
    title: "Cyberpunk 2077",
    description:
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    price: 59.99,
    discount: 25,
    image: "/games/cyberpunk.jpg",
    genreIds: ["RPG", "Action", "Open World"],
    platformIds: ["Steam", "Epic"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: "2020-12-10",
    rating: 4.2,
    tags: ["Cyberpunk", "RPG", "Open World", "Futuristic"]
  },
  {
    id: "2",
    title: "Elden Ring",
    description: "Elden Ring is an action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
    price: 59.99,
    discount: 0,
    image: "/games/elden-ring.jpg",
    genreIds: ["RPG", "Action", "Open World"],
    platformIds: ["Steam"],
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: "2022-02-25",
    rating: 4.8,
    tags: ["Fantasy", "Souls-like", "Open World"]
  },
  {
    id: "3",
    title: "God of War",
    description:
      "God of War is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment.",
    price: 49.99,
    discount: 15,
    image: "/games/god-of-war.jpg",
    genreIds: ["Action", "Adventure"],
    platformIds: ["Steam", "Epic"],
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2022-01-14",
    rating: 4.5,
    tags: ["Action", "Adventure"]
  },
  {
    id: "4",
    title: "Red Dead Redemption 2",
    description: "Red Dead Redemption 2 is an epic tale of life in America's unforgiving heartland.",
    price: 59.99,
    discount: 33,
    image: "/games/rdr2.jpg",
    genreIds: ["Action", "Adventure", "Open World"],
    platformIds: ["Steam", "Epic"],
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: "2019-12-05",
    rating: 4.7,
    tags: ["Western", "Open World"]
  },
  {
    id: "5",
    title: "The Witcher 3: Wild Hunt",
    description:
      "The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe.",
    price: 39.99,
    discount: 70,
    image: "/games/witcher3.jpg",
    genreIds: ["RPG", "Open World", "Fantasy"],
    platformIds: ["Steam", "Epic", "GOG"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: "2015-05-19",
    rating: 4.9,
    tags: ["Fantasy", "RPG"]
  },
  {
    id: "6",
    title: "Horizon Zero Dawn",
    description: "Experience Aloy's legendary quest to unravel the mysteries of a future Earth ruled by Machines.",
    price: 49.99,
    discount: 50,
    image: "/games/horizon.jpg",
    genreIds: ["Action", "RPG", "Open World"],
    platformIds: ["Steam", "Epic"],
    developer: "Guerrilla Games",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2020-08-07",
    rating: 4.6,
    tags: ["Action", "Open World"]
  },
  {
    id: "7",
    title: "Hades",
    description:
      "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.",
    price: 24.99,
    discount: 20,
    image: "/games/hades.jpg",
    genreIds: ["Action", "Roguelike", "Indie"],
    platformIds: ["Steam", "Epic"],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "2020-09-17",
    rating: 4.8,
    tags: ["Indie", "Roguelike"]
  },
  {
    id: "8",
    title: "Stardew Valley",
    description:
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    price: 14.99,
    discount: 0,
    image: "/games/stardew-valley.jpg",
    genreIds: ["Simulation", "RPG", "Indie"],
    platformIds: ["Steam", "GOG"],
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    releaseDate: "2016-02-26",
    rating: 4.7,
    tags: ["Indie", "Simulation"]
  },
  {
    id: "9",
    title: "Assassin's Creed Valhalla",
    description:
      "Become Eivor, a legendary Viking raider on a quest for glory. Explore England's Dark Ages as you raid your enemies, grow your settlement, and build your political power.",
    price: 59.99,
    discount: 60,
    image: "/games/ac-valhalla.jpg",
    genreIds: ["Action", "RPG", "Open World"],
    platformIds: ["Epic"],
    developer: "Ubisoft Montreal",
    publisher: "Ubisoft",
    releaseDate: "2020-11-10",
    rating: 4.3,
    tags: ["Action", "Open World"]
  },
  {
    id: "10",
    title: "Far Cry 6",
    description:
      "Welcome to Yara, a tropical paradise frozen in time. As dictator Antón Castillo plans to restore his nation to its former glory, you'll play as Dani Rojas, fighting to liberate Yara.",
    price: 59.99,
    discount: 50,
    image: "/games/far-cry-6.jpg",
    genreIds: ["Action", "FPS", "Open World"],
    platformIds: ["Epic"],
    developer: "Ubisoft Toronto",
    publisher: "Ubisoft",
    releaseDate: "2021-10-07",
    rating: 4.0,
    tags: ["Action", "Open World"]
  },
  {
    id: "11",
    title: "The Last of Us Part I",
    description:
      "Experience the emotional storytelling and unforgettable characters in The Last of Us, winner of over 200 Game of the Year awards.",
    price: 59.99,
    discount: 0,
    image: "/games/last-of-us.jpg",
    genreIds: ["Action", "Adventure", "Survival"],
    platformIds: ["Steam"],
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2022-09-02",
    rating: 4.9,
    tags: ["Action", "Survival"]
  },
  {
    id: "12",
    title: "Hogwarts Legacy",
    description:
      "Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books.",
    price: 59.99,
    discount: 20,
    image: "/games/hogwarts-legacy.jpg",
    genreIds: ["RPG", "Open World", "Fantasy"],
    platformIds: ["Steam", "Epic"],
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    releaseDate: "2023-02-10",
    rating: 4.5,
    tags: ["Fantasy", "Open World"]
  },
]

// Initial bundle data
export const initialBundles: Bundle[] = [
  {
    id: "bundle_1",
    title: "CD Projekt Red Collection",
    description:
      "Experience the best of CD Projekt Red with this complete collection featuring Cyberpunk 2077 and The Witcher 3: Wild Hunt.",
    gameIds: ["1", "5"],
    price: 69.99,
    originalPrice: 99.98,
    discount: 30,
    featured: true,
  },
  {
    id: "bundle_2",
    title: "Ubisoft Adventure Pack",
    description:
      "Dive into epic adventures with Ubisoft's top titles including Assassin's Creed Valhalla and Far Cry 6.",
    gameIds: ["9", "10"],
    price: 49.99,
    originalPrice: 119.98,
    discount: 58,
  },
  {
    id: "bundle_3",
    title: "Sony Exclusive Collection",
    description:
      "Experience the best PlayStation games now available on PC, including God of War and The Last of Us Part I.",
    gameIds: ["3", "11"],
    price: 79.99,
    originalPrice: 109.98,
    discount: 27,
  },
  {
    id: "bundle_4",
    title: "Open World Explorer Bundle",
    description: "Get lost in vast open worlds with this collection of immersive RPGs and adventure games.",
    gameIds: ["2", "4", "12"],
    price: 129.99,
    originalPrice: 179.97,
    discount: 28,
  },
  {
    id: "bundle_5",
    title: "Indie Gems Pack",
    description: "Discover critically acclaimed indie titles that deliver unique and innovative gameplay experiences.",
    gameIds: ["7", "8"],
    price: 29.99,
    originalPrice: 39.98,
    discount: 25,
  },
]

// Initial review data
export const initialReviews: Review[] = [
  {
    id: "review_1",
    gameId: "1",
    userId: "user_1",
    userName: "GamerPro123",
    userImage: "/users/avatar1.jpg",
    text: "Cyberpunk 2077 is an amazing game with stunning visuals and an immersive world. The story is engaging and the characters are well-developed. Despite some bugs at launch, the game has been significantly improved with updates.",
    rating: 4,
    date: "2023-01-15T12:30:00Z",
    likes: 24,
  },
  {
    id: "review_2",
    gameId: "1",
    userId: "user_2",
    userName: "RPGFanatic",
    userImage: "/users/avatar2.jpg",
    text: "The game has a great atmosphere and the city feels alive. The side quests are often more interesting than the main story. Combat is fun but can get repetitive. Overall a solid experience.",
    rating: 3.5,
    date: "2023-02-20T09:15:00Z",
    likes: 12,
  },
  {
    id: "review_3",
    gameId: "2",
    userId: "user_3",
    userName: "SoulsFan",
    userImage: "/users/avatar3.jpg",
    text: "Elden Ring is a masterpiece. The open world design is incredible and the combat is challenging but fair. The lore is deep and mysterious, typical of FromSoftware games. Easily one of the best games I've ever played.",
    rating: 5,
    date: "2023-03-10T15:45:00Z",
    likes: 56,
  },
  {
    id: "review_4",
    gameId: "3",
    userId: "user_4",
    userName: "AdventureSeeker",
    userImage: "/users/avatar4.jpg",
    text: "God of War on PC is a fantastic port. The graphics are stunning and the gameplay is smooth. The story and character development are top-notch. Highly recommended for action-adventure fans.",
    rating: 4.5,
    date: "2023-02-05T18:20:00Z",
    likes: 38,
  },
]

// Helper functions to get unique values
export function getUniqueGenres(): string[] {
  const allGenres = initialGames.flatMap((game) => game.genreIds)
  return [...new Set(allGenres)]
}

export function getUniquePlatforms(): string[] {
  const allPlatforms = initialGames.flatMap((game) => game.platformIds)
  return [...new Set(allPlatforms)]
}

export function getUniquePublishers(): string[] {
  const allPublishers = initialGames.map((game) => game.publisher)
  return [...new Set(allPublishers)]
}

export function getUniqueDevelopers(): string[] {
  const allDevelopers = initialGames.map((game) => game.developer)
  return [...new Set(allDevelopers)]
}
