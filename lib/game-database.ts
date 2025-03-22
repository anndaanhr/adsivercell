import type { Game, Bundle, Publisher, Developer, Genre, Platform } from "./types"
import { initialGames } from "./game-data" // Import initialGames

// Define platforms
export const platforms: Platform[] = [
  { id: "steam", name: "Steam", icon: "steam" },
  { id: "epic", name: "Epic Games Store", icon: "epic-games" },
  { id: "gog", name: "GOG", icon: "gog" },
  { id: "ubisoft", name: "Ubisoft Connect", icon: "ubisoft" },
  { id: "origin", name: "EA App", icon: "ea" },
  { id: "battlenet", name: "Battle.net", icon: "battlenet" },
  { id: "xbox", name: "Xbox", icon: "xbox" },
  { id: "playstation", name: "PlayStation", icon: "playstation" },
  { id: "nintendo", name: "Nintendo", icon: "nintendo" },
  { id: "itch", name: "itch.io", icon: "itch" },
]

// Define genres
export const genres: Genre[] = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "rpg", name: "RPG" },
  { id: "strategy", name: "Strategy" },
  { id: "simulation", name: "Simulation" },
  { id: "sports", name: "Sports" },
  { id: "racing", name: "Racing" },
  { id: "puzzle", name: "Puzzle" },
  { id: "horror", name: "Horror" },
  { id: "shooter", name: "Shooter" },
  { id: "platformer", name: "Platformer" },
  { id: "fighting", name: "Fighting" },
  { id: "stealth", name: "Stealth" },
  { id: "survival", name: "Survival" },
  { id: "battle-royale", name: "Battle Royale" },
  { id: "mmo", name: "MMO" },
  { id: "moba", name: "MOBA" },
  { id: "card", name: "Card Game" },
  { id: "roguelike", name: "Roguelike" },
  { id: "open-world", name: "Open World" },
  { id: "indie", name: "Indie" },
  { id: "casual", name: "Casual" },
  { id: "sandbox", name: "Sandbox" },
  { id: "vr", name: "VR" },
]

// Define publishers
export const publishers: Publisher[] = [
  {
    id: "cd-projekt",
    name: "CD Projekt",
    logo: "/publishers/cd-projekt.png",
    description: "Polish video game developer and publisher known for The Witcher series and Cyberpunk 2077.",
    founded: "1994",
    headquarters: "Warsaw, Poland",
    website: "https://www.cdprojekt.com/",
  },
  {
    id: "ubisoft",
    name: "Ubisoft",
    logo: "/publishers/ubisoft.png",
    description: "French video game company known for franchises like Assassin's Creed, Far Cry, and Tom Clancy's.",
    founded: "1986",
    headquarters: "Montreuil, France",
    website: "https://www.ubisoft.com/",
  },
  {
    id: "ea",
    name: "Electronic Arts",
    logo: "/publishers/ea.png",
    description:
      "American video game company known for sports franchises like FIFA and Madden NFL, as well as Battlefield and The Sims.",
    founded: "1982",
    headquarters: "Redwood City, California, USA",
    website: "https://www.ea.com/",
  },
  {
    id: "activision",
    name: "Activision Blizzard",
    logo: "/publishers/activision-blizzard.png",
    description: "American video game holding company known for Call of Duty, World of Warcraft, and Overwatch.",
    founded: "2008 (merger)",
    headquarters: "Santa Monica, California, USA",
    website: "https://www.activisionblizzard.com/",
  },
  {
    id: "take-two",
    name: "Take-Two Interactive",
    logo: "/publishers/take-two.png",
    description:
      "American video game holding company that owns Rockstar Games and 2K Games, known for Grand Theft Auto and NBA 2K.",
    founded: "1993",
    headquarters: "New York City, USA",
    website: "https://www.take2games.com/",
  },
  {
    id: "sony",
    name: "Sony Interactive Entertainment",
    logo: "/publishers/sony.png",
    description:
      "Video game and digital entertainment company owned by Sony Group Corporation, known for PlayStation consoles and exclusive titles.",
    founded: "1993",
    headquarters: "San Mateo, California, USA",
    website: "https://www.sie.com/",
  },
  {
    id: "microsoft",
    name: "Xbox Game Studios",
    logo: "/publishers/xbox.png",
    description: "American video game publisher and division of Microsoft, known for Halo, Forza, and Minecraft.",
    founded: "2000",
    headquarters: "Redmond, Washington, USA",
    website: "https://www.xbox.com/en-US/xbox-game-studios",
  },
  {
    id: "nintendo",
    name: "Nintendo",
    logo: "/publishers/nintendo.png",
    description: "Japanese multinational video game company known for Mario, Zelda, and Pokémon franchises.",
    founded: "1889",
    headquarters: "Kyoto, Japan",
    website: "https://www.nintendo.com/",
  },
  {
    id: "square-enix",
    name: "Square Enix",
    logo: "/publishers/square-enix.png",
    description: "Japanese video game company known for Final Fantasy, Dragon Quest, and Kingdom Hearts.",
    founded: "2003 (merger)",
    headquarters: "Tokyo, Japan",
    website: "https://www.square-enix.com/",
  },
  {
    id: "capcom",
    name: "Capcom",
    logo: "/publishers/capcom.png",
    description:
      "Japanese video game developer and publisher known for Resident Evil, Monster Hunter, and Street Fighter.",
    founded: "1979",
    headquarters: "Osaka, Japan",
    website: "https://www.capcom.com/",
  },
  {
    id: "sega",
    name: "Sega",
    logo: "/publishers/sega.png",
    description:
      "Japanese multinational video game developer and publisher known for Sonic the Hedgehog, Yakuza, and Total War.",
    founded: "1960",
    headquarters: "Tokyo, Japan",
    website: "https://www.sega.com/",
  },
  {
    id: "bandai-namco",
    name: "Bandai Namco",
    logo: "/publishers/bandai-namco.png",
    description: "Japanese multinational video game publisher known for Tekken, Dark Souls, and Ace Combat.",
    founded: "2006 (merger)",
    headquarters: "Tokyo, Japan",
    website: "https://www.bandainamcoent.com/",
  },
  {
    id: "thq-nordic",
    name: "THQ Nordic",
    logo: "/publishers/thq-nordic.png",
    description:
      "Austrian video game publisher known for acquiring and reviving old IPs like Darksiders and Saints Row.",
    founded: "2011",
    headquarters: "Vienna, Austria",
    website: "https://www.thqnordic.com/",
  },
  {
    id: "devolver",
    name: "Devolver Digital",
    logo: "/publishers/devolver.png",
    description: "American video game publisher known for indie games like Hotline Miami, Fall Guys, and Loop Hero.",
    founded: "2009",
    headquarters: "Austin, Texas, USA",
    website: "https://www.devolverdigital.com/",
  },
  {
    id: "annapurna",
    name: "Annapurna Interactive",
    logo: "/publishers/annapurna.png",
    description:
      "American video game publisher known for artistic and narrative-driven games like What Remains of Edith Finch and Outer Wilds.",
    founded: "2016",
    headquarters: "Los Angeles, California, USA",
    website: "https://annapurnainteractive.com/",
  },
  {
    id: "505",
    name: "505 Games",
    logo: "/publishers/505.png",
    description: "Italian video game publisher known for Control, Death Stranding PC version, and Terraria.",
    founded: "2006",
    headquarters: "Milan, Italy",
    website: "https://505games.com/",
  },
  {
    id: "paradox",
    name: "Paradox Interactive",
    logo: "/publishers/paradox.png",
    description:
      "Swedish video game publisher known for grand strategy games like Crusader Kings, Europa Universalis, and Cities: Skylines.",
    founded: "1999",
    headquarters: "Stockholm, Sweden",
    website: "https://www.paradoxinteractive.com/",
  },
  {
    id: "deep-silver",
    name: "Deep Silver",
    logo: "/publishers/deep-silver.png",
    description: "German video game publisher known for Metro, Saints Row, and Dead Island series.",
    founded: "2002",
    headquarters: "Planegg, Germany",
    website: "https://www.deepsilver.com/",
  },
  {
    id: "focus",
    name: "Focus Entertainment",
    logo: "/publishers/focus.png",
    description: "French video game publisher known for A Plague Tale, SnowRunner, and Vampyr.",
    founded: "1996",
    headquarters: "Paris, France",
    website: "https://www.focus-entmt.com/",
  },
  {
    id: "team17",
    name: "Team17",
    logo: "/publishers/team17.png",
    description: "British video game developer and publisher known for Worms, Overcooked, and The Escapists.",
    founded: "1990",
    headquarters: "Wakefield, United Kingdom",
    website: "https://www.team17.com/",
  },
]

// Define developers
export const developers: Developer[] = [
  { id: "cd-projekt-red", name: "CD Projekt Red", publisherId: "cd-projekt" },
  { id: "ubisoft-montreal", name: "Ubisoft Montreal", publisherId: "ubisoft" },
  { id: "ubisoft-toronto", name: "Ubisoft Toronto", publisherId: "ubisoft" },
  { id: "dice", name: "DICE", publisherId: "ea" },
  { id: "bioware", name: "BioWare", publisherId: "ea" },
  { id: "maxis", name: "Maxis", publisherId: "ea" },
  { id: "infinity-ward", name: "Infinity Ward", publisherId: "activision" },
  { id: "treyarch", name: "Treyarch", publisherId: "activision" },
  { id: "blizzard", name: "Blizzard Entertainment", publisherId: "activision" },
  { id: "rockstar-north", name: "Rockstar North", publisherId: "take-two" },
  { id: "rockstar-san-diego", name: "Rockstar San Diego", publisherId: "take-two" },
  { id: "2k-boston", name: "2K Boston", publisherId: "take-two" },
  { id: "naughty-dog", name: "Naughty Dog", publisherId: "sony" },
  { id: "guerrilla-games", name: "Guerrilla Games", publisherId: "sony" },
  { id: "santa-monica", name: "Santa Monica Studio", publisherId: "sony" },
  { id: "insomniac", name: "Insomniac Games", publisherId: "sony" },
  { id: "343-industries", name: "343 Industries", publisherId: "microsoft" },
  { id: "mojang", name: "Mojang Studios", publisherId: "microsoft" },
  { id: "nintendo-epd", name: "Nintendo EPD", publisherId: "nintendo" },
  { id: "square-enix-1", name: "Square Enix 1st Development Division", publisherId: "square-enix" },
  { id: "capcom-1", name: "Capcom Development Division 1", publisherId: "capcom" },
  { id: "from-software", name: "FromSoftware", publisherId: "bandai-namco" },
  { id: "sega-cs1", name: "Sega CS1", publisherId: "sega" },
  { id: "ryu-ga-gotoku", name: "Ryu Ga Gotoku Studio", publisherId: "sega" },
  { id: "supergiant", name: "Supergiant Games", publisherId: "supergiant" },
  { id: "concerned-ape", name: "ConcernedApe", publisherId: "concerned-ape" },
  { id: "valve", name: "Valve", publisherId: "valve" },
  { id: "bethesda", name: "Bethesda Game Studios", publisherId: "microsoft" },
  { id: "id-software", name: "id Software", publisherId: "microsoft" },
  { id: "obsidian", name: "Obsidian Entertainment", publisherId: "microsoft" },
]

// Define games array using initialGames if it doesn't exist
export const games: Game[] = initialGames

// Define bundles
export const bundles: Bundle[] = [
  {
    id: "bundle_1",
    title: "CD Projekt Red Collection",
    description:
      "Experience the best of CD Projekt Red with this complete collection featuring Cyberpunk 2077 and The Witcher 3: Wild Hunt.",
    gameIds: ["1", "5"],
    price: 69.99,
    originalPrice: 99.98,
    discount: 30,
    image: "/bundles/cd-projekt-bundle.jpg",
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
    image: "/bundles/ubisoft-bundle.jpg",
  },
  // ... more bundles would be here
]

// Helper functions
export function getGamesByGenre(genreId: string): Game[] {
  return games.filter((game) => game.genreIds.includes(genreId))
}

export function getGamesByPlatform(platformId: string): Game[] {
  return games.filter((game) => game.platformIds.includes(platformId))
}

export function getGamesByPublisher(publisherId: string): Game[] {
  return games.filter((game) => game.publisher === publisherId)
}

export function getGamesByDeveloper(developerId: string): Game[] {
  return games.filter((game) => game.developer === developerId)
}

export function getGamesOnSale(): Game[] {
  return games.filter((game) => game.discount > 0)
}

export function getNewReleases(days = 30): Game[] {
  const now = new Date()
  const cutoffDate = new Date(now.setDate(now.getDate() - days))

  return games.filter((game) => {
    const releaseDate = new Date(game.releaseDate)
    return releaseDate >= cutoffDate
  })
}

export function getPreOrderGames(): Game[] {
  return games.filter((game) => game.preOrder)
}

export function getTopRatedGames(limit = 10): Game[] {
  return [...games].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function searchGames(query: string): Game[] {
  const searchTerm = query.toLowerCase()

  return games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchTerm) ||
      game.description.toLowerCase().includes(searchTerm) ||
      game.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )
}

export function getRelatedGames(gameId: string, limit = 6): Game[] {
  const game = games.find((g) => g.id === gameId)

  if (!game) return []

  // Find games with similar genres
  const similarGames = games
    .filter((g) => g.id !== gameId) // Exclude the current game
    .map((g) => {
      // Calculate similarity score based on shared genres
      const sharedGenres = g.genreIds.filter((genre) => game.genreIds.includes(genre))
      const similarityScore = sharedGenres.length

      return { game: g, score: similarityScore }
    })
    .filter((item) => item.score > 0) // Only include games with at least one shared genre
    .sort((a, b) => b.score - a.score) // Sort by similarity score
    .slice(0, limit) // Limit the number of results
    .map((item) => item.game) // Extract just the game objects

  return similarGames
}

export function getPublisherById(publisherId: string): Publisher | undefined {
  return publishers.find((publisher) => publisher.id === publisherId)
}

export function getDeveloperById(developerId: string): Developer | undefined {
  return developers.find((developer) => developer.id === developerId)
}

export function getGenreById(genreId: string): Genre | undefined {
  return genres.find((genre) => genre.id === genreId)
}

export function getPlatformById(platformId: string): Platform | undefined {
  return platforms.find((platform) => platform.id === platformId)
}
