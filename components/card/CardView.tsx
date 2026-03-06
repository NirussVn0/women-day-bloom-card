"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DodgeButton } from "./DodgeButton"
import { MessageReveal } from "./MessageReveal"

type Stage = "question" | "dodging" | "reveal"

interface CardViewProps {
  recipientName: string
  message: string
}

export function CardView({ recipientName, message }: CardViewProps) {
  const [stage, setStage] = useState<Stage>("question")

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Stage 1: The question */}
        {stage === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-stone-50 via-rose-50/30 to-peach-100/20"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center max-w-md"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-6xl mb-6"
              >
                🌷
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3 leading-snug">
                Bạn đã sẵn sàng cho<br />
                <span className="text-rose-500">bất ngờ 8/3</span> chưa?
              </h2>
              <p className="text-stone-500 mb-10 text-base">
                Ai đó có điều muốn nói với bạn...
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("dodging")}
                className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 text-lg"
              >
                 Sẵn sàng rồi! ✨
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Dodge the NO button */}
        {stage === "dodging" && (
          <motion.div
            key="dodging"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-rose-50 via-white to-peach-100/30"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center max-w-md w-full"
            >
              <p className="text-5xl mb-6">💝</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                Bạn có muốn nhận<br/>lời chúc đặc biệt không?
              </h2>
              <p className="text-stone-400 text-sm mb-12">
                Thử bấm &quot;Không&quot; xem nào 😏
              </p>

              <div className="flex flex-col items-center gap-6 relative">
                {/* YES button — always in place */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage("reveal")}
                  className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 text-lg z-10"
                >
                  Có! 💕
                </motion.button>

                {/* NO button — dodges */}
                <DodgeButton />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 3: Confetti + Message Reveal */}
        {stage === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MessageReveal recipientName={recipientName} message={message} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
