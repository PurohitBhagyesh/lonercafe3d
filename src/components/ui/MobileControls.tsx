import React, { useRef, useState, useEffect } from 'react'
import { 
  Armchair, 
  BookOpen, 
  Music, 
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
    promptAction
  } = useGameStore()

  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Only activate virtual joystick on genuine mobile touchscreens (phones & tablets)
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
      const isMobileUA = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 1024

      // STRICT CHECK: Must have touch capability AND be a coarse pointer (finger touch) or mobile user agent
      setIsTouchDevice(hasTouch && (isCoarsePointer || isMobileUA) && isSmallScreen)
    }

    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  // Joystick touch tracking
  const joystickBaseRef = useRef<HTMLDivElement>(null)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const isDraggingJoystick = useRef(false)
  const joystickTouchId = useRef<number | null>(null)

  // Look touch tracking
  const lookTouchId = useRef<number | null>(null)
  const lastLookPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!isTouchDevice) return

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
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
  }, [isTouchDevice])

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

  // Never render mobile joystick on desktop Safari / Chrome!
  if (!isTouchDevice) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Virtual Joystick (Mobile Only) */}
      {mode === 'walking' && (
        <div
          ref={joystickBaseRef}
          onTouchStart={onJoystickTouchStart}
          onTouchMove={onJoystickTouchMove}
          onTouchEnd={onJoystickTouchEnd}
          onTouchCancel={onJoystickTouchEnd}
          className="pointer-events-auto absolute bottom-8 left-6 w-28 h-28 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center touch-none shadow-2xl"
        >
          <div
            className="w-12 h-12 rounded-full bg-amber-600/95 border border-white/50 shadow-md flex items-center justify-center transition-transform"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          >
            <Move className="w-5 h-5 text-white/90" />
          </div>
        </div>
      )}

      {/* Right Quick Action Mobile Buttons */}
      <div className="pointer-events-auto absolute bottom-8 right-6 flex flex-col gap-2.5 items-end">
        {mode === 'sitting' ? (
          <button
            onClick={() => {
              soundEngine.playSitSound()
              standUp()
            }}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 rounded-full border border-amber-300 shadow-xl backdrop-blur-md active:scale-95 transition"
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
    </div>
  )
}
