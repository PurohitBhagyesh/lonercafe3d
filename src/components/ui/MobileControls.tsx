import React, { useRef, useState, useEffect } from 'react'
import { 
  Armchair, 
  Move
} from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { touchState } from '../3d/PlayerController'
import { soundEngine } from '../../audio/soundEngine'

export function MobileControls() {
  const { 
    mode, 
    standUp, 
    promptAction
  } = useGameStore()

  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Only activate virtual joystick on genuine handheld mobile touchscreens (phones & tablets)
  useEffect(() => {
    const checkTouch = () => {
      // 1. NEVER show on desktop platforms (macOS, Windows, Linux, Safari Desktop, Chrome Desktop)
      const isDesktopUA = typeof navigator !== 'undefined' && 
        /Macintosh|Windows|Linux/i.test(navigator.userAgent) && 
        !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
      const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 1024

      if (isDesktopUA || (hasFinePointer && isLargeScreen)) {
        setIsTouchDevice(false)
        return
      }

      const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
      const isMobileUA = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent)

      // Strict check: Must be a mobile UA and coarse pointer on a small screen
      setIsTouchDevice(Boolean(hasTouch && (isCoarsePointer || isMobileUA) && !hasFinePointer))
    }

    // Dismiss instantly if any keyboard or mouse event occurs on desktop
    const onDesktopActivity = () => {
      setIsTouchDevice(false)
    }

    checkTouch()
    window.addEventListener('resize', checkTouch)
    window.addEventListener('keydown', onDesktopActivity, { once: true })
    window.addEventListener('mousemove', onDesktopActivity, { once: true })

    return () => {
      window.removeEventListener('resize', checkTouch)
      window.removeEventListener('keydown', onDesktopActivity)
      window.removeEventListener('mousemove', onDesktopActivity)
    }
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
      {/* Virtual Joystick (Handheld Mobile Only) */}
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

      {/* Right Contextual Action Button (Only show when prompt or sitting) */}
      <div className="pointer-events-auto absolute bottom-8 right-6 flex flex-col items-end">
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
        ) : promptAction ? (
          <button
            onClick={() => {
              promptAction()
            }}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 rounded-full border border-amber-300 shadow-xl backdrop-blur-md active:scale-95 transition animate-pulse"
          >
            <span className="text-xs font-mono font-bold">Interact [E]</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
