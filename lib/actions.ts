"use server"

import { saveCard, getCard, type CardData } from "@/lib/store"

export async function createCard(formData: {
  recipientName: string
  message: string
  theme: string
  recipientImage?: string
}): Promise<{ id: string }> {
  const card = saveCard(formData)
  return { id: card.id }
}

export async function fetchCard(id: string): Promise<CardData | null> {
  return getCard(id)
}
