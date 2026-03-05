import { CollaborativeEditor } from "@/components/editor/CollaborativeEditor"
import { RoomProvider } from "@/lib/liveblocks"
import { EditorHeader } from "@/components/editor/EditorHeader"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  const doc = await prisma.doc.findUnique({ where: { id: params.id } })
  if (!doc) notFound()

  // For MVP: anyone who reaches this page can edit the doc via Realtime 
  // (access is granted if they have the link or we authorize in Liveblocks). 
  // But only owner can change title/share settings.
  const isOwner = session?.user?.id === doc.ownerId

  return (
    <RoomProvider id={params.id} initialPresence={{ cursor: null }}>
      <div className="flex flex-col h-full relative">
        <EditorHeader docId={params.id} initialTitle={doc.title} isOwner={isOwner} />
        
        {/* Editor constraints and paper background */}
        <div className="flex-1 overflow-y-auto bg-stone-50/30">
           <div className="my-12 mx-auto max-w-4xl bg-white shadow-sm ring-1 ring-stone-900/5 sm:rounded-2xl relative min-h-[800px]">
             {/* Decorative tape / pin */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-rose-200/40 rounded shadow-sm rotate-[-2deg] opacity-70" />
             
             <CollaborativeEditor />
           </div>
        </div>
      </div>
    </RoomProvider>
  )
}
