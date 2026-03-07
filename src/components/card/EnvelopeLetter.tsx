"use client"

import { useRef, useEffect } from "react"
import { animate } from "animejs"

interface EnvelopeLetterProps {
  onOpen: () => void
  recipientName: string
}

export function EnvelopeLetter({ onOpen, recipientName }: EnvelopeLetterProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    animate(".envelope-group", {
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 800,
      ease: "out(4)",
      delay: 300,
    })

    animate(".envelope-group", {
      translateY: [0, -20, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
      delay: 1200,
    })

    animate(".envelope-shadow", {
      scaleX: [1, 0.85, 1],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
      delay: 1200,
    })

    animate(".svg-text-ring", {
      rotate: [0, 360],
      duration: 12000,
      ease: "linear",
      loop: true,
    })
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 cursor-pointer select-none"
      style={{ backgroundColor: "#fae1dd" }}
      onClick={onOpen}
    >
      <style>{`
        .env-letter-hearts { position: absolute; top: 0; }

        .env-letter-fh {
          background-color: red;
          display: inline-block;
          height: 10px;
          margin: 0 10px;
          position: relative;
          transform: rotate(-45deg);
          width: 10px;
          top: 50px;
        }
        .env-letter-fh:before,
        .env-letter-fh:after {
          content: "";
          background-color: red;
          border-radius: 50%;
          height: 10px;
          position: absolute;
          width: 10px;
        }
        .env-letter-fh:before { top: -5px; left: 0; }
        .env-letter-fh:after  { left: 5px; top: 0; }

        .env-letter-fh-1 { left: 10px; animation: env-letter-hf 1s ease-out infinite; }
        .env-letter-fh-2 { left: 30px; animation: env-letter-hf 2s ease-out infinite; }
        .env-letter-fh-3 { left: 50px; animation: env-letter-hf 1.5s ease-out infinite; }
        .env-letter-fh-4 { left: 70px; animation: env-letter-hf 2.3s ease-out infinite; }
        .env-letter-fh-5 { left: 90px; animation: env-letter-hf 1.7s ease-out infinite; }

        @keyframes env-letter-hf {
          0%   { transform: translateY(0) rotate(-45deg) scale(0.3); opacity: 1; }
          100% { transform: translateY(-150px) rotate(-45deg) scale(1.3); opacity: 0.5; }
        }

        .env-letter-big-heart {
          background-color: #d62828;
          display: inline-block;
          height: 30px;
          margin: 0 10px;
          position: relative;
          top: 110px;
          left: 105px;
          transform: rotate(-45deg);
          width: 30px;
        }
        .env-letter-big-heart:before,
        .env-letter-big-heart:after {
          content: "";
          background-color: #d62828;
          border-radius: 50%;
          height: 30px;
          position: absolute;
          width: 30px;
        }
        .env-letter-big-heart:before { top: -15px; left: 0; }
        .env-letter-big-heart:after  { left: 15px; top: 0; }
      `}</style>

      <div className="relative" style={{ width: 320, height: 380 }}>
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
          <text fill="#e6668a" fontSize="14" style={{ fontFamily: "var(--font-cursive), 'Dancing Script', cursive" }}>
            <textPath href="#textCircle" startOffset="0%">
              Chúc Mừng Ngày 8/3 ♡ ····················  Yêu Thương Gửi {recipientName}! 🌹
            </textPath>
          </text>
        </svg>

        <div className="env-letter-hearts">
          <div className="env-letter-fh env-letter-fh-1"></div>
          <div className="env-letter-fh env-letter-fh-2"></div>
          <div className="env-letter-fh env-letter-fh-3"></div>
          <div className="env-letter-fh env-letter-fh-4"></div>
          <div className="env-letter-fh env-letter-fh-5"></div>
        </div>

        <div className="envelope-group absolute" style={{ top: 60, left: 10, opacity: 0 }}>
          <div className="relative" style={{ width: 300, height: 200 }}>
            <div className="absolute inset-0" style={{ backgroundColor: "#f08080" }} />

            <div className="absolute" style={{
              width: 212, height: 212,
              backgroundColor: "#f08080",
              transform: "rotate(45deg)",
              top: -105, left: 44,
              borderRadius: "30px 0 0 0",
            }} />

            <div
              className="absolute"
              style={{
                backgroundColor: "#eae2b7",
                width: 270, height: 170,
                top: 5, left: 15,
                boxShadow: "-5px -5px 100px rgba(0,0,0,0.4)",
              }}
            >
              <div className="absolute" style={{
                border: "3px dotted #003049",
                width: 240, height: 140,
                left: 12, top: 12,
              }} />
              <p style={{
                position: "absolute", fontSize: 28, color: "#003049",
                lineHeight: "25px", top: 19, left: 85,
                fontFamily: "'Brush Script MT', cursive",
              }}>
                Happy<br />Women&apos;s<br />Day!
              </p>
              <div className="env-letter-big-heart"></div>
            </div>

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

        <div
          className="envelope-shadow absolute rounded-full"
          style={{
            width: 330, height: 25,
            backgroundColor: "rgba(0,0,0,0.3)",
            bottom: 20, left: -5,
          }}
        />
      </div>

      <p className="text-rose-400 text-sm mt-4 animate-bounce" style={{ fontFamily: "var(--font-cursive), 'Dancing Script', cursive" }}>
        🌺 Chạm để mở thiệp bất ngờ... 🌺
      </p>
    </div>
  )
}
