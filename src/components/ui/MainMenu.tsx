import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Users, 
  Sliders, 
  QrCode, 
  Copy, 
  Check, 
  Lock, 
  Volume2, 
  Eye, 
  ArrowRight, 
  Sparkles,
  RotateCcw,
  Shield,
  Smartphone
} from 'lucide-react'
import QRCode from 'qrcode'
import { useGameStore, KeyBindings } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function MainMenu() {
  const { 
    gamePhase, 
    startGame, 
    worldCode, 
    worldName, 
    worldPassword, 
    isWorldPrivate, 
    setWorldConfig,
    reduceMotion,
    setReduceMotion,
    fov,
    setFov,
    mouseSensitivity,
    setMouseSensitivity,
    invertY,
    setInvertY,
    keyBindings,
    setKeyBinding,
    masterVolume,
    ambientVolume,
    musicVolume,
    setVolume,
    setConnectedFriend
  } = useGameStore()

  const [activeTab, setActiveTab] = useState<'root' | 'create' | 'join' | 'settings'>('root')
  const [settingsSubTab, setSettingsSubTab] = useState<'controls' | 'motion' | 'audio'>('controls')
  const [joinCode, setJoinCode] = useState('')
  const [joinPass, setJoinPass] = useState('')
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [rebindingAction, setRebindingAction] = useState<keyof KeyBindings | null>(null)

  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${worldCode}`

  // Generate QR Code for sharing
  useEffect(() => {
    if (activeTab === 'create') {
      QRCode.toDataURL(shareUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#140c07',
          light: '#f7ede2'
        }
      }).then(setQrDataUrl).catch(console.error)
    }
  }, [activeTab, shareUrl])

  // Key rebinding listener
  useEffect(() => {
    if (!rebindingAction) return
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.code === 'Escape') {
        setRebindingAction(null)
        return
      }
      setKeyBinding(rebindingAction, e.code)
      setRebindingAction(null)
      soundEngine.playIpodClick()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [rebindingAction, setKeyBinding])

  if (gamePhase !== 'menu') return null

  const handleLaunch = () => {
    soundEngine.ensureStarted()
    soundEngine.playSitSound()
    startGame()
  }

  const handleJoinWorld = () => {
    if (!joinCode.trim()) return
    soundEngine.ensureStarted()
    soundEngine.playSitSound()
    setConnectedFriend({
      id: joinCode.trim(),
      name: `Companion #${joinCode.trim().slice(0, 4)}`,
      position: [0.5, 0, -4.2],
      state: 'sitting'
    })
    startGame()
  }

  const copyShareLink = () => {
    soundEngine.playIpodClick()
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md select-none text-[#f4ede4] font-sans">
      
      {/* Background vignette & subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-8">
        
        {/* Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d2719]/60 border border-[#8c532b]/40 text-amber-300 text-[11px] font-mono tracking-widest uppercase mb-3 shadow">
            <span>Stand-Alone 3D Experience</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#fbf6ef] drop-shadow-lg">
            LONER CAFÉ 3D
          </h1>
          <p className="font-serif italic text-stone-300 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
            A real-time physical sanctuary for solitary minds. Brew coffee, tend plants, listen to rain, and exist in peace.
          </p>
        </div>

        {/* Dynamic Panels */}
        {activeTab === 'root' && (
          <div className="max-w-md mx-auto space-y-3">
            <button
              onClick={handleLaunch}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-serif font-bold text-base tracking-wide shadow-2xl flex items-center justify-center gap-3 transition active:scale-[0.98] border border-amber-400/30"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Enter Sanctuary (Spawn)</span>
            </button>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  setActiveTab('create')
                }}
                className="py-3 px-4 rounded-xl bg-[#241710]/90 hover:bg-[#382318] border border-[#523522] text-xs font-mono tracking-wide text-amber-200 flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Create Custom World</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  setActiveTab('join')
                }}
                className="py-3 px-4 rounded-xl bg-[#241710]/90 hover:bg-[#382318] border border-[#523522] text-xs font-mono tracking-wide text-stone-300 flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <Users className="w-4 h-4 text-stone-400" />
                <span>Join by Code / PIN</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab('settings')
              }}
              className="w-full py-2.5 rounded-xl bg-[#19100a]/80 hover:bg-[#281910] border border-[#3d2417] text-stone-400 hover:text-stone-200 text-xs font-mono flex items-center justify-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Accessibility, Controls & Motion Settings</span>
            </button>
          </div>
        )}

        {/* CREATE WORLD PANEL */}
        {activeTab === 'create' && (
          <div className="bg-[#20140d]/95 p-6 rounded-2xl border-2 border-[#4a2e1d] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d2417] pb-3">
              <h2 className="font-serif text-lg font-bold text-amber-200">
                World Setup & Invitations
              </h2>
              <button
                onClick={() => setActiveTab('root')}
                className="text-xs font-mono text-stone-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Code & Security */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                    Sanctuary Name:
                  </label>
                  <input
                    type="text"
                    value={worldName}
                    onChange={(e) => setWorldConfig({ name: e.target.value })}
                    className="w-full bg-[#140b06] border border-[#3d2417] rounded-lg px-3 py-2 text-xs font-serif text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 6-Digit PIN display */}
                <div className="bg-[#140b06] p-3 rounded-xl border border-[#3d2417]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Your 6-Digit World PIN:
                  </span>
                  <div className="font-mono text-2xl tracking-widest text-amber-300 font-bold">
                    {worldCode}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Friends can enter this PIN on mobile or PC to join.
                  </span>
                </div>

                {/* Optional Passcode */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                    Optional Passcode Protection:
                  </label>
                  <input
                    type="password"
                    value={worldPassword}
                    onChange={(e) => setWorldConfig({ password: e.target.value })}
                    placeholder="Leave empty for open sanctuary..."
                    className="w-full bg-[#140b06] border border-[#3d2417] rounded-lg px-3 py-1.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Copy link */}
                <button
                  onClick={copyShareLink}
                  className="w-full py-2 bg-[#301c11] hover:bg-[#432717] rounded-lg border border-[#523320] text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Direct Share Link'}</span>
                </button>
              </div>

              {/* Right Column: QR Code */}
              <div className="flex flex-col items-center justify-center bg-[#140b06] p-4 rounded-xl border border-[#3d2417]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-2">
                  Scan to Play on Mobile:
                </span>
                <div className="bg-[#f7ede2] p-2 rounded-xl shadow-inner border border-amber-400/40">
                  {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-36 h-36 rounded" />}
                </div>
                <span className="text-[10px] font-mono text-stone-500 text-center mt-2">
                  Instant touch controls on iOS / Android
                </span>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-serif font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <span>Spawn Into Sanctuary Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* JOIN WORLD PANEL */}
        {activeTab === 'join' && (
          <div className="max-w-md mx-auto bg-[#20140d]/95 p-6 rounded-2xl border-2 border-[#4a2e1d] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d2417] pb-3">
              <h2 className="font-serif text-lg font-bold text-amber-200">
                Join an Existing Sanctuary
              </h2>
              <button
                onClick={() => setActiveTab('root')}
                className="text-xs font-mono text-stone-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Enter 6-Digit World PIN:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 748291"
                  className="w-full bg-[#140b06] border border-[#3d2417] rounded-xl px-4 py-2.5 text-center font-mono text-2xl tracking-[0.25em] text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  World Password (if required):
                </label>
                <input
                  type="password"
                  value={joinPass}
                  onChange={(e) => setJoinPass(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-[#140b06] border border-[#3d2417] rounded-lg px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              onClick={handleJoinWorld}
              disabled={joinCode.length < 4}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-serif font-bold text-sm rounded-xl shadow-lg transition active:scale-[0.98]"
            >
              Connect to Companion's World
            </button>
          </div>
        )}

        {/* SETTINGS PANEL (Reduce Motion, Rebind Keys, Audio) */}
        {activeTab === 'settings' && (
          <div className="bg-[#20140d]/95 p-6 rounded-2xl border-2 border-[#4a2e1d] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d2417] pb-3">
              <h2 className="font-serif text-lg font-bold text-amber-200">
                Sanctuary Settings & Accessibility
              </h2>
              <button
                onClick={() => setActiveTab('root')}
                className="text-xs font-mono text-stone-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 border-b border-[#3d2417] pb-2 text-xs font-mono">
              <button
                onClick={() => setSettingsSubTab('controls')}
                className={`px-3 py-1 rounded-md transition ${settingsSubTab === 'controls' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Keyboard & Mouse
              </button>
              <button
                onClick={() => setSettingsSubTab('motion')}
                className={`px-3 py-1 rounded-md transition ${settingsSubTab === 'motion' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Motion & Comfort
              </button>
              <button
                onClick={() => setSettingsSubTab('audio')}
                className={`px-3 py-1 rounded-md transition ${settingsSubTab === 'audio' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Audio Mixer
              </button>
            </div>

            {/* Controls Tab */}
            {settingsSubTab === 'controls' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(keyBindings).map(([action, key]) => (
                    <div key={action} className="flex items-center justify-between bg-[#140b06] p-2 rounded-lg border border-[#3d2417]">
                      <span className="capitalize text-stone-400">{action}:</span>
                      <button
                        onClick={() => setRebindingAction(action as keyof KeyBindings)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-bold ${rebindingAction === action ? 'bg-amber-500 text-black border-amber-300 animate-pulse' : 'bg-[#2a170d] text-amber-200 border-[#523320]'}`}
                      >
                        {rebindingAction === action ? 'Press key...' : key.replace('Key', '')}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sensitivity & Invert Y */}
                <div className="pt-2 border-t border-[#3d2417] space-y-2">
                  <div className="flex justify-between text-xs font-mono">
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

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span>Invert Y Axis (Flight-style)</span>
                    <input
                      type="checkbox"
                      checked={invertY}
                      onChange={(e) => setInvertY(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Motion & Comfort Tab */}
            {settingsSubTab === 'motion' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between bg-[#140b06] p-3 rounded-xl border border-[#3d2417]">
                  <div>
                    <span className="font-bold text-amber-200 block mb-0.5">Reduce Motion (Comfort Mode)</span>
                    <span className="text-[11px] text-stone-400 block">
                      Disables head bobbing, camera tilting, and screen rain streaks for motion sensitivity.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => setReduceMotion(e.target.checked)}
                    className="accent-amber-500 w-5 h-5 cursor-pointer ml-4"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Field of View (FOV)</span>
                    <span>{fov}°</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    step="1"
                    value={fov}
                    onChange={(e) => setFov(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-stone-500">
                    Narrower FOV gives a cinematic view; wider FOV gives spatial awareness.
                  </span>
                </div>
              </div>
            )}

            {/* Audio Tab */}
            {settingsSubTab === 'audio' && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Master Sound</span>
                    <span>{Math.round(masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={masterVolume}
                    onChange={(e) => setVolume('master', parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Rain & Ambience</span>
                    <span>{Math.round(ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => setVolume('ambient', parseFloat(e.target.value))}
                    className="w-full accent-blue-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>iPod & Lo-Fi Music</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setVolume('music', parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] font-mono text-stone-500 mt-6">
          Press [ESC] at any time during gameplay to pause, tweak settings, or access world QR code.
        </div>
      </div>
    </div>
  )
}
