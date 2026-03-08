"use server"

import {
  saveCard,
  getCard,
  saveMusicChunk as saveChunkStore,
  finalizeMusicUpload as finalizeMusicStore,
  type CardData,
} from "@/lib/store"

export async function createCard(
  senderName: string,
  recipientName: string,
  message: string,
  theme?: string,
  recipientImage?: string,
  hasCustomMusic?: boolean
): Promise<string> {
  const id = await saveCard(
    senderName,
    recipientName,
    message,
    theme,
    recipientImage,
    hasCustomMusic
  )
  return id
}

export async function uploadMusicChunk(id: string, chunkIndex: number, chunkData: string) {
  await saveChunkStore(id, chunkIndex, chunkData)
}

export async function finalizeMusicUpload(id: string, totalChunks: number) {
  await finalizeMusicStore(id, totalChunks)
}

export async function fetchCard(id: string): Promise<CardData | null> {
  return getCard(id)
}

export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  const validPasscode = process.env.ADMIN_PASSCODE || "08032026"
  return passcode === validPasscode
}
