"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { animate } from "animejs"
import { PiXBold } from "react-icons/pi"
import Image from "next/image"
import { PetalRain } from "@/components/effects/PetalRain"

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

function GiftSection({ recipientImage }: { recipientImage?: string }) {
  return (
    <div style={{ position: "relative", width: "40%", height: "100%", overflow: "hidden" }}>
      {recipientImage ? (
        <img
          src={recipientImage}
          alt="Recipient"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            borderRadius: "12px 0 0 12px",
            borderRight: "3px solid #fda4af",
          }}
        />
      ) : (
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", zIndex: 100 }}>
          <Image src="/ref/giftbox.png" alt="Gift box" width={200} height={200} className="w-full h-auto" />
        </div>
      )}
    </div>
  )
}

function LetterTextContent({ titleText, bodyText, senderName }: { titleText: string; bodyText: string; senderName: string }) {
  return (
    <div style={{
      width: "60%", display: "flex", flexDirection: "column",
      justifyContent: "flex-start", alignItems: "center", userSelect: "none",
      padding: "10px 12px", overflow: "hidden",
    }}>
      <h2 style={{
        fontSize: "clamp(16px, 3.5vw, 26px)", fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
        fontWeight: 700, color: "#292524", marginBottom: 4, flexShrink: 0,
      }}>
        {titleText}
        <span style={{ animation: "blink 1s step-end infinite" }}>|</span>
      </h2>
      <div style={{ flex: 1, overflowY: "auto", width: "100%", minHeight: 0 }}>
        <p style={{
          fontSize: "clamp(13px, 2vw, 17px)", textAlign: "center", padding: "0 6px",
          marginTop: 6, fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
          color: "#44403c", lineHeight: 1.5, wordBreak: "break-word", whiteSpace: "pre-wrap"
        }}>
          {bodyText}
        </p>
      </div>
      <p style={{
        fontSize: "clamp(13px, 2.5vw, 19px)", fontFamily: "var(--font-cursive), 'Dancing Script', cursive",
        color: "#e11d48", fontWeight: 700, flexShrink: 0,
        textAlign: "right", width: "100%", paddingRight: 10, marginTop: 4,
        opacity: bodyText.length > 0 ? 1 : 0, transition: "opacity 1s",
      }}>
        Từ: {senderName}
      </p>
    </div>
  )
}



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
      className="fixed inset-0 z-[1000] flex items-center justify-center px-3 sm:px-4"
      style={{ backgroundColor: "rgba(60,20,30,0.75)", opacity: 0 }}
    >
      <PetalRain />

      {/* Close X */}
      <button onClick={handleClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer z-50">
        <PiXBold className="w-5 h-5" />
      </button>

      <div className="relative flex items-center justify-center" style={{ width: "100%", maxWidth: 800 }}>
        <div className="letter-before absolute bg-white rounded-2xl hidden sm:block" style={{ width: "min(700px, 90vw)", height: "min(400px, 60vh)", transform: "rotate(-15deg)", zIndex: 10, opacity: 0 }} />

        <div className="form-letter relative rounded-2xl shadow-lg" style={{
          width: "min(700px, 85vw)",
          height: "min(400px, 55vh)",
          backgroundColor: "#FFEBEB",
          zIndex: 100,
          padding: "12px 8px",
          opacity: 0,
        }}>
          {/* Corner heart decorations */}
          <HeartDecor position="top-right" />
          <HeartDecor position="bottom-left" />

          <div className="relative w-full h-full rounded-2xl flex overflow-hidden" style={{ border: "2px dashed #FF6666" }}>
            {/* Left: Gift image */}
            <GiftSection recipientImage={recipientImage} />

            {/* Floating heart decorations */}
            <FloatingHeartsDecor />

            {/* Right: Text content */}
            <LetterTextContent titleText={titleText} bodyText={bodyText} senderName={senderName} />
          </div>

          <div className="absolute" style={{ bottom: -10, left: "50%", transform: "translateX(-50%)", width: "clamp(120px, 35%, 200px)", zIndex: 50 }}>
            <Image src="/ref/heartAnimation.gif" alt="Hearts" width={200} height={200} unoptimized className="w-full h-auto" />
          </div>

          <div className="absolute" style={{ bottom: 0, left: 0, width: "clamp(50px, 15%, 90px)", zIndex: 150 }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={90} height={90} unoptimized className="w-full h-auto" />
          </div>
          <div className="absolute" style={{ bottom: 0, right: 0, width: "clamp(50px, 15%, 90px)", transform: "scaleX(-1)", zIndex: 150 }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={90} height={90} unoptimized className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Blink cursor animation */}
      <style>{`@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </div>
  )
}
