"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Privacy, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"

export async function createDoc(title: string = "Untitled Card") {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const doc = await prisma.doc.create({
    data: {
      title,
      ownerId: session.user.id,
      privacy: Privacy.PRIVATE
    }
  })

  revalidatePath('/dashboard')
  redirect(`/d/${doc.id}`)
}

export async function getDocs() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  return prisma.doc.findMany({
    where: {
      ownerId: session.user.id
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
}

export async function updateDocTitle(id: string, title: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const doc = await prisma.doc.findUnique({ where: { id } })
  if (!doc) throw new Error("Not found")

  // For MVP: Only owner can rename via Server Action
  if (doc.ownerId !== session.user.id) {
     throw new Error("Unauthorized")
  }

  const updated = await prisma.doc.update({
    where: { id },
    data: { title }
  })

  revalidatePath(`/d/${id}`)
  revalidatePath('/dashboard')
  return updated
}

export async function deleteDoc(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const doc = await prisma.doc.findUnique({ where: { id } })
  
  if (doc?.ownerId === session.user.id) {
    await prisma.doc.delete({ where: { id } })
    revalidatePath('/dashboard')
  }
}

export async function createShareLink(docId: string, role: Role = "VIEWER") {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const doc = await prisma.doc.findUnique({ where: { id: docId } })
  if (!doc || doc.ownerId !== session.user.id) throw new Error("Unauthorized")

  const link = await prisma.shareLink.create({
    data: {
      token: nanoid(10),
      docId,
      role
    }
  })

  if (doc.privacy === "PRIVATE") {
    await prisma.doc.update({
      where: { id: docId },
      data: { privacy: "LINK_ONLY" }
    })
  }

  revalidatePath(`/d/${docId}`)
  return link
}

export async function getShareLinks(docId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  const doc = await prisma.doc.findUnique({ where: { id: docId } })
  if (!doc || doc.ownerId !== session.user.id) return []

  return prisma.shareLink.findMany({
    where: { docId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function deleteShareLink(id: string, docId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const doc = await prisma.doc.findUnique({ where: { id: docId } })
  if (!doc || doc.ownerId !== session.user.id) throw new Error("Unauthorized")

  await prisma.shareLink.delete({ where: { id } })
  revalidatePath(`/d/${docId}`)
}

export async function getDocByToken(token: string) {
  const link = await prisma.shareLink.findUnique({
    where: { token },
    include: { doc: true }
  })
  
  if (!link) return null
  return { doc: link.doc, role: link.role }
}
