import React, { useState, useEffect } from 'react'
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  QrCode, 
  Copy, 
  Check, 
  X, 
  Volume2, 
  Eye, 
  LogOut 
} from 'lucide-react'
import QRCode from 'qrcode'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function PauseMenu() {
  const { 
    gamePhase, 
    resumeGame, 
    quitToMenu, 
    worldCode, 
    worldName,
    reduceMotion,
    setReduceMotion,
    fov,
    setFov,
    mouseSensitivity,
    setMouseSensitivity,
    invertY,
    setInvertY,
    masterVolume,
    ambientVolume,
    musicVolume,
    setVolume
  } = useGameStore()

  const [activeTab, setActiveTab] = useState<'main' | 'invite' | 'settings'>('main')
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
    // Re-lock pointer
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-[#f4ede4] select-none font-sans">
      <div className="relative w-full max-w-md bg-[#22150d]/95 p-6 rounded-3xl border-2 border-[#452919] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2417] pb-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              Paused • {worldName}
            </span>
            <h2 className="font-serif text-xl font-bold text-white">
              Sanctuary Menu
            </h2>
          </div>
          <button
            onClick={handleResume}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'main' && (
          <div className="space-y-2.5">
            <button
              onClick={handleResume}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-serif font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Sanctuary [ESC]</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('invite')
              }}
              className="w-full py-3 rounded-xl bg-[#2e1d13] hover:bg-[#3d2719] border border-[#523320] text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Invite Companions (PIN & QR Code)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('settings')
              }}
              className="w-full py-3 rounded-xl bg-[#2e1d13] hover:bg-[#3d2719] border border-[#523320] text-xs font-mono text-stone-300 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Sliders className="w-4 h-4 text-stone-400" />
              <span>Comfort & Motion Settings</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                quitToMenu()
              }}
              className="w-full py-2.5 mt-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-mono text-red-300 flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Quit to Title Screen</span>
            </button>
          </div>
        )}

        {/* INVITE TAB (6-digit PIN & QR) */}
        {activeTab === 'invite' && (
          <div className="space-y-4">
            <div className="bg-[#140b06] p-3.5 rounded-xl border border-[#3d2417] text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Your 6-Digit World PIN:
              </span>
              <div className="font-mono text-3xl tracking-widest text-amber-300 font-bold mb-1">
                {worldCode}
              </div>
              <p className="text-[10px] text-stone-400 font-mono">
                Give this PIN to friends to join the exact same café.
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
                className="flex-1 py-2 bg-[#301c11] hover:bg-[#432717] rounded-lg border border-[#523320] text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Direct Link'}</span>
              </button>
              <button
                onClick={() => setActiveTab('main')}
                className="px-4 py-2 bg-[#1f120a] hover:bg-[#2b190e] rounded-lg border border-[#3d2417] text-xs font-mono text-stone-300"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-3.5 text-xs font-mono">
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
                <span>{mouseSensitivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={mouseSensitivity}
                onChange={(e) => setMouseSensitivity(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
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
              className="w-full py-2 bg-[#1f120a] hover:bg-[#2b190e] rounded-lg border border-[#3d2417] text-xs font-mono text-stone-300 mt-2"
            >
              Back to Menu
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
