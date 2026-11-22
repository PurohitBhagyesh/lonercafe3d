import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Sliders, 
  QrCode, 
  Copy, 
  Check, 
  X, 
  LogOut, 
  CloudRain, 
  Snowflake, 
  Sunset as SunsetIcon, 
  Moon, 
  Flower2, 
  Sunrise, 
  Sun, 
  CloudSun,
  Waves,
  Volume2,
  VolumeX,
  Compass,
  Camera,
  Eraser
} from 'lucide-react'
import QRCode from 'qrcode'
import { useGameStore, WeatherType, TimeOfDay, AmbientSoundType } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'
import { networkSync } from '../../services/networkSync'

const WEATHERS: Array<{ id: WeatherType; label: string; icon: React.ReactNode }> = [
  { id: 'rain', label: 'Rainy Day', icon: <CloudRain className="w-4 h-4" /> },
  { id: 'snow', label: 'Snowfall', icon: <Snowflake className="w-4 h-4" /> },
  { id: 'sunset', label: 'Golden Hour', icon: <SunsetIcon className="w-4 h-4" /> },
  { id: 'night', label: 'Midnight', icon: <Moon className="w-4 h-4" /> },
  { id: 'sakura', label: 'Spring Sakura', icon: <Flower2 className="w-4 h-4" /> },
]

const TIMES: Array<{ id: TimeOfDay; label: string; icon: React.ReactNode }> = [
  { id: 'dawn', label: 'Dawn', icon: <Sunrise className="w-4 h-4" /> },
  { id: 'noon', label: 'Noon', icon: <Sun className="w-4 h-4" /> },
  { id: 'sunset', label: 'Sunset', icon: <SunsetIcon className="w-4 h-4" /> },
  { id: 'twilight', label: 'Twilight', icon: <CloudSun className="w-4 h-4" /> },
  { id: 'midnight', label: 'Midnight', icon: <Moon className="w-4 h-4" /> },
]

const AMBIENT_SOUNDS: Array<{ id: AmbientSoundType; label: string; icon: string }> = [
  { id: 'auto', label: 'Match Weather', icon: '🌤️' },
  { id: 'rain-thunder', label: 'Rain & Thunder', icon: '🌧️' },
  { id: 'cafe-bustle', label: 'Cozy Café & Steam', icon: '☕' },
  { id: 'fireplace', label: 'Crackling Fireplace', icon: '🔥' },
  { id: 'sakura-chimes', label: 'Sakura & Wind Chimes', icon: '🌸' },
  { id: 'winter-wind', label: 'Blizzard Wind', icon: '❄️' },
  { id: 'midnight-crickets', label: 'Midnight Crickets', icon: '🌙' },
]

export function PauseMenu() {
  const { 
    gamePhase, 
    resumeGame, 
    quitToMenu, 
    worldCode, 
    worldName,
    weather,
    setWeather,
    timeOfDay,
    setTimeOfDay,
    reduceMotion,
    setReduceMotion,
    smoothAnimations,
    setSmoothAnimations,
    fov,
    setFov,
    mouseSensitivity,
    setMouseSensitivity,
    invertY,
    setInvertY,
    isMuted,
    toggleMute,
    selectedAmbient,
    setSelectedAmbient,
    masterVolume,
    ambientVolume,
    musicVolume,
    setVolume
  } = useGameStore()

  const [activeTab, setActiveTab] = useState<'main' | 'atmosphere' | 'invite' | 'settings'>('main')
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${worldCode}`

  useEffect(() => {
    if (activeTab === 'invite' && gamePhase === 'paused') {
      QRCode.toDataURL(shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#140c07',
          light: '#f7ede2'
        }
      }).then(setQrDataUrl).catch(console.error)
    }
  }, [activeTab, gamePhase, shareUrl])

  if (gamePhase !== 'paused') return null

  const handleResume = () => {
    soundEngine.playSitSound()
    resumeGame()
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      document.querySelector('canvas')?.requestPointerLock?.()
    }
  }

  const handleCopy = () => {
    soundEngine.playIpodClick()
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWeatherChange = (w: WeatherType) => {
    soundEngine.playIpodClick()
    setWeather(w)
    networkSync.broadcastWeatherSync(w, timeOfDay)
  }

  const handleTimeChange = (t: TimeOfDay) => {
    soundEngine.playIpodClick()
    setTimeOfDay(t)
    networkSync.broadcastWeatherSync(weather, t)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-[#f4ede4] select-none font-sans p-4">
      <div className="relative w-full max-w-lg bg-[#22150d]/95 p-6 sm:p-7 rounded-3xl border-2 border-[#452919] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2417] pb-3.5 mb-5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              Sanctuary Menu • {worldName}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              {activeTab === 'main' && 'Quiet Sanctuary'}
              {activeTab === 'atmosphere' && 'Atmosphere & Sky'}
              {activeTab === 'invite' && 'Invite Companions'}
              {activeTab === 'settings' && 'Comfort & Motion'}
            </h2>
          </div>
          <button
            onClick={handleResume}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
            title="Resume Sanctuary (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. MAIN TAB */}
        {activeTab === 'main' && (
          <div className="space-y-3">
            <button
              onClick={handleResume}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-serif font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Sanctuary [ESC]</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('atmosphere')
              }}
              className="w-full py-3 rounded-xl bg-[#2e1d13] hover:bg-[#3d2719] border border-[#523320] text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Atmosphere, Weather & Sounds</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('invite')
              }}
              className="w-full py-3 rounded-xl bg-[#2e1d13] hover:bg-[#3d2719] border border-[#523320] text-xs font-mono text-stone-300 hover:text-amber-200 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Invite Friends (PIN: {worldCode})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('settings')
              }}
              className="w-full py-3 rounded-xl bg-[#2e1d13] hover:bg-[#3d2719] border border-[#523320] text-xs font-mono text-stone-300 hover:text-white flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-stone-400" />
              <span>Camera & Motion Settings</span>
            </button>

            {/* Quick Actions (Polaroid & Window wipe) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  handleResume()
                  setTimeout(() => window.dispatchEvent(new CustomEvent('take-polaroid')), 300)
                }}
                className="py-2.5 bg-[#1e130c] hover:bg-[#2c1b11] border border-[#3d2417] rounded-xl text-xs font-mono text-stone-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Take Polaroid [P]</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  handleResume()
                  setTimeout(() => window.dispatchEvent(new CustomEvent('open-foggy-window')), 300)
                }}
                className="py-2.5 bg-[#1e130c] hover:bg-[#2c1b11] border border-[#3d2417] rounded-xl text-xs font-mono text-stone-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wipe Window</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                quitToMenu()
              }}
              className="w-full py-2.5 mt-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-mono text-red-300 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Quit to Title Screen</span>
            </button>
          </div>
        )}

        {/* 2. ATMOSPHERE & SKY TAB */}
        {activeTab === 'atmosphere' && (
          <div className="space-y-4 text-xs font-mono">
            {/* Weather Selector */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-2">
                Weather & Sky Effect:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WEATHERS.map((w) => {
                  const isActive = weather === w.id
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleWeatherChange(w.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 border-amber-300 text-white font-bold shadow'
                          : 'bg-[#180e08] hover:bg-[#29170e] border-[#3d2417] text-stone-300'
                      }`}
                    >
                      {w.icon}
                      <span>{w.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-2">
                Time of Day & Sunlight:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {TIMES.map((t) => {
                  const isActive = timeOfDay === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTimeChange(t.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 border-amber-300 text-white font-bold shadow'
                          : 'bg-[#180e08] hover:bg-[#29170e] border-[#3d2417] text-stone-300'
                      }`}
                    >
                      {t.icon}
                      <span className="text-[10px]">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Ambient Soundscapes */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-2">
                Background Ambient Soundscape:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AMBIENT_SOUNDS.map((amb) => {
                  const isCur = selectedAmbient === amb.id
                  return (
                    <button
                      key={amb.id}
                      onClick={() => {
                        soundEngine.playIpodClick()
                        setSelectedAmbient(amb.id)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition text-left cursor-pointer ${
                        isCur
                          ? 'bg-amber-700/80 border-amber-400 text-white font-bold'
                          : 'bg-[#180e08] hover:bg-[#29170e] border-[#3d2417] text-stone-300'
                      }`}
                    >
                      <span>{amb.icon}</span>
                      <span>{amb.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Master Audio Toggle */}
            <div className="flex items-center justify-between bg-[#150d08] p-3 rounded-xl border border-[#3d2417]">
              <div>
                <span className="font-bold text-amber-200 block">Master Audio</span>
                <span className="text-[10px] text-stone-400">
                  {isMuted ? 'All sounds muted' : 'Audio enabled and active'}
                </span>
              </div>
              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  toggleMute()
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  isMuted 
                    ? 'bg-red-950/80 border-red-500/60 text-red-300' 
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                }`}
              >
                {isMuted ? 'Muted (OFF)' : 'Active (ON)'}
              </button>
            </div>

            <button
              onClick={() => setActiveTab('main')}
              className="w-full py-2.5 bg-[#1f120a] hover:bg-[#2b190e] rounded-xl border border-[#3d2417] text-xs font-mono text-stone-300 mt-2 cursor-pointer"
            >
              Back to Sanctuary Menu
            </button>
          </div>
        )}

        {/* 3. INVITE TAB */}
        {activeTab === 'invite' && (
          <div className="space-y-4">
            <div className="bg-[#140b06] p-4 rounded-xl border border-[#3d2417] text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Your 6-Digit World PIN:
              </span>
              <div className="font-mono text-3xl tracking-widest text-amber-300 font-bold mb-1">
                {worldCode}
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Give this PIN to friends to visit your solitary café together.
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center bg-[#140b06] p-3 rounded-xl border border-[#3d2417]">
              <div className="bg-[#f7ede2] p-2 rounded-xl shadow mb-2">
                {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-32 h-32 rounded" />}
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                Scan with phone camera to join
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 bg-[#301c11] hover:bg-[#432717] rounded-xl border border-[#523320] text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Direct Link'}</span>
              </button>
              <button
                onClick={() => setActiveTab('main')}
                className="px-4 py-2 bg-[#1f120a] hover:bg-[#2b190e] rounded-xl border border-[#3d2417] text-xs font-mono text-stone-300 cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* 4. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-3.5 text-xs font-mono">
            {/* Smooth Animations */}
            <div className="flex items-center justify-between bg-[#140b06] p-3 rounded-xl border border-[#3d2417]">
              <div>
                <span className="font-bold text-amber-200 block">Smooth Animations & Damping</span>
                <span className="text-[10px] text-stone-400 block">
                  {smoothAnimations
                    ? 'Silky camera damping & walking inertia (Cinematic)'
                    : 'Snappy 1:1 camera & direct movement (Instant/Esports)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={smoothAnimations}
                onChange={(e) => setSmoothAnimations(e.target.checked)}
                className="accent-amber-500 w-5 h-5 cursor-pointer ml-3"
              />
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between bg-[#140b06] p-3 rounded-xl border border-[#3d2417]">
              <div>
                <span className="font-bold text-amber-200 block">Reduce Motion</span>
                <span className="text-[10px] text-stone-400 block">
                  Disables head bobbing & camera shake
                </span>
              </div>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="accent-amber-500 w-5 h-5 cursor-pointer ml-3"
              />
            </div>

            {/* FOV */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Field of View</span>
                <span>{fov}°</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={fov}
                onChange={(e) => setFov(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Sensitivity */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Look Sensitivity</span>
                <span className="text-amber-300 font-bold">{mouseSensitivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={mouseSensitivity}
                onChange={(e) => setMouseSensitivity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 mb-1.5"
              />
              <div className="flex gap-1.5 justify-between">
                {[
                  { label: 'Gentle (0.6x)', val: 0.6 },
                  { label: 'Normal (1.0x)', val: 1.0 },
                  { label: 'Smooth (1.5x)', val: 1.5 },
                  { label: 'Fast (2.2x)', val: 2.2 },
                ].map(p => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => {
                      soundEngine.playIpodClick()
                      setMouseSensitivity(p.val)
                    }}
                    className={`flex-1 py-1 text-[10px] rounded transition cursor-pointer ${
                      Math.abs(mouseSensitivity - p.val) < 0.05
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-[#25150d] text-stone-300 hover:bg-[#382115]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Invert Y */}
            <div className="flex items-center justify-between bg-[#140b06] p-2 rounded-lg border border-[#3d2417]">
              <span>Invert Y Axis</span>
              <input
                type="checkbox"
                checked={invertY}
                onChange={(e) => setInvertY(e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <button
              onClick={() => setActiveTab('main')}
              className="w-full py-2 bg-[#1f120a] hover:bg-[#2b190e] rounded-lg border border-[#3d2417] text-xs font-mono text-stone-300 mt-2 cursor-pointer"
            >
              Back to Sanctuary Menu
            </button>
          </div>
        )}

        <div className="text-center text-[10px] font-mono text-stone-500 mt-4">
          Press [ESC] again to instantly resume your sanctuary.
        </div>
      </div>
    </div>
  )
}
