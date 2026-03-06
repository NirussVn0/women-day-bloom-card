"use client"

import { motion } from "framer-motion"
import { useState, useCallback, useRef } from "react"

export function DodgeButton({ onGiveUp }: { onGiveUp?: () => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dodgeCount, setDodgeCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const dodge = useCallback(() => {
    const maxX = typeof window !== "undefined" ? window.innerWidth - 120 : 300
    const maxY = typeof window !== "undefined" ? window.innerHeight - 60 : 300

    const newX = Math.random() * maxX - maxX / 2
    const newY = Math.random() * maxY - maxY / 2

    setPosition({ x: newX, y: newY })
    setDodgeCount((c) => c + 1)
  }, [])

  const messages = [
    "Đừng mà! 😅",
    "Bấm Có đi! 🥺",
    "Eiii đừng nè~ 😤",
    "Chịu chưa?? 🤭",
    "Hông được đâu! 😂",
    "Bấm CÓ nhaaa~ 💕",
  ]

  return (
    <div ref={containerRef} className="relative w-full h-24 flex items-center justify-center">
      <motion.button
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        onMouseEnter={dodge}
        onTouchStart={(e) => {
          e.preventDefault()
          dodge()
        }}
        className="absolute px-8 py-3 bg-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-300 transition-colors text-lg select-none touch-none"
      >
        Không 🙅‍♀️
      </motion.button>

      {dodgeCount > 0 && (
        <motion.p
          key={dodgeCount}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-8 text-sm text-rose-400 font-medium"
        >
          {messages[Math.min(dodgeCount - 1, messages.length - 1)]}
        </motion.p>
      )}
    </div>
  )
}
