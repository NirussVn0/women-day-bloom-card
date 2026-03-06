"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { animate } from "animejs"
import { PiXBold } from "react-icons/pi"
import Image from "next/image"
import { PetalRain } from "@/components/effects/PetalRain"

/* ══════════════════════════════════════════════════════════════
   HeartDecor — Pure CSS heart matching reference .heartLetterItem
   Reference: .heartLetter 30x30 circle, .heartLetterItem 10x10
   ══════════════════════════════════════════════════════════════ */
function HeartDecor({ position }: { position: "top-right" | "bottom-left" }) {
  const pos = position === "top-right"
    ? { right: 5, top: 10 }
    : { left: 5, bottom: 10 }

  return (
    <div className="absolute" style={{ ...pos, width: 30, height: 30, borderRadius: "50%", backgroundColor: "#FFEBEB", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
      <div style={{ position: "relative", width: 10, height: 10, transform: "rotate(45deg)", backgroundColor: "#FF6666" }}>
        <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", top: "-50%" }} />
        <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", left: "-50%" }} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   FloatingHeartsDecor — Decorative mini hearts inside the letter
   ══════════════════════════════════════════════════════════════ */
function FloatingHeartsDecor() {
  const hearts = [
    { right: 60, top: "30%", size: 8, opacity: 0.4 },
    { right: 40, top: "45%", size: 6, opacity: 0.3 },
    { right: 80, top: "60%", size: 10, opacity: 0.4 },
    { right: 50, top: "75%", size: 7, opacity: 0.25 },
  ]

  return (
    <>
      {hearts.map((h, i) => (
        <div key={i} className="absolute" style={{ right: h.right, top: h.top, opacity: h.opacity }}>
          <div style={{ position: "relative", width: h.size, height: h.size, transform: "rotate(45deg)", backgroundColor: "#FF9999" }}>
            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", top: "-50%" }} />
            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", left: "-50%" }} />
          </div>
        </div>
      ))}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   GiftSection — Left 40% of the letter with image
   Reference: .giftbox { width: 40%; height: 100% }
              .giftbox .img { width: 180px; bottom: -10px; left: 50px }
   ══════════════════════════════════════════════════════════════ */
function GiftSection({ recipientImage }: { recipientImage?: string }) {
  return (
    <div style={{ position: "relative", width: "40%", height: "100%" }}>
      <div style={{ position: "absolute", bottom: -10, left: 30, width: 200, zIndex: 100 }}>
        {recipientImage ? (
          <img
            src={recipientImage}
            alt="Recipient"
            style={{ width: "100%", height: "auto", borderRadius: 12, border: "3px solid #fda4af", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          />
        ) : (
          <Image src="/ref/giftbox.png" alt="Gift box" width={200} height={200} className="w-full h-auto" />
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   LetterTextContent — Right side of the letter with typewriter text
   Reference: .textLetter { width: 100%, flex-direction: column }
              h2: 30px Dancing Script
              .contentLetter: 19px Dancing Script
   ══════════════════════════════════════════════════════════════ */
function LetterTextContent({ titleText, bodyText, senderName }: { titleText: string; bodyText: string; senderName: string }) {
  return (
    <div style={{
      width: "60%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", userSelect: "none",
      padding: "15px 20px",
    }}>
      <h2 style={{
        fontSize: 30, fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
        fontWeight: 700, color: "#292524", marginBottom: 8,
      }}>
        {titleText}
        <span style={{ animation: "blink 1s step-end infinite" }}>|</span>
      </h2>
      <p style={{
        fontSize: 19, textAlign: "center", padding: "0 10px",
        marginTop: 10, fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
        color: "#44403c", lineHeight: 1.6, minHeight: 80,
      }}>
        {bodyText}
      </p>
      <p style={{
        fontSize: 22, fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
        color: "#e11d48", fontWeight: 700, marginTop: "auto",
        textAlign: "right", width: "100%", paddingRight: 20,
        opacity: bodyText.length > 0 ? 1 : 0, transition: "opacity 1s",
      }}>
        Từ: {senderName}
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   LetterModal — Main Letter Component
   Reference: .formLetter { width: 600px; height: 350px; bg: #FFEBEB }
              .wrapperLetter { border: 2px dashed #FF6666 }
              .before { transform: rotate(-15deg); bg: #fff }
              .heartAnimation { width: 200px; bottom: 0 }
              .mewmew { width: 90px }
   ══════════════════════════════════════════════════════════════ */

interface LetterModalProps {
  recipientName: string
  message: string
  recipientImage?: string
  senderName: string
  onClose: () => void
}

export function LetterModal({ recipientName, message, recipientImage, senderName, onClose }: LetterModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [titleText, setTitleText] = useState("")
  const [bodyText, setBodyText] = useState("")

  // Entrance animations
  useEffect(() => {
    if (!overlayRef.current) return
    animate(overlayRef.current, { opacity: [0, 1], duration: 500, ease: "out(3)" })
    animate(".form-letter", { scale: [0.8, 1], opacity: [0, 1], duration: 600, delay: 200, ease: "out(4)" })
    animate(".letter-before", { scale: [0.8, 1], opacity: [0, 1], rotate: [-20, -15], duration: 600, delay: 100, ease: "out(4)" })
  }, [])

  // Typewriter: Title
  const titleTarget = `Gửi ${recipientName}!`
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < titleTarget.length) { setTitleText(titleTarget.slice(0, i + 1)); i++ }
      else clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [titleTarget])

  // Typewriter: Body (starts after title)
  useEffect(() => {
    const delay = titleTarget.length * 150 + 300
    const timer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < message.length) { setBodyText(message.slice(0, i + 1)); i++ }
        else clearInterval(interval)
      }, 40)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [message, titleTarget.length])

  // Close handler
  const handleClose = useCallback(() => {
    if (overlayRef.current) {
      animate(overlayRef.current, { opacity: [1, 0], duration: 400, ease: "in(3)", complete: onClose })
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", opacity: 0 }}
    >
      <PetalRain />

      {/* Close X */}
      <button onClick={handleClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer z-50">
        <PiXBold className="w-5 h-5" />
      </button>

      {/* Container matching reference .boxLetter */}
      <div className="relative flex items-center justify-center" style={{ width: "100%", maxWidth: 700 }}>
        {/* White rotated background — reference .before */}
        <div className="letter-before absolute bg-white rounded-2xl" style={{ width: 600, height: 350, transform: "rotate(-15deg)", zIndex: 10, opacity: 0 }} />

        {/* Main pink letter — reference .formLetter: 600x350, bg #FFEBEB */}
        <div className="form-letter relative rounded-2xl shadow-lg" style={{ width: 600, height: 350, backgroundColor: "#FFEBEB", zIndex: 100, padding: "20px 15px", opacity: 0 }}>
          {/* Corner heart decorations */}
          <HeartDecor position="top-right" />
          <HeartDecor position="bottom-left" />

          {/* Dashed border wrapper — reference .wrapperLetter */}
          <div className="relative w-full h-full rounded-2xl flex overflow-hidden" style={{ border: "2px dashed #FF6666" }}>
            {/* Left: Gift image */}
            <GiftSection recipientImage={recipientImage} />

            {/* Floating heart decorations */}
            <FloatingHeartsDecor />

            {/* Right: Text content */}
            <LetterTextContent titleText={titleText} bodyText={bodyText} senderName={senderName} />
          </div>

          {/* Heart animation at bottom center — reference .heartAnimation: 200px */}
          <div className="absolute" style={{ bottom: -10, left: "50%", transform: "translateX(-50%)", width: 200, zIndex: 50 }}>
            <Image src="/ref/heartAnimation.gif" alt="Hearts" width={200} height={200} unoptimized className="w-full h-auto" />
          </div>

          {/* Cat gifs at bottom corners — reference .mewmew: 90px */}
          <div className="absolute" style={{ bottom: 0, left: 0, width: 90, zIndex: 150 }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={90} height={90} unoptimized className="w-full h-auto" />
          </div>
          <div className="absolute" style={{ bottom: 0, right: 0, width: 90, transform: "scaleX(-1)", zIndex: 150 }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={90} height={90} unoptimized className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Blink cursor animation */}
      <style>{`@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </div>
  )
}
