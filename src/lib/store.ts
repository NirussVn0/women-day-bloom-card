"use server"

import { kv } from "@vercel/kv"


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


const EXPIRY_DAYS = 10
const EXPIRY_SECONDS = EXPIRY_DAYS * 24 * 60 * 60
const CARD_PREFIX = "card:"


const globalForCards = globalThis as unknown as { __cards?: Map<string, CardData>, __cardCount?: number }
if (!globalForCards.__cards) globalForCards.__cards = new Map<string, CardData>()
if (globalForCards.__cardCount === undefined) globalForCards.__cardCount = 0
const memoryStore = globalForCards.__cards

function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}


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


export async function saveCard(
  senderName: string,
  recipientName: string,
  message: string,
  theme?: string,
  recipientImage?: string,
  hasCustomMusic?: boolean
): Promise<string> {
  const id = generateSlugId(senderName)
  const now = Date.now()
  const expiresAt = now + EXPIRY_SECONDS * 1000

  const card: CardData = {
    id, senderName, recipientName, message,
    theme, recipientImage, customMusic: hasCustomMusic ? "chunked" : undefined,
    createdAt: now, expiresAt,
  }

  if (isKvAvailable()) {
    await kv.set(`${CARD_PREFIX}${id}`, JSON.stringify(card), { ex: EXPIRY_SECONDS })
    await kv.incr("total_cards_created")
  } else {
    globalForCards.__cardCount = (globalForCards.__cardCount || 0) + 1
    memoryStore.set(id, card)
    for (const [key, c] of memoryStore.entries()) {
      if (c.expiresAt < now) memoryStore.delete(key)
    }
  }

  return id
}

const memoryMusicChunks = new Map<string, Map<number, string>>();
const memoryMusicCounts = new Map<string, number>();

export async function saveMusicChunk(id: string, chunkIndex: number, chunkData: string) {
  if (isKvAvailable()) {
    await kv.set(`card_music_${id}_${chunkIndex}`, chunkData, { ex: EXPIRY_SECONDS })
  } else {
    if (!memoryMusicChunks.has(id)) memoryMusicChunks.set(id, new Map());
    memoryMusicChunks.get(id)!.set(chunkIndex, chunkData);
  }
}

export async function finalizeMusicUpload(id: string, totalChunks: number) {
  if (isKvAvailable()) {
    await kv.set(`card_music_${id}_count`, totalChunks, { ex: EXPIRY_SECONDS })
  } else {
    memoryMusicCounts.set(id, totalChunks);
  }
}

export async function getCard(id: string): Promise<CardData | null> {
  let card: CardData | null = null;
  if (isKvAvailable()) {
    const raw = await kv.get<string>(`${CARD_PREFIX}${id}`)
    if (!raw) return null
    card = typeof raw === "string" ? JSON.parse(raw) : raw
  } else {
    card = memoryStore.get(id) || null
    if (card && card.expiresAt < Date.now()) {
      memoryStore.delete(id)
      return null
    }
  }

  if (card && card.customMusic === "chunked") {
    let count = 0;
    if (isKvAvailable()) {
      count = (await kv.get<number>(`card_music_${id}_count`)) || 0;
    } else {
      count = memoryMusicCounts.get(id) || 0;
    }

    if (count > 0) {
      if (isKvAvailable()) {
        const keys = Array.from({length: count}).map((_, i) => `card_music_${id}_${i}`)
        const chunks = await kv.mget<string[]>(...keys)
        card.customMusic = chunks.join("")
      } else {
        const chunksMap = memoryMusicChunks.get(id);
        const chunks = [];
        for (let i = 0; i < count; i++) {
          chunks.push(chunksMap?.get(i) || "");
        }
        card.customMusic = chunks.join("");
      }
    }
  }

  return card;
}


export async function getCardCount(): Promise<number> {
  if (isKvAvailable()) {
    return (await kv.get<number>("total_cards_created")) || 0
  } else {
    return globalForCards.__cardCount || 0
  }
}


export async function getAllCards(): Promise<CardData[]> {
  if (isKvAvailable()) {
    try {
      const keys = await kv.keys(`${CARD_PREFIX}*`)
      if (!keys || keys.length === 0) return []
      
      const cards: CardData[] = []
      for (const key of keys) {
        const raw = await kv.get<string>(key)
        if (raw) {
          cards.push(typeof raw === "string" ? JSON.parse(raw) : raw)
        }
      }
      return cards.sort((a, b) => b.createdAt - a.createdAt)
    } catch (e) {
      console.error("Error fetching all cards from KV:", e)
      return []
    }
  } else {
    const now = Date.now()
    const cards: CardData[] = []
    for (const [key, c] of memoryStore.entries()) {
      if (c.expiresAt > now) {
        cards.push(c)
      } else {
        memoryStore.delete(key)
      }
    }
    return cards.sort((a, b) => b.createdAt - a.createdAt)
  }
}

