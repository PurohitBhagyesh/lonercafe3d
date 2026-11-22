import React from 'react'
import { CloudRain, Snowflake, Sunset, Moon, Flower2 } from 'lucide-react'
import { useGameStore, WeatherType } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const WEATHERS: Array<{ id: WeatherType; label: string; icon: React.ReactNode; color: string }> = [
  { id: 'rain', label: 'Rainy Day', icon: <CloudRain className="w-4 h-4" />, color: 'hover:text-blue-300' },
  { id: 'snow', label: 'Snowfall', icon: <Snowflake className="w-4 h-4" />, color: 'hover:text-cyan-200' },
  { id: 'sunset', label: 'Golden Hour', icon: <Sunset className="w-4 h-4" />, color: 'hover:text-amber-400' },
  { id: 'night', label: 'Midnight Stars', icon: <Moon className="w-4 h-4" />, color: 'hover:text-purple-300' },
  { id: 'sakura', label: 'Spring Breeze', icon: <Flower2 className="w-4 h-4" />, color: 'hover:text-pink-300' },
]

export function WeatherControlHUD() {
  const { weather, setWeather } = useGameStore()

  const handleSelect = (w: WeatherType) => {
    soundEngine.playIpodClick()
    setWeather(w)
  }

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-2 bg-[#22160e]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#593d2b]/60 shadow-xl">
      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/70 mr-1 hidden sm:inline">
        Weather:
      </span>
      {WEATHERS.map((w) => {
        const isActive = weather === w.id
        return (
          <button
            key={w.id}
            onClick={() => handleSelect(w.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
              isActive
                ? 'bg-[#593d2b] text-amber-200 shadow font-bold scale-105'
                : `text-stone-300 hover:bg-white/10 ${w.color}`
            }`}
            title={w.label}
          >
            {w.icon}
            <span className="hidden md:inline">{w.label}</span>
          </button>
        )
      })}
    </div>
  )
}
