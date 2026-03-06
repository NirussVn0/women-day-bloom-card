"use client"

import { useRef, useCallback, useState } from "react"
import { animate, spring } from "animejs"

export function DodgeButton() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [dodgeCount, setDodgeCount] = useState(0)
  const msgRef = useRef<HTMLParagraphElement>(null)

  const messages = [
    "Đừng mà!",
    "Bấm Có đi!",
    "Eiii đừng nè~",
    "Chịu chưa??",
    "Hông được đâu!",
    "Bấm CÓ nhaaa~",
  ]

  const dodge = useCallback(() => {
    if (!btnRef.current) return

    const maxX = typeof window !== "undefined" ? window.innerWidth - 120 : 300
    const maxY = typeof window !== "undefined" ? window.innerHeight - 60 : 300

    const newX = Math.random() * maxX - maxX / 2
    const newY = Math.random() * maxY - maxY / 2

    animate(btnRef.current, {
      translateX: newX,
      translateY: newY,
      duration: 400,
      ease: spring({ stiffness: 300, damping: 20 }),
    })

    setDodgeCount((c) => c + 1)

    // Animate the message text
    if (msgRef.current) {
      animate(msgRef.current, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 300,
        ease: "out(3)",
      })
    }
  }, [])

  return (
    <div className="relative w-full h-24 flex items-center justify-center">
      <button
        ref={btnRef}
        onMouseEnter={dodge}
        onTouchStart={(e) => {
          e.preventDefault()
          dodge()
        }}
        className="absolute px-8 py-3 bg-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-300 transition-colors text-lg select-none touch-none cursor-pointer"
      >
        Không
      </button>

      {dodgeCount > 0 && (
        <p
          ref={msgRef}
          className="absolute -bottom-8 text-sm text-rose-400 font-medium"
        >
          {messages[Math.min(dodgeCount - 1, messages.length - 1)]}
        </p>
      )}
    </div>
  )
}
