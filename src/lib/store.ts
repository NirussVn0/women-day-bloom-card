"use server"

import { kv } from "@vercel/kv"

/* ══════════════════════════════════════════════════════════════
   CardData — Schema for a greeting card
   ══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════════════════════ */
const EXPIRY_DAYS = 10
const EXPIRY_SECONDS = EXPIRY_DAYS * 24 * 60 * 60
const CARD_PREFIX = "card:"

/* ══════════════════════════════════════════════════════════════
   In-Memory Fallback — Used when KV env vars are not set (local dev)
   ══════════════════════════════════════════════════════════════ */
const globalForCards = globalThis as unknown as { __cards?: Map<string, CardData> }
if (!globalForCards.__cards) globalForCards.__cards = new Map<string, CardData>()
const memoryStore = globalForCards.__cards

function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

/* ══════════════════════════════════════════════════════════════
   ID Generation — slug from sender name + random suffix
   ══════════════════════════════════════════════════════════════ */
function generateSlugId(senderName: string): string {
  const slug = senderName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 20)

  const randomPart = Math.random().toString(36).substring(2, 7)
  return slug ? `${slug}-${randomPart}` : randomPart
}

/* ══════════════════════════════════════════════════════════════
   saveCard — Persist card to KV (production) or memory (dev)
   Redis key: "card:{id}", TTL: 10 days auto-expire
   ══════════════════════════════════════════════════════════════ */
export async function saveCard(
  senderName: string,
  recipientName: string,
  message: string,
  theme?: string,
  recipientImage?: string,
  customMusic?: string
): Promise<string> {
  const id = generateSlugId(senderName)
  const now = Date.now()
  const expiresAt = now + EXPIRY_SECONDS * 1000

  const card: CardData = {
    id, senderName, recipientName, message,
    theme, recipientImage, customMusic,
    createdAt: now, expiresAt,
  }

  if (isKvAvailable()) {
    // Production: Store in Vercel KV with auto-expire TTL
    await kv.set(`${CARD_PREFIX}${id}`, JSON.stringify(card), { ex: EXPIRY_SECONDS })
  } else {
    // Dev fallback: in-memory Map
    memoryStore.set(id, card)
    // Clean up expired
    for (const [key, c] of memoryStore.entries()) {
      if (c.expiresAt < now) memoryStore.delete(key)
    }
  }

  return id
}

/* ══════════════════════════════════════════════════════════════
   getCard — Read card from KV or memory
   ══════════════════════════════════════════════════════════════ */
export async function getCard(id: string): Promise<CardData | null> {
  if (isKvAvailable()) {
    // Production: read from KV (expired keys auto-deleted by Redis TTL)
    const raw = await kv.get<string>(`${CARD_PREFIX}${id}`)
    if (!raw) return null
    // kv.get may return already-parsed object or string
    const card: CardData = typeof raw === "string" ? JSON.parse(raw) : raw
    return card
  } else {
    // Dev fallback
    const card = memoryStore.get(id) || null
    if (card && card.expiresAt < Date.now()) {
      memoryStore.delete(id)
      return null
    }
    return card
  }
}
