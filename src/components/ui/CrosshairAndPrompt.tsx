import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { Sparkles, Hand } from 'lucide-react'

export function CrosshairAndPrompt() {
  const { activePrompt, promptAction, mode } = useGameStore()

  if (mode !== 'walking' && mode !== 'sitting') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
      {/* Center Subtle Crosshair Dot (only when walking) */}
      {mode === 'walking' && (
        <div className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
      )}

      {/* Dynamic Interaction Pill */}
      {activePrompt && (
        <div className="absolute bottom-24 sm:bottom-28 pointer-events-auto animate-bounce duration-1000">
          <button
            onClick={() => {
              if (promptAction) promptAction()
            }}
            className="flex items-center gap-2 bg-[#251710]/95 hover:bg-[#382318] text-[#f4ede4] px-5 py-2.5 rounded-full border border-amber-400/50 shadow-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <Hand className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-wide">
              {activePrompt}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
