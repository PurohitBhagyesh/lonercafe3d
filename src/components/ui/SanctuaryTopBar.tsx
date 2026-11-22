import React, { useState } from 'react'
import { 
  CloudRain, 
  Snowflake, 
  Sunset as SunsetIcon, 
  Moon, 
  Flower2, 
  Sunrise, 
  Sun, 
  CloudSun,
  Sliders,
  Camera,
  Music,
  BookOpen,
  Coffee,
  Users,
  Armchair
} from 'lucide-react'
import { useGameStore, WeatherType, TimeOfDay } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'
import { QRCodeModal } from './QRCodeModal'

const WEATHERS: Array<{ id: WeatherType; label: string; icon: React.ReactNode }> = [
  { id: 'rain', label: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
  { id: 'snow', label: 'Snow', icon: <Snowflake className="w-3.5 h-3.5" /> },
  { id: 'sunset', label: 'Sunset', icon: <SunsetIcon className="w-3.5 h-3.5" /> },
  { id: 'night', label: 'Night', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'sakura', label: 'Sakura', icon: <Flower2 className="w-3.5 h-3.5" /> },
]

const TIMES: Array<{ id: TimeOfDay; label: string; icon: React.ReactNode }> = [
  { id: 'dawn', label: 'Dawn', icon: <Sunrise className="w-3.5 h-3.5" /> },
  { id: 'noon', label: 'Noon', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'sunset', label: 'Sunset', icon: <SunsetIcon className="w-3.5 h-3.5" /> },
  { id: 'twilight', label: 'Twilight', icon: <CloudSun className="w-3.5 h-3.5" /> },
  { id: 'midnight', label: 'Midnight', icon: <Moon className="w-3.5 h-3.5" /> },
]

export function SanctuaryTopBar() {
  const { 
    weather, 
    setWeather, 
    timeOfDay, 
    setTimeOfDay, 
    pauseGame, 
    mode, 
    setMode, 
    standUp,
    worldCode,
    connectedFriend
  } = useGameStore()

  const [showQR, setShowQR] = useState(false)

  const handleWeather = (w: WeatherType) => {
    soundEngine.playIpodClick()
    setWeather(w)
  }

  const handleTime = (t: TimeOfDay) => {
    soundEngine.playIpodClick()
    setTimeOfDay(t)
  }

  const handlePolaroid = () => {
    window.dispatchEvent(new CustomEvent('take-polaroid'))
  }

  return (
    <>
      <header className="fixed top-3 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 pointer-events-none select-none">
        
        {/* Left: Brand Watermark & Sanctuary Room Code */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#1b120c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#442c1d]/70 shadow-xl text-[#f4ede4]">
            <span className="font-serif text-xs font-bold tracking-wider text-amber-200">
              ☕ lonercafe3d
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playIpodClick()
              setShowQR(true)
            }}
            className="hidden sm:flex items-center gap-1.5 bg-[#1b120c]/80 hover:bg-[#322014] text-stone-300 hover:text-amber-200 px-3 py-1.5 rounded-full border border-[#442c1d]/60 shadow-lg backdrop-blur-md transition text-[11px] font-mono cursor-pointer"
            title="Invite Companion / View Room PIN"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>PIN: <strong className="text-amber-300">{worldCode}</strong></span>
            {connectedFriend && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            )}
          </button>
        </div>

        {/* Center: Unified Single-Row HUD (Sky Weather + Time of Day) */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-[#1b120c]/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-[#442c1d]/80 shadow-2xl text-[#f4ede4]">
          
          {/* Weather Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 mr-1 hidden xl:inline">
              Sky:
            </span>
            {WEATHERS.map((w) => {
              const isActive = weather === w.id
              return (
                <button
                  key={w.id}
                  onClick={() => handleWeather(w.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#4e3221] text-amber-200 shadow font-bold scale-105'
                      : 'text-stone-300 hover:bg-white/10'
                  }`}
                  title={`Weather: ${w.label}`}
                >
                  {w.icon}
                  <span className="hidden md:inline text-[11px]">{w.label}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="w-[1px] h-4 bg-[#4a3325] mx-0.5 sm:mx-1" />

          {/* Time of Day Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 mr-1 hidden xl:inline">
              Time:
            </span>
            {TIMES.map((t) => {
              const isActive = timeOfDay === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleTime(t.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#4e3221] text-amber-200 shadow font-bold scale-105'
                      : 'text-stone-300 hover:bg-white/10'
                  }`}
                  title={`Time: ${t.label}`}
                >
                  {t.icon}
                  <span className="hidden md:inline text-[11px]">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Quick Indie Tools + Stand Up / ESC Menu */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* If Sitting: prominent Stand Up button */}
          {mode === 'sitting' && (
            <button
              onClick={() => {
                soundEngine.playSitSound()
                standUp()
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono font-bold animate-pulse"
              title="Stand Up [Space]"
            >
              <Armchair className="w-3.5 h-3.5" />
              <span>Stand [Space]</span>
            </button>
          )}

          {/* Retro iPod Music quick button */}
          <button
            onClick={() => {
              soundEngine.playIpodClick()
              setMode('ipod')
            }}
            className="flex items-center gap-1 bg-[#1b120c]/85 hover:bg-[#342217] text-stone-300 hover:text-amber-200 p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#442c1d]/60 shadow-lg backdrop-blur-md transition active:scale-95 text-xs font-mono"
            title="Open iPod Player [M]"
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">iPod [M]</span>
          </button>

          {/* Polaroid Snapshot quick button */}
          <button
            onClick={handlePolaroid}
            className="flex items-center gap-1 bg-[#1b120c]/85 hover:bg-[#342217] text-stone-300 hover:text-amber-200 p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#442c1d]/60 shadow-lg backdrop-blur-md transition active:scale-95 text-xs font-mono"
            title="Capture Instant Polaroid [P]"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Photo [P]</span>
          </button>

          {/* Menu / ESC Button */}
          <button
            onClick={() => {
              soundEngine.playIpodClick()
              pauseGame()
            }}
            className="flex items-center gap-1.5 bg-[#2a170d]/90 hover:bg-[#3d2417] text-amber-200 px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono font-semibold"
            title="Pause & Sanctuary Settings [ESC]"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>Menu [ESC]</span>
          </button>
        </div>
      </header>

      {/* 6-Digit World PIN & QR Code Modal */}
      {showQR && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/?room=${worldCode}`}
        />
      )}
    </>
  )
}
