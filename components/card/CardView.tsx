"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { animate } from "animejs"
import { MemeOpening } from "./MemeOpening"
import { EnvelopeLetter } from "./EnvelopeLetter"
import { DodgeButton } from "./DodgeButton"
import { MessageReveal } from "./MessageReveal"
import { MusicToggle } from "./MusicToggle"
import { RoseGift } from "@/components/effects/RoseGift"
import { PetalRain } from "@/components/effects/PetalRain"
import { PiFlowerTulipFill, PiHeartFill, PiGiftFill, PiSparkle } from "react-icons/pi"

type Stage = "meme" | "envelope" | "question" | "dodging" | "rose" | "reveal"

interface CardViewProps {
  recipientName: string
  message: string
}

export function CardView({ recipientName, message }: CardViewProps) {
  const [stage, setStage] = useState<Stage>("meme")
  const stageRef = useRef<HTMLDivElement>(null)

  // Animate stage entrance
  useEffect(() => {
    if (stageRef.current && stage !== "meme" && stage !== "envelope") {
      animate(stageRef.current, {
        opacity: [0, 1],
        duration: 600,
        ease: "out(3)",
      })
    }
  }, [stage])

  const handleRoseComplete = useCallback(() => {
    setStage("reveal")
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Music toggle — always visible */}
      <MusicToggle />

      {/* Stage 0: Meme opening */}
      {stage === "meme" && (
        <MemeOpening
          recipientName={recipientName}
          onOpen={() => setStage("envelope")}
        />
      )}

      {/* Stage 1: Envelope letter */}
      {stage === "envelope" && (
        <EnvelopeLetter
          recipientName={recipientName}
          onOpen={() => setStage("question")}
        />
      )}

      {/* Stage 2: The question */}
      {stage === "question" && (
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
              onClick={() => setStage("dodging")}
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

      {/* Stage 3: Dodge the NO button */}
      {stage === "dodging" && (
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
                onClick={() => setStage("rose")}
                className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 text-lg z-10 cursor-pointer hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                Có! <PiHeartFill className="w-5 h-5" />
              </button>
              <DodgeButton />
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Rose bloom transition */}
      {stage === "rose" && (
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

      {/* Stage 5: Message Reveal */}
      {stage === "reveal" && (
        <div ref={stageRef} style={{ opacity: 0 }}>
          <MessageReveal recipientName={recipientName} message={message} />
        </div>
      )}
    </div>
  )
}
