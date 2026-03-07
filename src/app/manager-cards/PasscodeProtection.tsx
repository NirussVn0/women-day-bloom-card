"use client"

import { useState, useTransition } from "react"
import { PiLockKeyBold, PiArrowRightBold, PiSpinnerBold } from "react-icons/pi"
import { verifyAdminPasscode } from "@/lib/actions"

export default function PasscodeProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      const isValid = await verifyAdminPasscode(passcode)
      if (isValid) {
        setIsAuthenticated(true)
        setError(false)
      } else {
        setError(true)
        setPasscode("")
      }
    })
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#fae1dd" }}>
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-sm w-full border border-rose-100 text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <PiLockKeyBold className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Trang Quản Trị</h2>
        <p className="text-stone-500 text-sm mb-8">Vui lòng nhập mã bảo mật để xem danh sách thiệp.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Nhập mã bảo mật..."
              className={`w-full px-4 py-3 rounded-xl border outline-none text-center tracking-[0.2em] font-mono transition-colors ${
                error ? "border-red-300 bg-red-50 text-red-600 focus:border-red-400" : "border-stone-200 focus:border-rose-400 bg-stone-50/50"
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 font-medium">Mã bảo mật không đúng!</p>}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? "Đang kiểm tra..." : "Xác nhận"}
            {isPending ? <PiSpinnerBold className="animate-spin" /> : <PiArrowRightBold />}
          </button>
        </form>
      </div>
    </div>
  )
}
