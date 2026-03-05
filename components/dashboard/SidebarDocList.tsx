"use client"
import Link from "next/link"
import { FileText, Search } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function SidebarDocList({ docs }: { docs: any[] }) {
  const [query, setQuery] = useState("")
  
  const filtered = docs.filter(d => d.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <Input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cards..." 
            className="w-full pl-8 bg-white shadow-sm border-stone-200 focus-visible:ring-1 focus-visible:ring-rose-300 rounded-md h-8 text-xs placeholder:text-stone-400 transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {filtered.length === 0 ? (
          <p className="text-xs text-stone-400 px-3 italic mt-4 text-center">
             {query ? "No cards found." : "No cards yet."}
          </p>
        ) : (
           filtered.map((doc: any) => (
            <Link 
              key={doc.id} 
              href={`/d/${doc.id}`}
              className="flex items-center gap-2.5 px-3 py-1.5 text-sm font-medium text-stone-600 rounded-md hover:bg-white hover:text-stone-900 transition-colors group"
            >
              <FileText className="w-4 h-4 text-stone-400 group-hover:text-rose-400 transition-colors shrink-0" />
              <span className="truncate">{doc.title}</span>
            </Link>
          ))
        )}
      </nav>
    </div>
  )
}
