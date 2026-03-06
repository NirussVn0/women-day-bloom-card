"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { animate } from "animejs"
import { PiXBold } from "react-icons/pi"
import Image from "next/image"
import { PetalRain } from "@/components/effects/PetalRain"

interface LetterModalProps {
  recipientName: string
  message: string
  recipientImage?: string
  onClose: () => void
}

export function LetterModal({ recipientName, message, recipientImage, onClose }: LetterModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [titleText, setTitleText] = useState("")
  const [bodyText, setBodyText] = useState("")

  // Entrance animation
  useEffect(() => {
    if (overlayRef.current) {
      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 500,
        ease: "out(3)",
      })
      animate(".form-letter", {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        delay: 200,
        ease: "out(4)",
      })
      animate(".letter-before", {
        scale: [0.8, 1],
        opacity: [0, 1],
        rotate: [-20, -15],
        duration: 600,
        delay: 100,
        ease: "out(4)",
      })
    }
  }, [])

  // Typewriter effect for title
  const titleTarget = `Gửi ${recipientName}!`
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < titleTarget.length) {
        setTitleText(titleTarget.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [titleTarget])

  // Typewriter effect for body (starts after title)
  useEffect(() => {
    const delay = titleTarget.length * 200 + 500
    const timer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < message.length) {
          setBodyText(message.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [message, titleTarget.length])

  const handleClose = useCallback(() => {
    if (overlayRef.current) {
      animate(overlayRef.current, {
        opacity: [1, 0],
        duration: 400,
        ease: "in(3)",
        complete: onClose,
      })
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", opacity: 0 }}
    >
      <PetalRain />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer z-50"
      >
        <PiXBold className="w-5 h-5" />
      </button>

      <div className="relative" style={{ maxWidth: 600, width: "100%" }}>
        {/* Rotated white background behind */}
        <div
          className="letter-before absolute bg-white rounded-2xl"
          style={{
            width: "100%", height: "100%",
            transform: "rotate(-15deg)",
            zIndex: 1, opacity: 0,
            top: 0, left: 0,
          }}
        />

        {/* Main pink letter */}
        <div
          className="form-letter relative rounded-2xl p-5 shadow-lg z-10"
          style={{ backgroundColor: "#FFEBEB", opacity: 0 }}
        >
          {/* Heart decorations */}
          <div className="absolute" style={{ right: 5, top: 10, zIndex: 10 }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFEBEB" }}>
              <div style={{
                width: 10, height: 10, backgroundColor: "#FF6666",
                transform: "rotate(45deg)", position: "relative"
              }}>
                <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", top: "-50%" }} />
                <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", left: "-50%" }} />
              </div>
            </div>
          </div>
          <div className="absolute" style={{ left: 5, bottom: 10, zIndex: 10 }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFEBEB" }}>
              <div style={{
                width: 10, height: 10, backgroundColor: "#FF6666",
                transform: "rotate(45deg)", position: "relative"
              }}>
                <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", top: "-50%" }} />
                <div style={{ position: "absolute", content: '""', width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "inherit", left: "-50%" }} />
              </div>
            </div>
          </div>

          {/* Dashed border wrapper */}
          <div
            className="w-full rounded-2xl flex flex-col sm:flex-row overflow-hidden"
            style={{ border: "2px dashed #FF6666", minHeight: 280 }}
          >
            {/* Left side: giftbox + recipient image */}
            <div className="relative w-full sm:w-2/5 flex items-end justify-center p-4" style={{ minHeight: 200 }}>
              {recipientImage ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-rose-300 shadow-md mb-2">
                  <img src={recipientImage} alt="Recipient" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="relative" style={{ width: 180 }}>
                  <Image
                    src="/ref/giftbox.png"
                    alt="Gift box"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right side: message */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 select-none">
              <h2
                className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3"
                style={{ fontFamily: "'Dancing Script', cursive, serif" }}
              >
                {titleText}
                <span className="animate-pulse">|</span>
              </h2>
              <p
                className="text-base text-stone-700 text-center leading-relaxed"
                style={{ fontFamily: "'Dancing Script', cursive, serif" }}
              >
                {bodyText}
              </p>

              {/* Heart animation gif */}
              <div className="mt-4" style={{ width: 120 }}>
                <Image
                  src="/ref/heartAnimation.gif"
                  alt="Heart animation"
                  width={120}
                  height={120}
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Cat gifs at bottom corners */}
          <div className="absolute bottom-0 left-0" style={{ width: 70 }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={70} height={70} unoptimized />
          </div>
          <div className="absolute bottom-0 right-0" style={{ width: 70, transform: "scaleX(-1)" }}>
            <Image src="/ref/mewmew.gif" alt="Cat" width={70} height={70} unoptimized />
          </div>
        </div>
      </div>
    </div>
  )
}
