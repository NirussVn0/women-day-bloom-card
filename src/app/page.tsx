import { CreatorForm } from "@/components/card/CreatorForm"
import { PetalRain } from "@/components/effects/PetalRain"
import { Footer } from "@/components/Footer"
import { PiFlowerTulipFill } from "react-icons/pi"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <PetalRain />

      {/* Ambient Background Blobs */}
      <div className="glow-orb w-72 h-72 bg-rose-200 top-[-5%] left-[-10%]" />
      <div className="glow-orb w-96 h-96 bg-orange-100 bottom-[-10%] right-[-15%]" style={{ animationDelay: "2s" }} />
      <div className="glow-orb w-56 h-56 bg-rose-100 top-[40%] right-[10%]" style={{ animationDelay: "1s" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="relative z-10 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-600 text-sm font-medium mb-6">
            <PiFlowerTulipFill className="w-4 h-4" />
            Ngày 8 tháng 3
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight mb-4">
            Gửi lời chúc<br />
            <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              đặc biệt
            </span>
            {" "}cho cô ấy
          </h1>
          <p className="text-stone-500 text-lg max-w-md mx-auto leading-relaxed">
            Tạo thiệp bất ngờ với hiệu ứng cực cute — gửi qua link, không cần đăng nhập!
          </p>
        </div>

        {/* Creator Form */}
        <div className="relative z-10 w-full">
          <CreatorForm />
        </div>
      </div>

      <Footer />
    </main>
  )
}
