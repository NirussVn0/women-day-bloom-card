"use client"

import { animate } from "animejs"
import { useEffect, useRef } from "react"
import { PiSparkleFill } from "react-icons/pi"

export function BrandWatermark({ show }: { show: boolean }) {
  const badgeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (show && badgeRef.current) {
      animate(badgeRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        ease: "out(4)",
      })
    } else if (!show && badgeRef.current) {
      animate(badgeRef.current, {
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 400,
        ease: "in(2)",
      })
    }
  }, [show])

  return (
    <a
      ref={badgeRef}
      href="https://sabicoder.xyz"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-[4.5rem] sm:top-6 sm:right-24 z-[999] px-6 py-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg shadow-rose-500/10 rounded-full flex items-center gap-2.5 hover:bg-white/60 hover:scale-105 transition-all text-sm sm:text-base text-stone-700 font-medium cursor-pointer"
      style={{ opacity: 0, pointerEvents: show ? "auto" : "none" }}
    >
      <PiSparkleFill className="text-rose-500 w-5 h-5 shrink-0" />
      <span>
        Điều bất ngờ bởi <strong className="text-rose-500">NirussVn0</strong>
      </span>
    </a>
  )
}
