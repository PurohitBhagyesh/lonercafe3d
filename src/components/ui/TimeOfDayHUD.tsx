import React from 'react'
import { Sun, Sunset, Moon, Sunrise, CloudSun } from 'lucide-react'
import { useGameStore, TimeOfDay } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const TIMES: Array<{ id: TimeOfDay; label: string; icon: React.ReactNode; color: string }> = [
  { id: 'dawn', label: 'Dawn', icon: <Sunrise className="w-3.5 h-3.5" />, color: 'hover:text-rose-300' },
  { id: 'noon', label: 'Noon', icon: <Sun className="w-3.5 h-3.5" />, color: 'hover:text-yellow-300' },
  { id: 'sunset', label: 'Sunset', icon: <Sunset className="w-3.5 h-3.5" />, color: 'hover:text-amber-400' },
  { id: 'twilight', label: 'Twilight', icon: <CloudSun className="w-3.5 h-3.5" />, color: 'hover:text-indigo-300' },
  { id: 'midnight', label: 'Midnight', icon: <Moon className="w-3.5 h-3.5" />, color: 'hover:text-blue-300' },
]

export function TimeOfDayHUD() {
  const { timeOfDay, setTimeOfDay } = useGameStore()

  const handleSelect = (t: TimeOfDay) => {
    soundEngine.playIpodClick()
    setTimeOfDay(t)
  }

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#1a110a]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#4a3222]/60 shadow-lg">
      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-200/60 mr-1 hidden sm:inline">
        Time:
      </span>
      {TIMES.map((t) => {
        const isActive = timeOfDay === t.id
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono transition-all ${
              isActive
                ? 'bg-[#4a3222] text-amber-200 shadow font-bold scale-105'
                : `text-stone-300 hover:bg-white/10 ${t.color}`
            }`}
            title={t.label}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
