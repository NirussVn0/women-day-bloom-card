"use client"

import { useState, useTransition, useRef, useEffect, useCallback } from "react"
import { createCard, uploadMusicChunk, finalizeMusicUpload } from "@/lib/actions"
import { animate } from "animejs"
import {
  PiArrowRightBold, PiCopyBold, PiCheckBold, PiSparkle,
  PiFlowerTulipFill, PiEnvelopeSimpleFill, PiImageBold, PiXBold,
  PiMusicNoteFill
} from "react-icons/pi"
import { HeartQR } from "./HeartQR"

const THEMES = [
  { id: "catch-me", label: "Catch Me 🌸", desc: 'Nút "Không" chạy trốn — buộc phải bấm "Có"!', icon: PiFlowerTulipFill },
  { id: "love-letter", label: "Thư Tình 💌", desc: "Phong bì + hoa hồng vẽ nét + thư tay kiểu vintage", icon: PiEnvelopeSimpleFill },
]

export function CreatorForm() {
  const [senderName, setSenderName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [theme, setTheme] = useState("catch-me")
  const [recipientImage, setRecipientImage] = useState<string | undefined>()
  const [customMusic, setCustomMusic] = useState<string | undefined>()
  const [musicName, setMusicName] = useState<string>("")
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const musicInputRef = useRef<HTMLInputElement>(null)

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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1000;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Max 5MB to keep in-memory store reasonable
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB")
      return
    }
    try {
      const compressed = await compressImage(file)
      setRecipientImage(compressed)
    } catch (err) {
      console.error(err)
      alert("Lỗi khi xử lý ảnh!")
    }
  }, [])

  const handleMusicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Max 5MB for music
    if (file.size > 5 * 1024 * 1024) {
      alert("File nhạc quá lớn, vui lòng chọn file dưới 5MB")
      return
    }
    setMusicName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setCustomMusic(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderName.trim() || !recipientName.trim() || !message.trim()) return

    startTransition(async () => {
      try {
        const res = await createCard(senderName, recipientName, message, theme, recipientImage, !!customMusic)
        
        if (customMusic) {
          const CHUNK_SIZE = 500000;
          const chunks = [];
          for (let i = 0; i < customMusic.length; i += CHUNK_SIZE) {
            chunks.push(customMusic.substring(i, i + CHUNK_SIZE));
          }
          for (let i = 0; i < chunks.length; i++) {
            await uploadMusicChunk(res, i, chunks[i]);
          }
          await finalizeMusicUpload(res, chunks.length);
        }

        setResult(res)
      } catch (err) {
        console.error("Error creating card:", err)
        alert("Đã có lỗi xảy ra khi tạo thiệp. Hãy thử lại (do file quá lớn hoặc lỗi kết nối).")
      }
    })
  }

  const shareUrl = result ? `${typeof window !== "undefined" ? window.location.origin : ""}/card/${result}` : ""

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
          
          <div className="mt-8 pt-8 border-t border-stone-100 flex flex-col items-center">
            <p className="text-sm text-stone-500 mb-4">Hoặc tải mã QR để gửi trực tiếp:</p>
            <HeartQR url={shareUrl} recipientName={recipientName} />
          </div>
        </div>
        <button
          onClick={() => { setResult(null); setSenderName(""); setRecipientName(""); setMessage(""); setRecipientImage(undefined); setCustomMusic(undefined); setMusicName("") }}
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
          Tên bạn (người gửi)
        </label>
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Tên của bạn..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all text-base"
          required
        />
      </div>

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

      {/* Image upload */}
      <div className="space-y-2 form-field" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-stone-600">
          Ảnh người nhận (tuỳ chọn)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {recipientImage ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-rose-300 shadow-sm">
            <img src={recipientImage} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setRecipientImage(undefined); if (fileInputRef.current) fileInputRef.current.value = "" }}
              className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 cursor-pointer"
            >
              <PiXBold className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone-200 bg-white text-stone-500 hover:border-rose-300 hover:text-rose-500 transition-all cursor-pointer w-full justify-center"
          >
            <PiImageBold className="w-5 h-5" />
            Thêm ảnh
          </button>
        )}
      </div>

      {/* Music upload */}
      <div className="space-y-2 form-field" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-stone-600">
          Nhạc nền (tuỳ chọn — mặc định sẽ dùng nhạc có sẵn)
        </label>
        <input
          ref={musicInputRef}
          type="file"
          accept="audio/*"
          onChange={handleMusicChange}
          className="hidden"
        />
        {customMusic ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-rose-300 bg-rose-50">
            <PiMusicNoteFill className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="text-sm text-stone-700 truncate flex-1">{musicName}</span>
            <button
              type="button"
              onClick={() => { setCustomMusic(undefined); setMusicName(""); if (musicInputRef.current) musicInputRef.current.value = "" }}
              className="w-7 h-7 bg-black/10 rounded-full flex items-center justify-center text-stone-600 hover:bg-black/20 cursor-pointer shrink-0"
            >
              <PiXBold className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => musicInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone-200 bg-white text-stone-500 hover:border-rose-300 hover:text-rose-500 transition-all cursor-pointer w-full justify-center"
          >
            <PiMusicNoteFill className="w-5 h-5" />
            Thêm nhạc
          </button>
        )}
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
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
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
          disabled={isPending || !senderName.trim() || !recipientName.trim() || !message.trim()}
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
