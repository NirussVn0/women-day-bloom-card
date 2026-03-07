"use client"

import { useRef, useEffect } from "react"
import { animate } from "animejs"
import { PetalRain } from "@/components/effects/PetalRain"



interface EnvelopeSceneProps {
  onOpenLetter: () => void
  recipientName: string
}

export function EnvelopeScene({ onOpenLetter, recipientName }: EnvelopeSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!rootRef.current || !svgRef.current) return

    animate(".env-valentines", {
      translateY: [0, -30, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    animate(".env-shadow", {
      scaleX: [1, 0.85, 1],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    animate(".env-card", {
      opacity: [0, 1],
      duration: 500,
      delay: 500,
    })

    const heartOutline = svgRef.current.querySelector("#heartOutline") as SVGPathElement | null
    if (heartOutline) {
      const totalLen = heartOutline.getTotalLength()
      heartOutline.style.strokeDasharray = `${totalLen}`
      heartOutline.style.strokeDashoffset = `${totalLen}`

      animate(heartOutline, {
        strokeDashoffset: [totalLen, 0],
        duration: 3000,
        delay: 500,
        ease: "inOut(2)",
      })
    }

    animate(".svg-heart-text", {
      opacity: [0, 1],
      duration: 1500,
      delay: 2500,
      ease: "out(3)",
    })

    setTimeout(() => {
      animate(".svg-heart-ring", {
        opacity: [1, 0.7, 1],
        duration: 5000,
        ease: "inOut(2)",
        loop: true,
      })
    }, 4500)
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 select-none relative overflow-hidden"
      style={{ backgroundColor: "#fae1dd" }}
    >
      <PetalRain />

      <style>{`
        .env-big-heart {
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
        .env-big-heart:before,
        .env-big-heart:after {
          content: "";
          background-color: #d62828;
          border-radius: 50%;
          height: 30px;
          position: absolute;
          width: 30px;
        }
        .env-big-heart:before { top: -15px; left: 0; }
        .env-big-heart:after  { left: 15px; top: 0; }

        .env-hearts { position: absolute; top: 0; }
        
        .env-float-heart {
          background-color: red;
          display: inline-block;
          height: 10px;
          margin: 0 10px;
          position: relative;
          transform: rotate(-45deg);
          width: 10px;
          top: 50px;
        }
        .env-float-heart:before,
        .env-float-heart:after {
          content: "";
          background-color: red;
          border-radius: 50%;
          height: 10px;
          position: absolute;
          width: 10px;
        }
        .env-float-heart:before { top: -5px; left: 0; }
        .env-float-heart:after  { left: 5px; top: 0; }

        .env-h-one   { left: 10px; animation: env-heart-float 1s ease-out infinite; }
        .env-h-two   { left: 30px; animation: env-heart-float 2s ease-out infinite; }
        .env-h-three { left: 50px; animation: env-heart-float 1.5s ease-out infinite; }
        .env-h-four  { left: 70px; animation: env-heart-float 2.3s ease-out infinite; }
        .env-h-five  { left: 90px; animation: env-heart-float 1.7s ease-out infinite; }

        @keyframes env-heart-float {
          0%   { transform: translateY(0) rotate(-45deg) scale(0.3); opacity: 1; }
          100% { transform: translateY(-150px) rotate(-45deg) scale(1.3); opacity: 0.5; }
        }
      `}</style>

      <svg
        ref={svgRef}
        className="svg-heart-ring absolute"
        viewBox="-130 -40 260 200"
        style={{ width: "min(150vw, 900px)", minWidth: "550px", zIndex: 1 }}
      >
        <defs>
          <path
            id="heartShapePath"
            d="M0,21.054 C0,21.054 24.618,-15.165 60.750,8.554 C93.249,29.888 57.749,96.888 0,117.388 C-57.749,96.888 -93.249,29.888 -60.750,8.554 C-24.618,-15.165 0,21.054 0,21.054z"
          />
        </defs>
        <path
          id="heartOutline"
          d="M0,21.054 C0,21.054 24.618,-15.165 60.750,8.554 C93.249,29.888 57.749,96.888 0,117.388 C-57.749,96.888 -93.249,29.888 -60.750,8.554 C-24.618,-15.165 0,21.054 0,21.054z"
          fill="none" stroke="#fda4af" strokeWidth="0.8" strokeDasharray="4 3"
        />
        <text className="svg-heart-text" dy="-3" fill="#e6668a" fontSize="8" style={{ fontFamily: "var(--font-cursive), 'Dancing Script', cursive", opacity: 0 }}>
          <textPath xlinkHref="#heartShapePath" startOffset="5%">
            🌹 Happy Women&apos;s Day 🌹 ················· 🌹 From {recipientName} With Love 8/3! 🌹
          </textPath>
        </text>
      </svg>

      <div className="relative z-10" style={{ width: 300, height: 320 }}>
        <div className="env-valentines relative cursor-pointer" style={{ top: 50 }} onClick={onOpenLetter}>
          
          <div className="env-hearts">
            <div className="env-float-heart env-h-one"></div>
            <div className="env-float-heart env-h-two"></div>
            <div className="env-float-heart env-h-three"></div>
            <div className="env-float-heart env-h-four"></div>
            <div className="env-float-heart env-h-five"></div>
          </div>

          <div className="relative" style={{ width: 300, height: 200, backgroundColor: "#f08080" }}>
            <div className="absolute" style={{
              width: 212, height: 212,
              backgroundColor: "#f08080",
              transform: "rotate(45deg)",
              top: -105, left: 44,
              borderRadius: "30px 0 0 0",
            }} />

            <div
              className="env-card absolute"
              style={{
                backgroundColor: "#eae2b7", width: 270, height: 170,
                top: 5, left: 15, boxShadow: "-5px -5px 100px rgba(0,0,0,0.4)",
                opacity: 0,
              }}
            >
              <div className="absolute" style={{
                border: "3px dotted #003049", width: 240, height: 140,
                left: 12, top: 12,
              }} />
              <p style={{
                position: "absolute", fontSize: 28, color: "#003049",
                lineHeight: "25px", top: 19, left: 85,
                fontFamily: "'Brush Script MT', cursive",
              }}>
                Happy<br />Women&apos;s<br />Day!
              </p>
              <div className="env-big-heart"></div>
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

        <div className="env-shadow absolute" style={{
          width: 330, height: 25, borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
          top: 265, left: -15, zIndex: -1,
        }} />
      </div>

      <div className="absolute bottom-12 w-full flex justify-center z-50 pointer-events-none">
        <p className="text-rose-600 text-lg sm:text-xl font-bold animate-bounce px-6 py-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg shadow-rose-200" style={{ fontFamily: "var(--font-cursive), 'Dancing Script', cursive" }}>
          🌹 Chạm vào phong bì để đọc thư... 🌹
        </p>
      </div>
    </div>
  )
}
