"use client"

import { useEffect, useRef } from "react"
import { animate, createTimeline } from "animejs"

export function RoseGift({ onComplete }: { onComplete?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const tl = createTimeline({
      onComplete: () => {
        setTimeout(() => onComplete?.(), 500)
      },
    })

    // Stem grows up
    tl.add(".rose-stem", {
      scaleY: [0, 1],
      opacity: [0, 1],
      duration: 800,
      ease: "out(3)",
    }, 0)

    // Leaves unfold
    tl.add(".rose-leaf-left", {
      rotate: [{ from: 40, to: 0 }],
      opacity: [0, 1],
      scale: [0.3, 1],
      duration: 600,
      ease: "out(4)",
    }, 400)

    tl.add(".rose-leaf-right", {
      rotate: [{ from: -40, to: 0 }],
      opacity: [0, 1],
      scale: [0.3, 1],
      duration: 600,
      ease: "out(4)",
    }, 500)

    // Rose bloom — petals scale in with stagger
    tl.add(".rose-petal", {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 500,
      delay: (_el: any, i: number) => i * 100,
      ease: "out(3)",
    }, 700)

    // Rose center
    tl.add(".rose-center", {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 400,
      ease: "out(4)",
    }, 1200)

    // Gentle float
    tl.add(".rose-whole", {
      translateY: [0, -8, 0],
      duration: 2000,
      ease: "inOut(2)",
      loop: 2,
    }, 1500)

  }, [onComplete])

  return (
    <div ref={rootRef} className="flex items-center justify-center">
      <svg
        className="rose-whole"
        width="160"
        height="220"
        viewBox="0 0 160 220"
        fill="none"
      >
        {/* Stem */}
        <rect
          className="rose-stem"
          x="76"
          y="100"
          width="8"
          height="110"
          rx="4"
          fill="#6b8f71"
          style={{ transformOrigin: "80px 210px" }}
          opacity="0"
        />

        {/* Left Leaf */}
        <ellipse
          className="rose-leaf-left"
          cx="55"
          cy="155"
          rx="22"
          ry="10"
          fill="#7da882"
          transform="rotate(-30 55 155)"
          opacity="0"
        />

        {/* Right Leaf */}
        <ellipse
          className="rose-leaf-right"
          cx="105"
          cy="165"
          rx="22"
          ry="10"
          fill="#7da882"
          transform="rotate(25 105 165)"
          opacity="0"
        />

        {/* Rose Petals */}
        <ellipse className="rose-petal" cx="80" cy="75" rx="28" ry="22" fill="#f43f5e" opacity="0" />
        <ellipse className="rose-petal" cx="60" cy="85" rx="24" ry="18" fill="#fb7185" opacity="0" transform="rotate(-20 60 85)" />
        <ellipse className="rose-petal" cx="100" cy="85" rx="24" ry="18" fill="#fb7185" opacity="0" transform="rotate(20 100 85)" />
        <ellipse className="rose-petal" cx="70" cy="95" rx="20" ry="16" fill="#fda4af" opacity="0" transform="rotate(-10 70 95)" />
        <ellipse className="rose-petal" cx="90" cy="95" rx="20" ry="16" fill="#fda4af" opacity="0" transform="rotate(10 90 95)" />
        <ellipse className="rose-petal" cx="80" cy="60" rx="18" ry="14" fill="#e11d48" opacity="0" />

        {/* Rose Center */}
        <circle className="rose-center" cx="80" cy="80" r="10" fill="#be123c" opacity="0" />
      </svg>
    </div>
  )
}
