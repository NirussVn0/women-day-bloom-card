import { Flower2 } from "lucide-react"

export default function LoadingSharedCard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-50">
        <div className="animate-pulse flex flex-col items-center">
           <Flower2 className="w-12 h-12 text-rose-300 mb-6 duration-1000" />
           <div className="h-6 w-64 bg-stone-200 rounded-full mb-4" />
           <div className="h-4 w-48 bg-stone-100 rounded-full" />
        </div>
    </div>
  )
}
