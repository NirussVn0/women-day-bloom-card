"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import QRCode from "qrcode"
import { PiDownloadSimpleBold, PiSpinnerBold } from "react-icons/pi"

/* ══════════════════════════════════════════════════════════════
   HeartQR — Canvas-based heart with QR code embedded inside
   The heart is filled with decorative QR-like noise patterns
   and the real scannable QR sits centered.
   ══════════════════════════════════════════════════════════════ */

interface HeartQRProps {
  url: string
  recipientName: string
}

/** Draw a filled heart path centered at (cx, cy) with given scale */
function drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.moveTo(0, -50)
  ctx.bezierCurveTo(-70, -120, -150, -10, 0, 100)
  ctx.bezierCurveTo(150, -10, 70, -120, 0, -50)
  ctx.closePath()
  ctx.restore()
}

/** Generate random QR-like decorative marks inside a heart mask */
function drawDecorativeNoise(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  // Create heart clipping region
  drawHeart(ctx, cx, cy, scale)
  ctx.save()
  ctx.clip()

  // Draw random small squares to simulate QR pattern noise
  const rng = (min: number, max: number) => Math.random() * (max - min) + min
  for (let i = 0; i < 800; i++) {
    const x = cx + rng(-scale * 140, scale * 140)
    const y = cy + rng(-scale * 110, scale * 110)
    const s = rng(2, 8)
    ctx.globalAlpha = rng(0.03, 0.12)
    ctx.fillStyle = color
    ctx.fillRect(x, y, s, s)
  }
  ctx.globalAlpha = 1
  ctx.restore()
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

      const W = 600, H = 680
      canvas.width = W
      canvas.height = H

      // 1. Soft background
      ctx.fillStyle = "#fae1dd"
      ctx.fillRect(0, 0, W, H)

      // 2. Draw large filled heart
      const heartCx = W / 2, heartCy = 280, heartScale = 2.8
      drawHeart(ctx, heartCx, heartCy, heartScale)
      ctx.fillStyle = "#ffb5a7"
      ctx.fill()

      // 3. Subtle heart outline
      drawHeart(ctx, heartCx, heartCy, heartScale)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#fec5bb"
      ctx.stroke()

      // 4. Draw decorative QR-like noise inside heart
      drawDecorativeNoise(ctx, heartCx, heartCy, heartScale, "#c9184a")

      // 5. Generate real QR code
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 180,
        margin: 1,
        color: { dark: "#881337", light: "#ffffff" },
        errorCorrectionLevel: "M",
      })

      const qrImg = new window.Image()
      qrImg.src = qrDataUrl
      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          // 6. White circle background for QR readability
          ctx.beginPath()
          ctx.arc(heartCx, heartCy + 10, 105, 0, Math.PI * 2)
          ctx.fillStyle = "#fff"
          ctx.fill()

          // 7. Draw QR centered
          const qrSize = 170
          ctx.drawImage(qrImg, heartCx - qrSize / 2, heartCy + 10 - qrSize / 2, qrSize, qrSize)

          // 8. Text above QR inside heart
          ctx.textAlign = "center"
          ctx.fillStyle = "#881337"
          ctx.font = "bold 28px 'Dancing Script', cursive, serif"
          ctx.fillText(`Gửi ${recipientName}`, heartCx, heartCy - 120)

          // 9. Text below heart
          ctx.fillStyle = "#881337"
          ctx.font = "italic 24px serif"
          ctx.fillText("Happy Women's Day!", W / 2, heartCy + 220)

          // 10. Small decorative hearts at bottom
          const miniScale = 0.3
          const miniPositions = [
            { x: 120, y: 580 }, { x: 480, y: 580 },
            { x: 200, y: 620 }, { x: 400, y: 620 },
          ]
          miniPositions.forEach(({ x, y }) => {
            drawHeart(ctx, x, y, miniScale)
            ctx.fillStyle = "#fda4af"
            ctx.fill()
          })

          // 11. Branding
          ctx.fillStyle = "#a8a29e"
          ctx.font = "16px sans-serif"
          ctx.fillText("by NirussVn0", W / 2, H - 20)

          setIsReady(true)
          resolve()
        }
      })
    }

    generate()
  }, [url, recipientName])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `QR_HeartCard_${recipientName}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }, [recipientName])

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-[300px] aspect-[6/7] rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-50">
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
        className="w-full max-w-[300px] py-3 bg-stone-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <PiDownloadSimpleBold className="w-5 h-5" />
        Tải mã QR trái tim
      </button>
    </div>
  )
}
