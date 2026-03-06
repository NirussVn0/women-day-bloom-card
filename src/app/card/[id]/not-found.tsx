import { PiFlowerTulipFill } from "react-icons/pi"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-stone-50">
      <PiFlowerTulipFill className="w-12 h-12 text-rose-300 mb-6" />
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Không tìm thấy thiệp</h1>
      <p className="text-stone-500 mb-8 text-center">Thiệp này không tồn tại hoặc đã bị xóa.</p>
      <Link href="/" className="px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors">
        ← Tạo thiệp mới
      </Link>
    </main>
  )
}
