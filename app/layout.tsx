import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "WishLink 8/3 — Tạo thiệp chúc mừng 8/3 ✿",
  description: "Tạo thiệp chúc mừng ngày Quốc tế Phụ nữ 8/3 đẹp mắt, gửi bất ngờ cho người đặc biệt!",
  openGraph: {
    title: "WishLink 8/3 ✿",
    description: "Ai đó đã gửi cho bạn một món quà bất ngờ ngày 8/3!",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
