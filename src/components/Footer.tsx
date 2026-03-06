"use client"

import { FaGithub, FaXTwitter } from "react-icons/fa6"
import { PiFlowerTulipFill } from "react-icons/pi"

export function Footer() {
  return (
    <footer className="relative z-20 py-6 px-4 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <a
          href="https://github.com/NirussVn0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="GitHub"
        >
          <FaGithub className="w-5 h-5" />
        </a>
        <a
          href="https://x.com/NirussVn0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="X (Twitter)"
        >
          <FaXTwitter className="w-5 h-5" />
        </a>
      </div>
      <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
        <PiFlowerTulipFill className="w-3.5 h-3.5 text-rose-400" />
        <span>&copy; 2026 NirussVn0 DEV. Made with love.</span>
      </p>
    </footer>
  )
}
