"use server"

import { saveCard, getCard, type CardData } from "@/lib/store"

export async function createCard(
  senderName: string,
  recipientName: string,
  message: string,
  theme?: string,
  recipientImage?: string,
  customMusic?: string
): Promise<string> {
  const id = await saveCard(senderName, recipientName, message, theme, recipientImage, customMusic)
  return id
}

export async function fetchCard(id: string): Promise<CardData | null> {
  return getCard(id)
}

export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  const validPasscode = process.env.ADMIN_PASSCODE || "08032026"
  return passcode === validPasscode
}
