"use client"

import { useRef, useState, useEffect } from "react"
import { PiMusicNoteFill, PiSpeakerSlashFill } from "react-icons/pi"
import { animate } from "animejs"

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [playing, setPlaying] = useState(false)

  // Entrance animation
  useEffect(() => {
    if (btnRef.current) {
      animate(btnRef.current, {
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 600,
        delay: 1500,
        ease: "out(4)",
      })
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
      // Pulse animation when starting
      if (btnRef.current) {
        animate(btnRef.current, {
          scale: [1, 1.2, 1],
          duration: 400,
          ease: "out(3)",
        })
      }
    }
  }

  // Auto-play on first user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      const audio = audioRef.current
      if (audio && !playing) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      document.removeEventListener("click", handleFirstClick)
    }
    document.addEventListener("click", handleFirstClick)
    return () => document.removeEventListener("click", handleFirstClick)
  }, [playing])

  const musicSrc = src || "/music.mp3"

  return (
    <>
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        style={{ opacity: 0 }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 shadow-lg flex items-center justify-center transition-all hover:bg-rose-50 hover:scale-110 cursor-pointer"
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
      >
        {playing ? (
          <PiMusicNoteFill className="w-5 h-5 text-rose-500" />
        ) : (
          <PiSpeakerSlashFill className="w-5 h-5 text-stone-400" />
        )}
      </button>
    </>
  )
}
