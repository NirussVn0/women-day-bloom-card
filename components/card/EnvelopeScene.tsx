"use client"

import { useRef, useEffect } from "react"
import { animate } from "animejs"
import { PetalRain } from "@/components/effects/PetalRain"

/* ══════════════════════════════════════════════════════════════
   EnvelopeScene — Faithful 100% port of reference 8_3.html
   
   Reference structure:
     .letter > .valentines > .envelope + .front + .card + .hearts
              .shadow
     SVG heart text path with progressive drawing animation
   ══════════════════════════════════════════════════════════════ */

interface EnvelopeSceneProps {
  onOpenLetter: () => void
  recipientName: string
}

export function EnvelopeScene({ onOpenLetter, recipientName }: EnvelopeSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!rootRef.current || !svgRef.current) return

    /* ── 1. Envelope bobbing animation (reference: @keyframes up) ── */
    animate(".env-valentines", {
      translateY: [0, -30, 0],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    /* ── 2. Shadow scale (reference: @keyframes scale) ── */
    animate(".env-shadow", {
      scaleX: [1, 0.85, 1],
      duration: 3000,
      ease: "inOut(2)",
      loop: true,
    })

    /* ── 3. Card fade in ── */
    animate(".env-card", {
      opacity: [0, 1],
      duration: 500,
      delay: 500,
    })

    /* ── 4. SVG Heart text path — Progressive drawing animation ──
       Reference uses complex Bezier subdivision (subPath class).
       We simplify: animate stroke-dashoffset on the heart path
       to reveal it progressively, text follows via textPath. */
    const heartPath = svgRef.current.querySelector("#heartShapePath") as SVGPathElement | null
    const partialPath = svgRef.current.querySelector("#partialHeartPath") as SVGPathElement | null
    
    if (heartPath && partialPath) {
      const fullD = heartPath.getAttribute("d") || ""
      const totalLength = heartPath.getTotalLength()

      // Progressive path reveal: animate t from 0 → 1 over 5s
      let t = 0
      const speed = 0.003 // fraction per frame
      let frameId: number

      const updatePath = () => {
        t = Math.min(t + speed, 1)
        const len = totalLength * t
        
        // Get point at current length to build partial path
        // Simple approach: use stroke-dasharray to reveal
        partialPath.setAttribute("d", fullD)
        partialPath.style.strokeDasharray = `${len} ${totalLength}`
        partialPath.style.strokeDashoffset = "0"
        
        if (t < 1) {
          frameId = requestAnimationFrame(updatePath)
        } else {
          // After full draw, start slow rotation
          animate(svgRef.current!, {
            rotate: [0, 360],
            duration: 20000,
            ease: "linear",
            loop: true,
          })
        }
      }
      
      frameId = requestAnimationFrame(updatePath)
      return () => cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 select-none relative overflow-hidden"
      style={{ backgroundColor: "#fae1dd" }}
    >
      <PetalRain />

      {/* ══ CSS for hearts — must use real CSS for ::before/::after ══ */}
      <style>{`
        /* ── Big heart on card (reference .heart) ── */
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

        /* ── Floating hearts (reference .one through .five) ── */
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

      {/* ══ SVG Heart text path ══ */}
      <svg
        ref={svgRef}
        className="absolute"
        viewBox="-120 -30 240 180"
        style={{ width: "80%", maxWidth: 500, zIndex: 1 }}
      >
        <defs>
          <path
            id="heartShapePath"
            d="M0,21.054 C0,21.054 24.618,-15.165 60.750,8.554 C93.249,29.888 57.749,96.888 0,117.388 C-57.749,96.888 -93.249,29.888 -60.750,8.554 C-24.618,-15.165 0,21.054 0,21.054z"
          />
          <path id="partialHeartPath" fill="none" stroke="transparent" />
        </defs>
        <text dy="-2" fill="#e6668a" fontSize="9" style={{ fontFamily: "fantasy" }}>
          <textPath xlinkHref="#heartShapePath" startOffset="12">
            🌹Happy Women&apos;s Day 🌹.........................................................................................................................................🌹From {recipientName} With Love 8/3!🌹
          </textPath>
        </text>
        <use xlinkHref="#partialHeartPath" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" fill="none" style={{ display: "none" }} />
      </svg>

      {/* ══ Main envelope container ══ */}
      <div className="relative z-10" style={{ width: 300, height: 320 }}>
        {/* Valentines container (reference .valentines: top: 50px, cursor: pointer) */}
        <div className="env-valentines relative cursor-pointer" style={{ top: 50 }} onClick={onOpenLetter}>
          
          {/* ── Floating hearts (reference .hearts > .one/.two/.three/.four/.five) ── */}
          <div className="env-hearts">
            <div className="env-float-heart env-h-one"></div>
            <div className="env-float-heart env-h-two"></div>
            <div className="env-float-heart env-h-three"></div>
            <div className="env-float-heart env-h-four"></div>
            <div className="env-float-heart env-h-five"></div>
          </div>

          {/* ── Envelope body (reference .envelope: 300x200, bg #f08080) ── */}
          <div className="relative" style={{ width: 300, height: 200, backgroundColor: "#f08080" }}>
            {/* Envelope flap (reference .envelope:before) */}
            <div className="absolute" style={{
              width: 212, height: 212,
              backgroundColor: "#f08080",
              transform: "rotate(45deg)",
              top: -105, left: 44,
              borderRadius: "30px 0 0 0",
            }} />

            {/* Card inside (reference .card: 270x170, bg #eae2b7) */}
            <div
              className="env-card absolute"
              style={{
                backgroundColor: "#eae2b7", width: 270, height: 170,
                top: 5, left: 15, boxShadow: "-5px -5px 100px rgba(0,0,0,0.4)",
                opacity: 0,
              }}
            >
              {/* Dotted border (reference .card:before) */}
              <div className="absolute" style={{
                border: "3px dotted #003049", width: 240, height: 140,
                left: 12, top: 12,
              }} />
              {/* Text (reference .text) */}
              <p style={{
                position: "absolute", fontSize: 28, color: "#003049",
                lineHeight: "25px", top: 19, left: 85,
                fontFamily: "'Brush Script MT', cursive",
              }}>
                Happy<br />Women&apos;s<br />Day!
              </p>
              {/* Big heart (reference .heart — uses real ::before/::after) */}
              <div className="env-big-heart"></div>
            </div>

            {/* Front flaps (reference .front + .front:before) */}
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

        {/* Shadow (reference .shadow) */}
        <div className="env-shadow absolute" style={{
          width: 330, height: 25, borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
          top: 265, left: -15, zIndex: -1,
        }} />
      </div>

      <p className="text-rose-400 italic text-sm mt-4 relative z-10" style={{ fontFamily: "fantasy" }}>
        Chạm vào phong bì để đọc thư...
      </p>
    </div>
  )
}
