import React, { useRef, useState, useEffect } from 'react'
import { 
  Armchair, 
  BookOpen, 
  Music, 
  Coffee, 
  Sliders, 
  Users, 
  HandMetal,
  Move
} from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { touchState } from '../3d/PlayerController'
import { soundEngine } from '../../audio/soundEngine'

export function MobileControls() {
  const { 
    mode, 
    setMode, 
    currentSittingSpot, 
    standUp, 
    sitDown, 
    heldItem, 
    setHeldItem, 
    placeItemOnTable, 
    activePrompt,
    promptAction
  } = useGameStore()

  // Joystick touch tracking
  const joystickBaseRef = useRef<HTMLDivElement>(null)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const isDraggingJoystick = useRef(false)
  const joystickTouchId = useRef<number | null>(null)

  // Look touch tracking
  const lookTouchId = useRef<number | null>(null)
  const lastLookPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        // Check if touch is on right side of screen (for looking)
        if (touch.clientX > window.innerWidth * 0.45 && lookTouchId.current === null) {
          lookTouchId.current = touch.identifier
          lastLookPos.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        if (touch.identifier === lookTouchId.current) {
          const dx = touch.clientX - lastLookPos.current.x
          const dy = touch.clientY - lastLookPos.current.y
          touchState.lookDeltaX += dx
          touchState.lookDeltaY += dy
          lastLookPos.current = { x: touch.clientX, y: touch.clientY }
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        if (touch.identifier === lookTouchId.current) {
          lookTouchId.current = null
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [])

  // Joystick touch handlers
  const onJoystickTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    joystickTouchId.current = touch.identifier
    isDraggingJoystick.current = true
    updateJoystick(touch.clientX, touch.clientY)
  }

  const onJoystickTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingJoystick.current) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier === joystickTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY)
      }
    }
  }

  const onJoystickTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier === joystickTouchId.current) {
        isDraggingJoystick.current = false
        joystickTouchId.current = null
        setKnobPos({ x: 0, y: 0 })
        touchState.moveX = 0
        touchState.moveY = 0
      }
    }
  }

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return
    const rect = joystickBaseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    let dx = clientX - centerX
    let dy = clientY - centerY
    const dist = Math.hypot(dx, dy)
    const maxDist = 45

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist
      dy = (dy / dist) * maxDist
    }

    setKnobPos({ x: dx, y: dy })
    touchState.moveX = dx / maxDist
    touchState.moveY = dy / maxDist
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* 1. Left Virtual Joystick (only when walking) */}
      {mode === 'walking' && (
        <div
          ref={joystickBaseRef}
          onTouchStart={onJoystickTouchStart}
          onTouchMove={onJoystickTouchMove}
          onTouchEnd={onJoystickTouchEnd}
          onTouchCancel={onJoystickTouchEnd}
          className="pointer-events-auto absolute bottom-8 left-6 w-28 h-28 rounded-full bg-black/35 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center touch-none shadow-lg"
        >
          {/* Knob */}
          <div
            className="w-12 h-12 rounded-full bg-amber-500/80 border border-white/50 shadow flex items-center justify-center transition-transform"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          >
            <Move className="w-5 h-5 text-white/80" />
          </div>
        </div>
      )}

      {/* 2. Right Quick Action Buttons */}
      <div className="pointer-events-auto absolute bottom-8 right-6 flex flex-col gap-2.5 items-end">
        {/* Sit / Stand button */}
        {mode === 'sitting' ? (
          <button
            onClick={() => {
              soundEngine.playSitSound()
              standUp()
            }}
            className="flex items-center gap-2 bg-amber-600/90 text-white px-4 py-2.5 rounded-full border border-amber-300 shadow-xl backdrop-blur-md active:scale-95 transition"
          >
            <Armchair className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">Stand Up</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (promptAction) {
                promptAction()
              } else {
                soundEngine.playSitSound()
                sitDown({
                  id: 'window-seat',
                  name: 'Window Stool',
                  seatPosition: [-1.8, 0.65, -4.2],
                  cameraPosition: [-1.8, 1.25, -4.2],
                  lookAt: [-1.8, 1.35, -12]
                })
              }
            }}
            className="flex items-center gap-2 bg-[#2d1c13]/90 text-amber-200 px-3.5 py-2 rounded-full border border-[#8c6b53]/50 shadow-lg backdrop-blur-md active:scale-95 transition"
          >
            <Armchair className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono">Sit</span>
          </button>
        )}

        {/* Quick Open Diary */}
        <button
          onClick={() => {
            soundEngine.playPageFlip()
            setMode('writing')
          }}
          className="flex items-center gap-2 bg-[#2d1c13]/90 text-stone-200 px-3.5 py-2 rounded-full border border-[#8c6b53]/50 shadow-lg backdrop-blur-md active:scale-95 transition"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono">Diary</span>
        </button>

        {/* Quick Open iPod */}
        <button
          onClick={() => {
            soundEngine.playIpodClick()
            setMode('ipod')
          }}
          className="flex items-center gap-2 bg-[#2d1c13]/90 text-stone-200 px-3.5 py-2 rounded-full border border-[#8c6b53]/50 shadow-lg backdrop-blur-md active:scale-95 transition"
        >
          <Music className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono">iPod</span>
        </button>
      </div>

      {/* 3. Top Right Utility Bar (Friends & Settings) */}
      <div className="pointer-events-auto absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={() => {
            soundEngine.playIpodClick()
            setMode('friends')
          }}
          className="p-2.5 rounded-full bg-[#22160e]/85 hover:bg-[#382318] text-amber-200 border border-[#593d2b]/60 shadow-lg backdrop-blur-md transition"
          title="Quiet Companionship / Friends"
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playIpodClick()
            setMode('settings')
          }}
          className="p-2.5 rounded-full bg-[#22160e]/85 hover:bg-[#382318] text-stone-200 border border-[#593d2b]/60 shadow-lg backdrop-blur-md transition"
          title="Settings & Audio Mixer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
