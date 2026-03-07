"use client"

import { useEffect, useRef } from "react"
import { animate, createTimeline } from "animejs"
import confetti from "canvas-confetti"
import Image from "next/image"
import { PetalRain } from "@/components/effects/PetalRain"
import { PiHeartFill } from "react-icons/pi"

interface MessageRevealProps {
  recipientName: string
  message: string
  senderName: string
  recipientImage?: string
}

export function MessageReveal({ recipientName, message, senderName, recipientImage }: MessageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#fb7185", "#fda4af", "#fecdd3", "#fcd19e", "#fef3e2"],
    })

    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#fb7185", "#fda4af", "#fecdd3"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#fb7185", "#fda4af", "#fecdd3"],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // Anime.js reveal timeline
    if (!rootRef.current) return

    const tl = createTimeline()

    tl.add(".reveal-subtitle", {
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 600,
      ease: "out(4)",
    }, 500)

    tl.add(".polaroid-photo", {
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.9, 1],
      rotate: [-5, 3],
      duration: 800,
      ease: "out(3)",
    }, 700)

    tl.add(".reveal-heading", {
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 800,
      ease: "out(4)",
    }, 800)

    tl.add(".reveal-card", {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.96, 1],
      duration: 800,
      ease: "out(4)",
    }, 1200)

    tl.add(".reveal-footer", {
      opacity: [0, 1],
      duration: 600,
      ease: "out(3)",
    }, 2000)

  }, [])

  return (
    <div ref={rootRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <PetalRain />

      {/* Ambient Glows */}
      <div className="glow-orb w-80 h-80 bg-rose-200 top-[10%] left-[5%]" />
      <div className="glow-orb w-64 h-64 bg-orange-100 bottom-[10%] right-[5%]" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
        <p className="reveal-subtitle text-rose-400 font-medium mb-3 text-sm tracking-widest uppercase" style={{ opacity: 0 }}>
          Happy Women&apos;s Day
        </p>

        {recipientImage && (
          <div 
            className="polaroid-photo mx-auto mb-6 bg-white p-2.5 pb-8 sm:p-3 sm:pb-10 shadow-lg rounded-sm w-32 h-40 sm:w-40 sm:h-48 flex-shrink-0 relative transform rotate-3"
            style={{ opacity: 0 }}
          >
            <div className="relative w-full h-full bg-stone-100 overflow-hidden">
              <Image
                src={recipientImage}
                alt="Người nhận"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Vệt dán băng keo (tuỳ chọn) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-stone-200/60 rotate-2 backdrop-blur-sm shadow-sm" />
          </div>
        )}

        <h1 className="reveal-heading text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight" style={{ opacity: 0 }}>
          Gửi{" "}
          <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
            {recipientName}
          </span>
        </h1>

        <div className="reveal-card bg-white/70 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-lg border border-rose-100 relative" style={{ opacity: 0 }}>
          <span className="absolute top-3 left-4 text-rose-300 text-2xl select-none">&ldquo;</span>
          <span className="absolute bottom-3 right-4 text-rose-300 text-2xl select-none">&rdquo;</span>
          <p className="text-xl sm:text-2xl text-stone-700 leading-relaxed font-serif whitespace-pre-wrap">
            {message}
          </p>
          <div className="mt-6 text-right w-full pt-4 border-t border-rose-100/50">
            <p className="font-serif text-lg text-rose-500 font-semibold italic">
              Từ: {senderName}
            </p>
          </div>
        </div>

        <p className="reveal-footer mt-8 text-sm text-stone-400 flex items-center justify-center gap-1.5" style={{ opacity: 0 }}>
          Made with <PiHeartFill className="w-3.5 h-3.5 text-rose-400" /> on NirussVn0 Dev
        </p>
      </div>
    </div>
  )
}
