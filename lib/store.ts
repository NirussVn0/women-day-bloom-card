import { nanoid } from "nanoid"

export interface CardData {
  id: string
  recipientName: string
  message: string
  theme: string
  recipientImage?: string
  createdAt: string
}

// Persist across HMR in development via globalThis
const globalForCards = globalThis as unknown as {
  __cards?: Map<string, CardData>
}

if (!globalForCards.__cards) {
  globalForCards.__cards = new Map<string, CardData>()
}

const cards = globalForCards.__cards

export function saveCard(data: Omit<CardData, "id" | "createdAt">): CardData {
  const card: CardData = {
    ...data,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
  }
  cards.set(card.id, card)
  return card
}

export function getCard(id: string): CardData | null {
  return cards.get(id) ?? null
}
