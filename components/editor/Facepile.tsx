"use client"

import { useOthers, useSelf } from "@/lib/liveblocks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Facepile() {
  const users = useOthers()
  const currentUser = useSelf()

  const MAX_USERS = 4
  const hasMoreUsers = users.length > MAX_USERS

  return (
    <div className="flex items-center -space-x-2 mr-4">
      {users.slice(0, MAX_USERS).map(({ connectionId, info }) => {
        return (
          <Avatar 
            key={connectionId} 
            className="border-2 border-white w-8 h-8 relative"
            style={{ borderColor: info.color }}
          >
            <AvatarImage src={info.avatar} alt={info.name} />
            <AvatarFallback>{info.name[0]}</AvatarFallback>
          </Avatar>
        )
      })}

      {hasMoreUsers && (
        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-600">
          +{users.length - MAX_USERS}
        </div>
      )}

      {currentUser && (
        <div className="relative ml-2">
          <Avatar className="w-8 h-8 border-2" style={{ borderColor: currentUser.info.color }}>
            <AvatarImage src={currentUser.info.avatar} alt="You" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}
