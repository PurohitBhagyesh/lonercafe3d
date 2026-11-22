import React, { useRef, useEffect, useState } from 'react'
import { Eraser, X, Sparkles, RefreshCw } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function FoggyWindowOverlay() {
  const { weather, mode } = useGameStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize condensation canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Steamed frosted condensation wash
    ctx.fillStyle = 'rgba(215, 230, 245, 0.65)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Condensation grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    for (let i = 0; i < 200; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 8, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [isOpen])

  if (!isOpen) {
    // Only show button if near window / raining / sitting at window stool
    if (weather !== 'rain' && weather !== 'snow') return null
    return (
      <button
        onClick={() => {
          soundEngine.playIpodClick()
          setIsOpen(true)
        }}
        className="fixed top-24 left-6 z-30 flex items-center gap-2 bg-[#20150e]/85 hover:bg-[#342217] text-[#f4ede4] px-3.5 py-2 rounded-full border border-blue-400/30 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono"
      >
        <Eraser className="w-4 h-4 text-cyan-300" />
        <span>Wipe Steamy Window</span>
      </button>
    )
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true
    wipeAt(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    wipeAt(e.clientX, e.clientY)
  }

  const handlePointerUp = () => {
    isDrawing.current = false
  }

  const wipeAt = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear transparent circle to reveal outdoor 3D scene below!
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 45, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  const resetFog = () => {
    soundEngine.playIpodClick()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'rgba(215, 230, 245, 0.65)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="fixed inset-0 z-40 select-none">
      {/* Wipeable condensation canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-crosshair"
      />

      {/* Top Floating Controls */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#18110b]/90 px-4 py-2 rounded-full border border-white/20 shadow-2xl backdrop-blur-md text-xs font-mono text-[#f4ede4]">
        <span>✨ Drag finger or mouse to wipe window condensation</span>
        <button
          onClick={resetFog}
          className="flex items-center gap-1 bg-[#322014] hover:bg-[#482e1d] px-2.5 py-1 rounded-full text-[11px] transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Fog Again</span>
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
