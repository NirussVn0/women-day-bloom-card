"use client"

import { Facepile } from "@/components/editor/Facepile"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { ShareModal } from "@/components/share/ShareModal"

export function EditorHeader({ docId, initialTitle, isOwner }: { docId: string, initialTitle: string, isOwner: boolean }) {
  const [title, setTitle] = useState(initialTitle)
  const [isPending, startTransition] = useTransition()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleBlur = () => {
    if (title !== initialTitle && isOwner) {
      startTransition(async () => {
         const { updateDocTitle } = await import('@/lib/actions')
         await updateDocTitle(docId, title)
      })
    }
  }

  return (
    <header className="h-14 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Link href="/dashboard" className="text-stone-400 hover:text-stone-600 transition-colors">
           <ChevronLeft className="w-5 h-5" />
        </Link>
        <Input 
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          readOnly={!isOwner}
          className="max-w-[300px] border-none shadow-none text-lg font-serif font-bold px-0 h-auto focus-visible:ring-0 placeholder:text-stone-300 bg-transparent"
          placeholder="Card Title..."
        />
        {isPending && <span className="text-xs text-stone-400 ml-2 animate-pulse">Saving...</span>}
      </div>

      <div className="flex items-center gap-2">
        <Facepile />
        <ShareModal docId={docId} isOwner={isOwner} />
      </div>
    </header>
  )
}
