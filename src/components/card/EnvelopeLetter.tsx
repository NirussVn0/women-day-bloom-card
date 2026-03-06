"use client"

import { useRef, useEffect } from "react"
import { animate, createTimeline } from "animejs"

interface EnvelopeLetterProps {
  onOpen: () => void
  recipientName: string
}

export function EnvelopeLetter({ onOpen, recipientName }: EnvelopeLetterProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    // Entrance
    animate(".envelope-group", {
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 800,
      ease: "out(4)",
      delay: 300,
    })

    // Floating animation
    animate(".envelope-group", {
      translateY: [0, -20, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
      delay: 1200,
    })

    // Shadow scale
    animate(".envelope-shadow", {
      scaleX: [1, 0.85, 1],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
      delay: 1200,
    })

    // SVG text rotation
    animate(".svg-text-ring", {
      rotate: [0, 360],
      duration: 12000,
      ease: "linear",
      loop: true,
    })

    // Hearts floating
    const hearts = rootRef.current.querySelectorAll(".float-heart")
    hearts.forEach((heart, i) => {
      animate(heart, {
        translateY: [0, -120],
        opacity: [1, 0],
        scale: [0.4, 1.2],
        duration: 1500 + i * 300,
        ease: "out(3)",
        loop: true,
        delay: i * 400,
      })
    })
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 cursor-pointer select-none"
      style={{ backgroundColor: "#fae1dd" }}
      onClick={onOpen}
    >
      <div className="relative" style={{ width: 320, height: 380 }}>
        {/* Rotating SVG text ring */}
        <svg
          className="svg-text-ring absolute inset-0 w-full h-full"
          viewBox="0 0 320 320"
          style={{ top: -10 }}
        >
          <defs>
            <path
              id="textCircle"
              d="M 160,160 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
            />
          </defs>
          <text fill="#e6668a" fontSize="14" fontFamily="serif" fontStyle="italic">
            <textPath href="#textCircle" startOffset="0%">
              Chúc Mừng Ngày 8/3 ♡ ............................  Yêu Thương Gửi {recipientName}! 🌹
            </textPath>
          </text>
        </svg>

        {/* Floating hearts */}
        <div className="absolute" style={{ top: 80, left: 80 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="float-heart absolute text-rose-500"
              style={{
                left: `${i * 30}px`,
                fontSize: `${12 + i * 3}px`,
              }}
            >
              ❤
            </span>
          ))}
        </div>

        {/* Envelope */}
        <div className="envelope-group absolute" style={{ top: 60, left: 10, opacity: 0 }}>
          <div className="relative" style={{ width: 300, height: 200 }}>
            {/* Main body */}
            <div
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: "#f08080" }}
            />
            {/* Top flap */}
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "150px solid transparent",
                borderRight: "150px solid transparent",
                borderBottom: "110px solid #f08080",
                top: -110,
                left: 0,
              }}
            />
            {/* Card inside */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                backgroundColor: "#eae2b7",
                width: 270,
                height: 170,
                top: 5,
                left: 15,
                boxShadow: "-5px -5px 100px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="absolute"
                style={{
                  border: "2px dotted #555",
                  width: 240,
                  height: 140,
                  left: 12,
                  top: 12,
                }}
              />
              <p
                className="text-center font-serif text-stone-700 px-6"
                style={{ fontSize: 20, lineHeight: "26px" }}
              >
                Happy Women&apos;s Day!
              </p>
            </div>
            {/* Front flap (overlays) */}
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "150px solid #f4978e",
                borderTop: "95px solid transparent",
                borderBottom: "100px solid transparent",
                left: 150,
                top: 5,
                zIndex: 10,
              }}
            />
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderRight: "300px solid #f8ad9d",
                borderTop: "195px solid transparent",
                left: 0,
                top: 5,
                zIndex: 9,
              }}
            />
          </div>
        </div>

        {/* Shadow */}
        <div
          className="envelope-shadow absolute rounded-full"
          style={{
            width: 320,
            height: 20,
            backgroundColor: "rgba(0,0,0,0.15)",
            bottom: 30,
            left: 0,
          }}
        />
      </div>

      {/* Instruction */}
      <p className="text-rose-400 text-sm mt-4 animate-bounce" style={{ fontFamily: "var(--font-cursive), 'Dancing Script', cursive" }}>
        🌺 Chạm để mở thiệp bất ngờ... 🌺
      </p>
    </div>
  )
}
