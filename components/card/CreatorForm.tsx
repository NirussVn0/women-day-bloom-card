"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { createCard } from "@/lib/actions"
import { animate } from "animejs"
import { PiArrowRightBold, PiCopyBold, PiCheckBold, PiSparkle, PiFlowerTulipFill } from "react-icons/pi"

const THEMES = [
  { id: "catch-me", label: "Catch Me", desc: 'Nút "Không" chạy trốn — buộc phải bấm "Có"!', icon: PiFlowerTulipFill },
]

export function CreatorForm() {
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [theme, setTheme] = useState("catch-me")
  const [result, setResult] = useState<{ id: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    if (formRef.current) {
      const fields = formRef.current.querySelectorAll(".form-field")
      animate(fields, {
        opacity: [0, 1],
        translateY: [24, 0],
        delay: (_el: any, i: number) => i * 120,
        duration: 600,
        ease: "out(4)",
      })
    }
  }, [])

  // Result card entrance
  useEffect(() => {
    if (result && resultRef.current) {
      animate(resultRef.current, {
        opacity: [0, 1],
        scale: [0.92, 1],
        duration: 600,
        ease: "out(4)",
      })
    }
  }, [result])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientName.trim() || !message.trim()) return

    startTransition(async () => {
      const res = await createCard({ recipientName, message, theme })
      setResult(res)
    })
  }

  const shareUrl = result ? `${typeof window !== "undefined" ? window.location.origin : ""}/card/${result.id}` : ""

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <div ref={resultRef} className="w-full max-w-lg mx-auto text-center space-y-6" style={{ opacity: 0 }}>
        <div className="p-8 bg-white rounded-2xl shadow-lg border border-stone-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
            <PiSparkle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Thiệp đã sẵn sàng!
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
              {copied ? <PiCheckBold className="w-4 h-4" /> : <PiCopyBold className="w-4 h-4" />}
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
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-6"
    >
      <div className="space-y-2 form-field" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-stone-600">
          Tên người nhận
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

      <div className="space-y-2 form-field" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-stone-600">
          Lời chúc của bạn
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

      <div className="space-y-2 form-field" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-stone-600">
          Hiệu ứng
        </label>
        <div className="grid gap-3">
          {THEMES.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                  theme === t.id
                    ? "border-rose-400 bg-rose-50 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <Icon className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-stone-800">{t.label}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{t.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="form-field" style={{ opacity: 0 }}>
        <button
          type="submit"
          disabled={isPending || !recipientName.trim() || !message.trim()}
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <PiSparkle className="w-5 h-5 animate-spin" />
              Đang tạo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Tạo link bất ngờ
              <PiArrowRightBold className="w-5 h-5" />
            </span>
          )}
        </button>
      </div>
    </form>
  )
}
