// Function to generate a random game key
export function generateGameKey(platform: string): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const segments = platform === "Steam" ? 3 : 5 // Steam keys have 3 segments, others have 5
  const segmentLength = platform === "Steam" ? 5 : 4 // Steam segments are 5 chars, others are 4

  let key = ""

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segmentLength; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      key += characters[randomIndex]
    }

    if (i < segments - 1) {
      key += "-"
    }
  }

  return key
}

// Function to validate a game key format
export function validateGameKey(key: string, platform: string): boolean {
  if (platform === "Steam") {
    // Steam keys are in the format: XXXXX-XXXXX-XXXXX
    return /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key)
  } else if (platform === "Epic") {
    // Epic keys are in the format: XXXX-XXXX-XXXX-XXXX-XXXX
    return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
  } else if (platform === "GOG") {
    // GOG keys are in the format: XXXX-XXXX-XXXX-XXXX-XXXX
    return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
  }

  return false
}

// Function to check if a key has been redeemed
export function isKeyRedeemed(key: string): boolean {
  // In a real app, this would check against a database
  // For now, we'll just return false (not redeemed)
  return false
}

