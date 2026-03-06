"use client"

import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

const PETAL_COUNT = 18

const PETAL_PATHS = [
  "M12 2C12 2 7 8 7 12C7 16 12 22 12 22C12 22 17 16 17 12C17 8 12 2 12 2Z",
  "M12 3C9 3 4 7 4 12C4 17 12 21 12 21C12 21 20 17 20 12C20 7 15 3 12 3Z",
  "M12 2C10 5 6 9 6 13C6 17 12 22 12 22C12 22 18 17 18 13C18 9 14 5 12 2Z",
]

const PETAL_COLORS = [
  "#fda4af", "#fb7185", "#fecdd3", "#fcd19e",
  "#f9a8d4", "#f472b6", "#fca5a5", "#fbbf24",
]

interface PetalData {
  left: string
  width: string
  height: string
  color: string
  path: string
  randDuration: number
  randDelay: number
  randSwayX: number[]
}

export function PetalRain() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [petals, setPetals] = useState<PetalData[]>([])

  // Generate random data ONLY on client
  useEffect(() => {
    const data: PetalData[] = Array.from({ length: PETAL_COUNT }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      width: `${16 + Math.random() * 16}px`,
      height: `${16 + Math.random() * 16}px`,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      path: PETAL_PATHS[i % PETAL_PATHS.length],
      randDuration: 8000 + Math.random() * 7000,
      randDelay: Math.random() * 8000,
      randSwayX: Array.from({ length: 4 }).map(() => Math.random() * 80 - 40),
    }))
    setPetals(data)
  }, [])

  // Animate after petals render
  useEffect(() => {
    if (!containerRef.current || petals.length === 0) return

    const els = containerRef.current.querySelectorAll(".petal-svg")

    els.forEach((petal, i) => {
      const p = petals[i]
      if (!p) return

      animate(petal, {
        translateY: [{ from: "-10vh", to: "110vh" }],
        translateX: [
          { from: "0px", to: `${p.randSwayX[0]}px`, duration: p.randDuration * 0.25 },
          { from: `${p.randSwayX[0]}px`, to: `${p.randSwayX[1]}px`, duration: p.randDuration * 0.25 },
          { from: `${p.randSwayX[1]}px`, to: `${p.randSwayX[2]}px`, duration: p.randDuration * 0.25 },
          { from: `${p.randSwayX[2]}px`, to: "0px", duration: p.randDuration * 0.25 },
        ],
        rotate: [{ from: 0, to: 360 * (i % 2 === 0 ? 1 : -1) }],
        opacity: [
          { from: 0, to: 0.8, duration: p.randDuration * 0.1 },
          { from: 0.8, to: 0.8, duration: p.randDuration * 0.7 },
          { from: 0.8, to: 0, duration: p.randDuration * 0.2 },
        ],
        duration: p.randDuration,
        delay: p.randDelay,
        loop: true,
        ease: "linear",
      })
    })
  }, [petals])

  if (petals.length === 0) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p, i) => (
        <svg
          key={i}
          className="petal-svg absolute"
          style={{ left: p.left, top: "-5%", width: p.width, height: p.height }}
          viewBox="0 0 24 24"
          fill={p.color}
          opacity="0"
        >
          <path d={p.path} />
        </svg>
      ))}
    </div>
  )
}
