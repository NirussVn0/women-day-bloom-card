"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { animate } from "animejs"
import { MemeOpening } from "./MemeOpening"
import { EnvelopeLetter } from "./EnvelopeLetter"
import { DodgeButton } from "./DodgeButton"
import { MessageReveal } from "./MessageReveal"
import { MusicToggle } from "./MusicToggle"
import { BrandWatermark } from "@/components/BrandWatermark"
import { RoseGift } from "@/components/effects/RoseGift"
import { PetalRain } from "@/components/effects/PetalRain"
import { RoseDrawing } from "./RoseDrawing"
import { EnvelopeScene } from "./EnvelopeScene"
import { LetterModal } from "./LetterModal"
import { PiFlowerTulipFill, PiHeartFill, PiGiftFill, PiSparkle } from "react-icons/pi"

/* ─── Theme A (catch-me) stages ─── */
type CatchMeStage = "meme" | "envelope" | "question" | "dodging" | "rose" | "reveal"

/* ─── Theme B (love-letter) stages ─── */
type LoveLetterStage = "meme" | "roseDrawing" | "envelopeScene" | "letterModal"

interface CardViewProps {
  recipientName: string
  message: string
  theme?: string
  recipientImage?: string
  senderName: string
  customMusic?: string
}

export function CardView({ recipientName, message, theme = "catch-me", recipientImage, senderName, customMusic }: CardViewProps) {
  /* ─── Theme A state ─── */
  const [catchStage, setCatchStage] = useState<CatchMeStage>("meme")
  /* ─── Theme B state ─── */
  const [letterStage, setLetterStage] = useState<LoveLetterStage>("meme")

  const stageRef = useRef<HTMLDivElement>(null)

  // Animate stage entrance for catch-me stages
  useEffect(() => {
    if (stageRef.current && theme === "catch-me" && catchStage !== "meme" && catchStage !== "envelope") {
      animate(stageRef.current, {
        opacity: [0, 1],
        duration: 600,
        ease: "out(3)",
      })
    }
  }, [catchStage, theme])

  const handleRoseComplete = useCallback(() => {
    setCatchStage("reveal")
  }, [])

  const isLoveLetter = theme === "love-letter"

  const showWatermark = true

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Brand watermark badge at top right */}
      <BrandWatermark show={showWatermark} />

      {/* Music toggle — always visible */}
      <MusicToggle src={customMusic} />

      {/* ═══════════════════════════════════════════════
          THEME A: Catch Me (flower)
          meme → envelope → question → dodging → rose → reveal
         ═══════════════════════════════════════════════ */}
      {!isLoveLetter && (
        <>
          {catchStage === "meme" && (
            <MemeOpening
              recipientName={recipientName}
              onOpen={() => setCatchStage("envelope")}
            />
          )}
          {catchStage === "envelope" && (
            <EnvelopeLetter
              recipientName={recipientName}
              onOpen={() => setCatchStage("question")}
            />
          )}
          {catchStage === "question" && (
            <div
              ref={stageRef}
              className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-stone-50 via-rose-50/30 to-orange-50/20"
              style={{ opacity: 0 }}
            >
              <PetalRain />
              <div className="text-center max-w-md relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <PiFlowerTulipFill className="w-10 h-10 text-rose-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3 leading-snug">
                  Bạn đã sẵn sàng cho<br />
                  <span className="text-rose-500">bất ngờ 8/3</span> chưa?
                </h2>
                <p className="text-stone-500 mb-10 text-base">
                  Ai đó có điều muốn nói với bạn...
                </p>
                <button
                  onClick={() => setCatchStage("dodging")}
                  className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 text-lg cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <span className="flex items-center gap-2">
                    Sẵn sàng rồi!
                    <PiSparkle className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          )}
          {catchStage === "dodging" && (
            <div
              ref={stageRef}
              className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-rose-50 via-white to-orange-50/30"
              style={{ opacity: 0 }}
            >
              <div className="text-center max-w-md w-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                  <PiGiftFill className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                  Bạn có muốn nhận<br/>lời chúc đặc biệt không?
                </h2>
                <p className="text-stone-400 text-sm mb-12">
                  Thử bấm &quot;Không&quot; xem nào
                </p>
                <div className="flex flex-col items-center gap-6 relative">
                  <button
                    onClick={() => setCatchStage("rose")}
                    className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 text-lg z-10 cursor-pointer hover:shadow-xl transition-shadow flex items-center gap-2"
                  >
                    Có! <PiHeartFill className="w-5 h-5" />
                  </button>
                  <DodgeButton />
                </div>
              </div>
            </div>
          )}
          {catchStage === "rose" && (
            <div
              ref={stageRef}
              className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-rose-50 via-white to-stone-50"
              style={{ opacity: 0 }}
            >
              <PetalRain />
              <div className="text-center relative z-10">
                <p className="text-stone-500 font-medium mb-8 text-sm tracking-wide">Tặng bạn một bông hồng...</p>
                <RoseGift onComplete={handleRoseComplete} />
              </div>
            </div>
          )}
          {catchStage === "reveal" && (
            <div ref={stageRef} style={{ opacity: 0 }}>
              <MessageReveal recipientName={recipientName} message={message} senderName={senderName} />
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════
          THEME B: Love Letter
          meme → roseDrawing → envelopeScene → letterModal
         ═══════════════════════════════════════════════ */}
      {isLoveLetter && (
        <>
          {letterStage === "meme" && (
            <MemeOpening
              recipientName={recipientName}
              onOpen={() => setLetterStage("roseDrawing")}
            />
          )}
          {letterStage === "roseDrawing" && (
            <RoseDrawing
              onComplete={() => setLetterStage("envelopeScene")}
            />
          )}
          {letterStage === "envelopeScene" && (
            <EnvelopeScene
              recipientName={recipientName}
              onOpenLetter={() => setLetterStage("letterModal")}
            />
          )}
          {letterStage === "letterModal" && (
            <div className="min-h-screen" style={{ backgroundColor: "#fae1dd" }}>
              <LetterModal
                recipientName={recipientName}
                message={message}
                recipientImage={recipientImage}
                senderName={senderName}
                onClose={() => setLetterStage("envelopeScene")}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
