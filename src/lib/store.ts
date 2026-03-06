import { nanoid } from "nanoid"

export interface CardData {
  id: string
  senderName: string
  recipientName: string
  message: string
  theme?: string
  recipientImage?: string
  customMusic?: string
  createdAt: number
  expiresAt: number
}

// Persist across HMR in development via globalThis
const globalForCards = globalThis as unknown as {
  __cards?: Map<string, CardData>
}

if (!globalForCards.__cards) {
  globalForCards.__cards = new Map<string, CardData>()
}

const cards = globalForCards.__cards

const EXPIRY_DAYS = 10
const MS_PER_DAY = 24 * 60 * 60 * 1000

function generateSlugId(senderName: string): string {
  const slug = senderName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .substring(0, 20) // max length for name part
  
  const randomPart = Math.random().toString(36).substring(2, 7) // 5 random chars
  return slug ? `${slug}-${randomPart}` : randomPart
}

// Helper to get the card store (using the global 'cards' map for now)
function getStore(): Map<string, CardData> {
  return cards;
}

export async function saveCard(
  senderName: string,
  recipientName: string,
  message: string,
  theme?: string,
  recipientImage?: string,
  customMusic?: string
): Promise<string> {
  const store = getStore()
  const now = Date.now()
  
  // Clean up expired cards periodically
  for (const [key, card] of store.entries()) {
    if (card.expiresAt < now) {
      store.delete(key)
    }
  }

  const id = generateSlugId(senderName)
  const expiresAt = now + (EXPIRY_DAYS * MS_PER_DAY)

  store.set(id, { 
    id, 
    senderName, 
    recipientName, 
    message, 
    theme, 
    recipientImage,
    customMusic,
    createdAt: now,
    expiresAt
  })
  return id
}

export async function getCard(id: string): Promise<CardData | null> {
  const store = getStore()
  const card = store.get(id) || null
  
  // Check expiry on read as well
  if (card && card.expiresAt < Date.now()) {
    store.delete(id)
    return null
  }
  
  return card
}
