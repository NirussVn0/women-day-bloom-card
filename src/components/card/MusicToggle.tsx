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
  const [volume, setVolume] = useState(0.6)
  const [showVolumeTip, setShowVolumeTip] = useState(false)
  const hideTipTimeout = useRef<NodeJS.Timeout | null>(null)

  // Sync volume state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleWheel = (e: React.WheelEvent) => {
    if (!audioRef.current) return
    
    // Prevent page scrolling while adjusting volume
    e.preventDefault()
    
    // e.deltaY > 0 means scrolling down (decrease volume)
    // e.deltaY < 0 means scrolling up (increase volume)
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    const newVolume = Math.min(Math.max(0, volume + delta), 1)
    
    setVolume(newVolume)
    setShowVolumeTip(true)
    
    // Auto-hide volume tip after 1.5s
    if (hideTipTimeout.current) clearTimeout(hideTipTimeout.current)
    hideTipTimeout.current = setTimeout(() => setShowVolumeTip(false), 1500)
    
    // Auto-play if unmuted via scroll
    if (newVolume > 0 && !playing && audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <div 
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col items-center gap-2"
      onWheel={handleWheel}
    >
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        style={{ opacity: 0 }}
        className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 shadow-lg flex items-center justify-center transition-all hover:bg-rose-50 hover:scale-110 cursor-pointer"
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
        title="Cuộn chuột để chỉnh âm lượng"
      >
        {playing && volume > 0 ? (
          <PiMusicNoteFill className="w-5 h-5 text-rose-500" />
        ) : (
          <PiSpeakerSlashFill className="w-5 h-5 text-stone-400" />
        )}
      </button>

      {/* Volume indicator tooltip */}
      <div 
        className={`px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow border border-stone-100 text-xs font-medium text-stone-600 transition-opacity duration-300 pointer-events-none ${showVolumeTip ? 'opacity-100' : 'opacity-0'}`}
      >
        {Math.round(volume * 100)}%
      </div>
    </div>
  )
}

