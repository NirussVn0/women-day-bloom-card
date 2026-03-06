"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { PiDownloadSimpleBold, PiSpinnerBold } from "react-icons/pi"

interface HeartQRProps {
  url: string
  recipientName: string
}

export function HeartQR({ url, recipientName }: HeartQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const generate = async () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Canvas dimensions (high res for download)
      const width = 800
      const height = 900
      canvas.width = width
      canvas.height = height

      // 1. Draw solid background matching the meme opening (soft pastel)
      ctx.fillStyle = "#fae1dd"
      ctx.fillRect(0, 0, width, height)

      // 2. Draw big pink heart
      ctx.save()
      ctx.translate(width / 2, height / 2 - 50)
      ctx.scale(1.5, 1.5)
      
      ctx.beginPath()
      // Standard SVG heart path centered
      const topCurveHeight = 110
      ctx.moveTo(0, topCurveHeight)
      // Left curve
      ctx.bezierCurveTo(0, topCurveHeight - 80, -200, topCurveHeight - 80, -200, topCurveHeight + 30)
      // Left bottom phase
      ctx.bezierCurveTo(-200, topCurveHeight + 110, 0, topCurveHeight + 200, 0, topCurveHeight + 200)
      // Right bottom phase
      ctx.bezierCurveTo(0, topCurveHeight + 200, 200, topCurveHeight + 110, 200, topCurveHeight + 30)
      // Right curve
      ctx.bezierCurveTo(200, topCurveHeight - 80, 0, topCurveHeight - 80, 0, topCurveHeight)
      
      ctx.closePath()
      ctx.fillStyle = "#ffb5a7" // Soft pink heart
      ctx.fill()
      
      // inner shadow/stroke for heart
      ctx.lineWidth = 15
      ctx.strokeStyle = "#fec5bb"
      ctx.stroke()
      ctx.restore()

      // 3. Draw text above QR (inside heart upper area)
      ctx.textAlign = "center"
      ctx.fillStyle = "#d62828"
      ctx.font = "bold 44px 'Brush Script MT', 'Dancing Script', cursive, serif"
      ctx.fillText(`Gửi ${recipientName}`, width / 2, 280)

      // 4. Generate and draw QR Code
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 1,
        color: {
          dark: "#d62828", // Deep red QR
          light: "#ffffff", // White background
        },
      })

      const qrImg = new Image()
      qrImg.src = qrDataUrl
      await new Promise((resolve) => {
        qrImg.onload = () => {
          // Draw QR in center of heart
          ctx.drawImage(qrImg, width / 2 - 150, 330, 300, 300)
          
          // 5. Draw text below QR
          ctx.font = "italic 36px serif"
          ctx.fillText("Happy Women's Day!", width / 2, 700)
          
          ctx.font = "24px sans-serif"
          ctx.fillStyle = "#666"
          ctx.fillText("by NirussVn0", width / 2, 750)

          setIsReady(true)
          resolve(null)
        }
      })
    }

    generate()
  }, [url, recipientName])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `QR_Thiep_8_3_${recipientName}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-[280px] aspect-[8/9] rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-50">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.5s" }}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <PiSpinnerBold className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>
      <button
        onClick={handleDownload}
        disabled={!isReady}
        className="w-full max-w-[280px] py-3 bg-stone-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        <PiDownloadSimpleBold className="w-5 h-5" />
        Tải mã QR trái tim
      </button>
    </div>
  )
}
