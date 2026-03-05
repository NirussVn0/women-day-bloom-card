import { Flower2 } from "lucide-react"

export default function LoadingEditor() {
  return (
    <div className="flex flex-col h-full relative border-t border-stone-200">
      <header className="h-14 border-b border-stone-200 bg-white flex items-center px-8">
         <div className="w-48 h-5 bg-stone-100 rounded-md animate-pulse" />
      </header>
      <div className="flex-1 overflow-hidden bg-stone-50/30 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <Flower2 className="w-8 h-8 text-rose-200 mb-4 duration-1000" />
           <div className="h-4 w-48 bg-stone-200 rounded-full mb-2" />
           <div className="h-3 w-32 bg-stone-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
