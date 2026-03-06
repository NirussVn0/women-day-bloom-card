"use client"

import { useState, useTransition } from "react"
import { createCard } from "@/lib/actions"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Copy, Check, Sparkles } from "lucide-react"

const THEMES = [
  { id: "catch-me", label: "🎯 Catch Me", desc: "Nút \"Không\" chạy trốn — buộc phải bấm \"Có\"!" },
]

export function CreatorForm() {
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [theme, setTheme] = useState("catch-me")
  const [result, setResult] = useState<{ id: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientName.trim() || !message.trim()) return

    startTransition(async () => {
      const res = await createCard({ recipientName, message, theme })
      setResult(res)
    })
  }

  const shareUrl = result ? `${window.location.origin}/card/${result.id}` : ""

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence mode="wait">
      {!result ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto space-y-6"
        >
          {/* Recipient Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-600">
              Tên người nhận ✿
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Chị / Mẹ / Bạn gái..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all text-base"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-600">
              Lời chúc của bạn 💌
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Chúc chị ngày 8/3 thật vui vẻ và hạnh phúc!..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all text-base resize-none"
              required
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-600">
              Hiệu ứng 🎬
            </label>
            <div className="grid gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    theme === t.id
                      ? "border-rose-400 bg-rose-50 shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <p className="font-semibold text-stone-800">{t.label}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isPending || !recipientName.trim() || !message.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                Đang tạo...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Tạo link bất ngờ
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-lg mx-auto text-center space-y-6"
        >
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-stone-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-peach-200 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Thiệp đã sẵn sàng! ✿
            </h3>
            <p className="text-stone-500 mb-6">
              Gửi link này cho <strong className="text-rose-500">{recipientName}</strong> để xem bất ngờ!
            </p>

            <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-stone-700 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Đã copy!" : "Copy"}
              </button>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setRecipientName(""); setMessage("") }}
            className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-4 transition-colors"
          >
            ← Tạo thiệp khác
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
