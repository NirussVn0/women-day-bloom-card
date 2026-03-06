"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo } from "react"
import confetti from "canvas-confetti"

interface MessageRevealProps {
  recipientName: string
  message: string
}

function PetalParticle({ index }: { index: number }) {
  const style = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${6 + Math.random() * 8}s`,
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${14 + Math.random() * 14}px`,
    opacity: 0.6 + Math.random() * 0.4,
  }), [])

  const petals = ["🌸", "🩷", "✿", "❀", "🌺", "💮"]

  return (
    <span
      className="petal"
      style={style}
    >
      {petals[index % petals.length]}
    </span>
  )
}

export function MessageReveal({ recipientName, message }: MessageRevealProps) {
  useEffect(() => {
    // Fire confetti bursts
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#fb7185", "#fda4af", "#fecdd3", "#fcd19e", "#fef3e2"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#fb7185", "#fda4af", "#fecdd3", "#fcd19e", "#fef3e2"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#fb7185", "#fda4af", "#fecdd3", "#fcd19e", "#fef3e2"],
    })

    requestAnimationFrame(frame)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Floating Petals */}
      {Array.from({ length: 20 }).map((_, i) => (
        <PetalParticle key={i} index={i} />
      ))}

      {/* Ambient Glows */}
      <div className="glow-orb w-80 h-80 bg-rose-200 top-[10%] left-[5%]" />
      <div className="glow-orb w-64 h-64 bg-peach-200 bottom-[10%] right-[5%]" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-rose-400 font-medium mb-3 text-sm tracking-widest uppercase"
        >
          Happy Women&apos;s Day
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight"
        >
          Gửi{" "}
          <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
            {recipientName}
          </span>{" "}
          💐
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="bg-white/70 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-lg border border-rose-100 relative"
        >
          {/* Decorative corners */}
          <span className="absolute top-3 left-4 text-rose-300 text-2xl select-none">❝</span>
          <span className="absolute bottom-3 right-4 text-rose-300 text-2xl select-none">❞</span>

          <p className="text-xl sm:text-2xl text-stone-700 leading-relaxed font-serif whitespace-pre-wrap">
            {message}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8 text-sm text-stone-400 font-serif"
        >
          Made with <span className="text-rose-400">♥</span> on WishLink 8/3
        </motion.p>
      </motion.div>
    </div>
  )
}
