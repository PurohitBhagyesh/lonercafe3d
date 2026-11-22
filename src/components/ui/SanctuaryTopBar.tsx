import React, { useState } from 'react'
import { 
  Users, 
  Armchair, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sliders, 
  Bot 
} from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'
import { QRCodeModal } from './QRCodeModal'
import { voiceService } from '../../services/voiceService'
import { aiCompanion } from '../../services/aiCompanion'

export function SanctuaryTopBar() {
  const { 
    pauseGame, 
    mode, 
    standUp,
    worldCode, 
    connectedFriend, 
    isMuted, 
    toggleMute,
    isMicActive,
    isAiCompanionActive,
    toggleAiCompanion,
    coopStatus
  } = useGameStore()

  const [showQR, setShowQR] = useState(false)

  const isCoop = Boolean(connectedFriend || coopStatus === 'connected' || isAiCompanionActive)

  const handleToggleAi = () => {
    soundEngine.playIpodClick()
    if (isAiCompanionActive) {
      aiCompanion.stop()
      toggleAiCompanion(false)
    } else {
      toggleAiCompanion(true)
      aiCompanion.start()
    }
  }

  return (
    <>
      <header className="fixed top-3 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 pointer-events-none select-none">
        
        {/* Left: Artisanal Brand Watermark & Co-Op Info (if active) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#1b120c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#442c1d]/70 shadow-xl text-[#f4ede4]">
            <span className="font-serif text-xs font-bold tracking-wider text-amber-200">
              ☕ lonercafe3d
            </span>
          </div>

          {/* Room PIN & Companion Indicator (Only shown when in Co-Op) */}
          {isCoop && (
            <button
              onClick={() => {
                soundEngine.playIpodClick()
                setShowQR(true)
              }}
              className="flex items-center gap-1.5 bg-[#1b120c]/85 hover:bg-[#322014] text-stone-300 hover:text-amber-200 px-3 py-1.5 rounded-full border border-[#442c1d]/60 shadow-lg backdrop-blur-md transition text-[11px] font-mono cursor-pointer"
              title="View Room PIN & Invite Link"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>PIN: <strong className="text-amber-300">{worldCode}</strong></span>
              {connectedFriend && (
                <span className={`w-2 h-2 rounded-full ${connectedFriend.isAi ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse ml-1`} />
              )}
            </button>
          )}

          {/* AI Resident Companion Maya Toggle (Subtle icon in solo or coop) */}
          <button
            onClick={handleToggleAi}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition text-[11px] font-mono cursor-pointer active:scale-95 ${
              isAiCompanionActive
                ? 'bg-amber-900/90 text-amber-200 border-amber-400'
                : 'bg-[#1b120c]/70 hover:bg-[#322014] text-stone-400 hover:text-amber-200 border-[#442c1d]/50'
            }`}
            title={isAiCompanionActive ? 'Dismiss AI Companion Maya' : 'Summon AI Companion Maya to visit'}
          >
            <Bot className={`w-3.5 h-3.5 ${isAiCompanionActive ? 'text-amber-300' : 'text-stone-400'}`} />
            <span>{isAiCompanionActive ? 'Maya' : '+ Companion'}</span>
          </button>
        </div>

        {/* Center: Intentionally EMPTY for pure cinematic view (No bunch of options!) */}
        <div className="hidden" />

        {/* Right: Clean Controls (Audio ON/OFF, Mic ON/OFF if coop, Stand up, Menu [ESC]) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          
          {/* 1-Click Master AUDIO Sound ON / OFF Toggle */}
          <button
            onClick={() => {
              soundEngine.playIpodClick()
              toggleMute()
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition active:scale-95 text-xs font-mono cursor-pointer ${
              isMuted
                ? 'bg-red-950/85 border-red-500/60 text-red-300 shadow-red-950/40'
                : 'bg-[#1b120c]/85 hover:bg-[#342217] text-stone-200 hover:text-amber-200 border-[#442c1d]/60'
            }`}
            title={isMuted ? 'Turn Sound ON [V]' : 'Turn Sound OFF [V]'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span className="font-bold">
              {isMuted ? 'Audio OFF' : 'Audio ON'}
            </span>
            <span className="opacity-50 text-[10px] hidden md:inline">[V]</span>
          </button>

          {/* 1-Click Real MICROPHONE ON / OFF Toggle (STRICT: ONLY if in Co-Op!) */}
          {isCoop && (
            <button
              onClick={async () => {
                soundEngine.playIpodClick()
                await voiceService.toggleMic()
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition active:scale-95 text-xs font-mono font-bold cursor-pointer ${
                isMicActive
                  ? 'bg-emerald-600/90 text-white border-emerald-300 shadow-emerald-900/50'
                  : 'bg-[#1b120c]/85 text-stone-300 border-[#442c1d]/60 hover:bg-[#342217]'
              }`}
              title={isMicActive ? 'Turn Microphone OFF' : 'Turn Microphone ON'}
            >
              {isMicActive ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Mic ON</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>Mic OFF</span>
                </>
              )}
            </button>
          )}

          {/* If Sitting: prominent Stand Up button */}
          {mode === 'sitting' && (
            <button
              onClick={() => {
                soundEngine.playSitSound()
                standUp()
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono font-bold animate-pulse cursor-pointer"
              title="Stand Up [Space]"
            >
              <Armchair className="w-3.5 h-3.5" />
              <span>Stand [Space]</span>
            </button>
          )}

          {/* Menu / ESC Button (Opens settings, atmosphere, music, and options) */}
          <button
            onClick={() => {
              soundEngine.playIpodClick()
              pauseGame()
            }}
            className="flex items-center gap-1.5 bg-[#2a170d]/90 hover:bg-[#3d2417] text-amber-200 px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono font-semibold cursor-pointer"
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
