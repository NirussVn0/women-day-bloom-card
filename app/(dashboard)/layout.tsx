import { getDocs } from "@/lib/actions"
import Link from "next/link"
import { PlusCircle, Flower2, FileText } from "lucide-react"
import { auth, signIn, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarDocList } from "@/components/dashboard/SidebarDocList"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const docs = await getDocs()

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-stone-50/50 flex flex-col pt-6 pb-4">
        <div className="px-6 mb-8 flex items-center gap-2">
          <Flower2 className="w-6 h-6 text-rose-400" />
          <span className="font-serif font-bold text-xl text-stone-800 tracking-tight">WishLink</span>
        </div>

        <div className="px-4 mb-4">
           {/* Temporary hardcoded action form until we build the interactive component */}
          <form action={async () => {
            "use server"
            const { createDoc } = await import('@/lib/actions')
            await createDoc()
          }}>
            <Button type="submit" variant="outline" className="w-full justify-start text-stone-600 bg-white hover:bg-stone-100 hover:text-stone-900 shadow-sm border-stone-200">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </form>
        </div>

        <SidebarDocList docs={docs} />

        {/* User Profile Footer */}
        <div className="px-4 mt-auto pt-4 border-t border-stone-200">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full gap-2 p-2 rounded-md hover:bg-stone-100 transition-colors text-left">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-stone-700 truncate">{session.user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-red-600 focus:text-red-600" asChild>
                  <form action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }} className="w-full">
                    <button type="submit" className="w-full text-left">Log out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <form action={async () => {
              "use server"
              await signIn("github")
            }}>
               <Button type="submit" variant="ghost" className="w-full justify-start text-stone-600">
                  Sign in
               </Button>
            </form>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white shadow-[-4px_0_24px_-16px_rgba(0,0,0,0.1)] z-10">
        {children}
      </main>
    </div>
  )
}
