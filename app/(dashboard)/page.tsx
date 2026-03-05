import { getDocs } from "@/lib/actions"
import Link from "next/link"
import { FileText, Clock, PlusCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const docs = await getDocs()

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome Back</h1>
            <p className="text-stone-500 font-sans cursor-default">Here are your recent beautiful cards.</p>
          </div>
          
          <form action={async () => {
            "use server"
            const { createDoc } = await import('@/lib/actions')
            await createDoc()
          }}>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Card
            </Button>
          </form>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-24 bg-stone-50/50 rounded-2xl border border-stone-100 border-dashed">
             <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-rose-300" />
             </div>
             <h3 className="text-xl font-serif text-stone-800 mb-2">No cards yet</h3>
             <p className="text-stone-500 mb-6 max-w-sm mx-auto">Create your first greeting card to share with friends and family for International Women's Day.</p>
             <form action={async () => {
                "use server"
                const { createDoc } = await import('@/lib/actions')
                await createDoc()
              }}>
                <Button type="submit" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Card
                </Button>
              </form>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc: any) => (
              <Link 
                key={doc.id} 
                href={`/d/${doc.id}`}
                className="group block p-6 bg-white border border-stone-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 to-peach-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-lg font-serif font-semibold text-stone-800 mb-2 truncate group-hover:text-rose-600 transition-colors">
                  {doc.title || "Untitled Card"}
                </h3>
                
                <div className="flex items-center text-xs text-stone-400 gap-1.5 mt-auto pt-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edited {formatDistanceToNow(doc.updatedAt, { addSuffix: true })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
