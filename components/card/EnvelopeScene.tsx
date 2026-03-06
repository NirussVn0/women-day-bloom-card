"use client"

import { useRef, useEffect } from "react"
import { animate } from "animejs"
import { PetalRain } from "@/components/effects/PetalRain"

interface EnvelopeSceneProps {
  onOpenLetter: () => void
  recipientName: string
}

/* ─── Pure CSS heart (rotated square + 2 pseudo-circles) ─── */
function CSSHeart({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{
      width: 10, height: 10, backgroundColor: "red",
      transform: "rotate(-45deg)", position: "relative", display: "inline-block",
      ...style,
    }}>
      <div style={{
        content: '""', backgroundColor: "red", borderRadius: "50%",
        width: 10, height: 10, position: "absolute", top: -5, left: 0,
      }} />
      <div style={{
        content: '""', backgroundColor: "red", borderRadius: "50%",
        width: 10, height: 10, position: "absolute", left: 5, top: 0,
      }} />
    </div>
  )
}

export function EnvelopeScene({ onOpenLetter, recipientName }: EnvelopeSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    // Envelope float up/down
    animate(".valentines", {
      translateY: [0, -30, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    // Shadow scale
    animate(".env-shadow", {
      scaleX: [1, 0.85, 1],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    // Floating hearts animation
    const hearts = rootRef.current.querySelectorAll(".float-heart")
    const durations = [1000, 2000, 1500, 2300, 1700]
    hearts.forEach((heart, i) => {
      animate(heart, {
        translateY: [0, -150],
        scale: [0.3, 1.3],
        opacity: [1, 0.5],
        duration: durations[i],
        ease: "out(3)",
        loop: true,
      })
    })

    // SVG text ring rotation
    animate(".svg-text-ring-letter", {
      rotate: [0, 360],
      duration: 15000,
      ease: "linear",
      loop: true,
    })

    // Card hover simulation - lift on click area
    animate(".env-card", {
      opacity: [0, 1],
      duration: 500,
      delay: 500,
    })
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 select-none relative overflow-hidden"
      style={{ backgroundColor: "#fae1dd" }}
    >
      <PetalRain />

      {/* SVG Heart-shaped text path */}
      <svg
        className="svg-text-ring-letter absolute w-[80%] max-w-md"
        viewBox="-120 -30 240 180"
        style={{ zIndex: 1 }}
      >
        <defs>
          <path
            id="heartShape"
            d="M0,21.054 C0,21.054 24.618,-15.165 60.750,8.554 C93.249,29.888 57.749,96.888 0,117.388 C-57.749,96.888 -93.249,29.888 -60.750,8.554 C-24.618,-15.165 0,21.054 0,21.054z"
          />
        </defs>
        <text fill="#e6668a" fontSize="9" fontFamily="serif" fontStyle="italic">
          <textPath href="#heartShape" startOffset="0%">
            🌹Happy Women&apos;s Day🌹 ............................ 🌹Gửi {recipientName} With Love 8/3!🌹
          </textPath>
        </text>
      </svg>

      <div className="relative z-10" style={{ width: 300, height: 320 }}>
        {/* Valentines container */}
        <div className="valentines relative cursor-pointer" style={{ top: 50 }} onClick={onOpenLetter}>
          {/* Floating hearts */}
          <div className="absolute" style={{ top: 0, left: 0, width: "100%" }}>
            {[10, 50, 80, 120, 150].map((left, i) => (
              <CSSHeart
                key={i}
                className="float-heart"
                style={{ position: "absolute", left, top: 50 }}
              />
            ))}
          </div>

          {/* Envelope body */}
          <div className="relative" style={{ width: 300, height: 200, backgroundColor: "#f08080" }}>
            {/* Envelope flap (top triangle) */}
            <div className="absolute" style={{
              width: 212, height: 212,
              backgroundColor: "#f08080",
              transform: "rotate(45deg)",
              top: -105, left: 44,
              borderRadius: "30px 0 0 0",
            }} />

            {/* Card inside */}
            <div
              className="env-card absolute flex flex-col items-center justify-center"
              style={{
                backgroundColor: "#eae2b7", width: 270, height: 170,
                top: 5, left: 15, boxShadow: "-5px -5px 100px rgba(0,0,0,0.4)",
                opacity: 0,
              }}
            >
              {/* Dotted border inside card */}
              <div className="absolute" style={{
                border: "3px dotted #003049", width: 240, height: 140,
                left: 12, top: 12,
              }} />
              <p className="text-center font-serif" style={{
                fontSize: 28, color: "#003049", lineHeight: "25px",
                fontFamily: "'Brush Script MT', cursive"
              }}>
                Happy<br />Women&apos;s<br />Day!
              </p>
              {/* Heart at bottom */}
              <div className="absolute" style={{ top: 110, left: 105 }}>
                <div style={{
                  width: 30, height: 30, backgroundColor: "#d62828",
                  transform: "rotate(-45deg)", position: "relative",
                }}>
                  <div style={{
                    backgroundColor: "#d62828", borderRadius: "50%",
                    width: 30, height: 30, position: "absolute", top: -15,
                  }} />
                  <div style={{
                    backgroundColor: "#d62828", borderRadius: "50%",
                    width: 30, height: 30, position: "absolute", left: 15,
                  }} />
                </div>
              </div>
            </div>

            {/* Front flaps */}
            <div className="absolute" style={{
              borderRight: "180px solid #f4978e",
              borderTop: "95px solid transparent",
              borderBottom: "100px solid transparent",
              left: 120, top: 5, width: 0, height: 0, zIndex: 10,
            }} />
            <div className="absolute" style={{
              borderLeft: "300px solid #f8ad9d",
              borderTop: "195px solid transparent",
              left: 0, top: 5, width: 0, height: 0, zIndex: 9,
            }} />
          </div>
        </div>

        {/* Shadow */}
        <div className="env-shadow absolute" style={{
          width: 330, height: 25, borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
          top: 265, left: -15, zIndex: -1,
        }} />
      </div>

      <p className="text-rose-400 font-serif italic text-sm mt-4 relative z-10">
        Chạm vào phong bì để đọc thư...
      </p>
    </div>
  )
}
