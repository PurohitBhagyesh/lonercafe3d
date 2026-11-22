import React, { useState } from 'react'
import { X, Users, Copy, Check, Sparkles, UserPlus, QrCode } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'
import { QRCodeModal } from './QRCodeModal'

export function FriendConnectModal() {
  const { mode, setMode, friendCode, connectedFriend, setConnectedFriend } = useGameStore()
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  if (mode !== 'friends') return null

  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${friendCode}`

  const handleCopy = () => {
    soundEngine.playIpodClick()
    const url = `${window.location.origin}${window.location.pathname}?room=${friendCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoin = () => {
    if (!joinCode.trim()) return
    soundEngine.playIpodClick()
    setConnectedFriend({
      id: joinCode.trim().toUpperCase(),
      name: `Companion (${joinCode.trim().toUpperCase()})`,
      position: [0.5, 0, -4.2], // Sits at the window counter
      state: 'sitting'
    })
    setMode('walking')
  }

  const handleAddQuietStranger = () => {
    soundEngine.playIpodClick()
    setConnectedFriend({
      id: 'quiet-stranger',
      name: 'Quiet Stranger (Reading Book)',
      position: [1.8, 0, -4.2], // Sits next to window
      state: 'sitting'
    })
    setMode('walking')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#251811] rounded-2xl p-6 shadow-2xl border-4 border-[#1c110b] flex flex-col text-[#f4ede4]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#432b1d]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium">Quiet Companionship</h3>
          </div>
          <button
            onClick={() => setMode('walking')}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed mb-4">
          Share this quiet sanctuary with a friend. You will see each other in the 3D café, sit by the window together, and enjoy the rain in peaceful silence without social pressure.
        </p>

        {/* Your Room Code Box */}
        <div className="bg-[#18100a] p-3.5 rounded-xl border border-[#3e2619] mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
            Your Sanctuary Room Code:
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xl tracking-widest text-amber-300 font-bold">
              {friendCode}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playIpodClick()
                  setShowQR(true)
                }}
                className="flex items-center gap-1.5 bg-[#402819] hover:bg-[#523320] text-xs font-mono text-amber-200 px-3 py-1.5 rounded-lg border border-[#6b452c] transition"
                title="Scan QR Code on Phone"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-[#402819] hover:bg-[#523320] text-xs font-mono text-[#f4ede4] px-3 py-1.5 rounded-lg border border-[#6b452c] transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Join a friend's room */}
        <div className="mb-4">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
            Or Join a Friend's Room:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter 4-letter code..."
              className="flex-1 bg-[#18100a] border border-[#3e2619] rounded-lg px-3 py-2 text-xs font-mono text-amber-200 uppercase tracking-widest focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleJoin}
              className="bg-[#402819] hover:bg-[#523320] px-4 py-2 rounded-lg text-xs font-mono font-bold transition"
            >
              Connect
            </button>
          </div>
        </div>

        {/* Quiet Stranger Option */}
        <div className="pt-3 border-t border-[#3e2619]">
          <button
            onClick={handleAddQuietStranger}
            className="w-full flex items-center justify-center gap-2 bg-[#2d1c13] hover:bg-[#3d271a] border border-[#523320] py-2.5 rounded-xl text-xs font-mono text-stone-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Invite a "Quiet Stranger" (AI Avatar)</span>
          </button>
          <p className="text-[10px] font-mono text-stone-400 text-center mt-2">
            Spawns a cozy silent visitor who sits at the window table with coffee so you don't feel entirely alone.
          </p>
        </div>
        {/* QR Code Modal for Phone connection */}
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={shareUrl}
        />
      </div>
    </div>
  )
}
