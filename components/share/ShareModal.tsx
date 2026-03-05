"use client"

import { useState, useTransition, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Link2, Trash2, Globe, Lock } from "lucide-react"

// Assume we import the server actions
import { createShareLink, getShareLinks, deleteShareLink } from "@/lib/actions"
import { ShareLink } from "@prisma/client"

export function ShareModal({ docId, isOwner }: { docId: string, isOwner: boolean }) {
  const [links, setLinks] = useState<ShareLink[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && isOwner) {
      startTransition(async () => {
        const data = await getShareLinks(docId)
        setLinks(data as any[])
      })
    }
  }, [isOpen, docId, isOwner])

  const handleCreateLink = (role: 'VIEWER' | 'EDITOR') => {
    startTransition(async () => {
      const newLink = await createShareLink(docId, role as any)
      setLinks([newLink as any, ...links])
    })
  }

  const handleDeleteLink = (id: string) => {
    startTransition(async () => {
      await deleteShareLink(id, docId)
      setLinks(links.filter(l => l.id !== id))
    })
  }

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/s/${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!isOwner) {
    return (
      <Button variant="outline" size="sm" className="bg-white rounded-full h-8 text-xs font-semibold cursor-not-allowed opacity-50">
        View Only
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="bg-stone-800 hover:bg-stone-900 text-white rounded-full px-4 h-8 text-xs font-semibold shadow-sm transition-all focus:ring-0">
           <Link2 className="w-3 h-3 mr-1.5" />
           Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            Share Card
          </DialogTitle>
          <DialogDescription className="text-stone-500">
            Anyone with the link can access this card.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h4 className="text-sm font-medium text-stone-900 flex items-center gap-1.5"><Globe className="w-4 h-4 text-stone-400" /> Web Links</h4>
              <p className="text-xs text-stone-500 mt-1 placeholder:">Create unique secure links to share.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCreateLink("VIEWER")} disabled={isPending}>
                Create View Link
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 mt-2 min-h-[120px]">
            {isPending && links.length === 0 ? (
               <div className="flex items-center justify-center p-4 text-sm text-stone-400">Loading links...</div>
            ) : links.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-4 text-sm text-stone-400 bg-stone-50 rounded border border-dashed border-stone-200">
                 <Lock className="w-6 h-6 mb-2 text-stone-300" />
                 This card is private.
               </div>
            ) : (
              links.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-stone-200 bg-stone-50/50 relative group">
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-xs font-medium text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded-full w-min mb-1">
                      {link.role === 'EDITOR' ? 'Editor' : 'Viewer'}
                    </span>
                    <Input 
                      readOnly 
                      value={`${window.location.origin}/s/${link.token}`} 
                      className="h-7 text-xs bg-transparent border-none px-0 shadow-none focus-visible:ring-0 text-stone-500 truncate"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(link.token)}
                      className="h-8 w-8 hover:bg-white hover:text-stone-900 border border-transparent hover:border-stone-200"
                    >
                      {copied === link.token ? <span className="text-xs font-medium text-emerald-600">Copied</span> : <Copy className="w-4 h-4" /> }
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDeleteLink(link.id)}
                      className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 focus:text-rose-600 border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
