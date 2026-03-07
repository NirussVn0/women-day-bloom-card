"use client"

import { useRef, useEffect } from "react"
import { animate } from "animejs"
import { PiHandTapFill } from "react-icons/pi"
import Image from "next/image"

interface MemeOpeningProps {
  onOpen: () => void
  recipientName: string
}

export function MemeOpening({ onOpen, recipientName }: MemeOpeningProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return


    animate(".meme-title", {
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 800,
      ease: "out(4)",
      delay: 300,
    })

    animate(".meme-image-box", {
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 800,
      ease: "out(4)",
      delay: 600,
    })

    animate(".meme-hint", {
      opacity: [0, 1],
      duration: 600,
      delay: 1200,
    })

    animate(".meme-image-box", {
      translateY: [0, -12, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
      delay: 1500,
    })
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-rose-50 via-white to-rose-50/50 cursor-pointer select-none"
      onClick={onOpen}
    >
      <h1
        className="meme-title text-3xl sm:text-4xl font-serif font-bold text-rose-500 mb-8 text-center leading-snug"
        style={{ opacity: 0, fontStyle: "italic" }}
      >
        Cốc cốc, bó hoa đến rồi
      </h1>

      <div
        className="meme-image-box w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-2xl shadow-lg border border-rose-100 flex items-center justify-center overflow-hidden relative"
        style={{ opacity: 0 }}
      >
        <Image
          src="/cute.jpeg"
          alt="Cute meme"
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      <p
        className="meme-hint mt-8 text-rose-400 text-sm flex items-center gap-2 animate-bounce"
        style={{ opacity: 0, fontFamily: "var(--font-cursive), 'Dancing Script', cursive" }}
      >
        <PiHandTapFill className="w-4 h-4 text-rose-300" />
        🌷 Chạm vào ảnh, có điều bất ngờ 🌷
      </p>
    </div>
  )
}
