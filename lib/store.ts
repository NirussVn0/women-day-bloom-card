import { nanoid } from "nanoid"

export interface CardData {
  id: string
  recipientName: string
  message: string
  theme: string
  createdAt: string
}

// In-memory store — works for dev & demo.
// Swap this for Vercel KV / Supabase in production.
const cards = new Map<string, CardData>()

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
