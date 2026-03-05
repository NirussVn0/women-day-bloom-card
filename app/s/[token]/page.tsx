import { getDocByToken } from "@/lib/actions"
import { notFound } from "next/navigation"
import { RoomProvider } from "@/lib/liveblocks"
import { CollaborativeEditor } from "@/components/editor/CollaborativeEditor"
import { Flower2 } from "lucide-react"

export default async function SharedCardPage({ params }: { params: { token: string } }) {
  const data = await getDocByToken(params.token)
  
  if (!data) {
    notFound()
  }

  const { doc, role } = data
  const isReadOnly = role === "VIEWER"

  return (
    <RoomProvider id={doc.id} initialPresence={{ cursor: null }}>
      <main className="min-h-screen bg-stone-50 flex flex-col pt-10 px-4 pb-20 sm:p-10 relative overflow-hidden">
        
        {/* Soft decorative background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-peach-100/40 blur-3xl lg:bg-orange-100/30 pointer-events-none" />

        <div className="mx-auto max-w-4xl w-full">
          <header className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
              <Flower2 className="w-6 h-6 text-rose-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-800 tracking-tight">{doc.title}</h1>
            <p className="text-stone-500 mt-2 font-serif italic text-sm">A beautiful message for you.</p>
          </header>

          <div className="bg-white shadow-sm ring-1 ring-stone-900/5 sm:rounded-2xl relative min-h-[60vh] max-h-[80vh] overflow-y-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            {/* Decorative tape / pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-rose-200/40 rounded shadow-sm rotate-[-2deg] opacity-70 z-10" />
            
            <CollaborativeEditor readOnly={isReadOnly} />
          </div>
        </div>

        {/* Footer branding */}
        <div className="mt-auto pt-10 text-center relative z-10">
           <p className="text-xs text-stone-400 font-serif">Made with <span className="text-rose-400">♥</span> on WishLink</p>
        </div>
      </main>
    </RoomProvider>
  )
}
