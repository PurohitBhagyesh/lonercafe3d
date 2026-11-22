import React, { useEffect, useState, useRef } from 'react'
import { X, Music, Sparkles, Volume2 } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

interface PianoKey {
  note: string
  freq: number
  isBlack?: boolean
  keyboardKey?: string
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', freq: 261.63, keyboardKey: 'A' },
  { note: 'C#4', freq: 277.18, isBlack: true, keyboardKey: 'W' },
  { note: 'D4', freq: 293.66, keyboardKey: 'S' },
  { note: 'D#4', freq: 311.13, isBlack: true, keyboardKey: 'E' },
  { note: 'E4', freq: 329.63, keyboardKey: 'D' },
  { note: 'F4', freq: 349.23, keyboardKey: 'F' },
  { note: 'F#4', freq: 369.99, isBlack: true, keyboardKey: 'T' },
  { note: 'G4', freq: 392.00, keyboardKey: 'G' },
  { note: 'G#4', freq: 415.30, isBlack: true, keyboardKey: 'Y' },
  { note: 'A4', freq: 440.00, keyboardKey: 'H' },
  { note: 'A#4', freq: 466.16, isBlack: true, keyboardKey: 'U' },
  { note: 'B4', freq: 493.88, keyboardKey: 'J' },
  { note: 'C5', freq: 523.25, keyboardKey: 'K' },
  { note: 'C#5', freq: 554.37, isBlack: true, keyboardKey: 'O' },
  { note: 'D5', freq: 587.33, keyboardKey: 'L' },
]

export function PianoModal() {
  const { mode, standUp } = useGameStore()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [isPlayingMelody, setIsPlayingMelody] = useState(false)
  const melodyTimeoutRef = useRef<number[]>([])

  if (mode !== 'piano') return null

  const playNote = (key: PianoKey) => {
    soundEngine.playPianoNote(key.freq)
    setActiveKey(key.note)
    setTimeout(() => setActiveKey(null), 180)
  }

  // Keyboard listeners for playing with PC keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Space') {
        soundEngine.playSitSound()
        standUp()
        return
      }

      const match = PIANO_KEYS.find(k => k.keyboardKey && `Key${k.keyboardKey}` === e.code)
      if (match) {
        playNote(match)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      melodyTimeoutRef.current.forEach(t => clearTimeout(t))
    }
  }, [standUp])

  // Play Satie's Gymnopédie No. 1 excerpt
  const playSatieMelody = () => {
    if (isPlayingMelody) return
    setIsPlayingMelody(true)

    // Gymnopédie theme sequence: [freq, delayMs]
    const notes: Array<[number, number]> = [
      [392.00, 0],     // G4
      [369.99, 900],   // F#4
      [329.63, 1800],  // E4
      [293.66, 2700],  // D4
      [349.23, 3600],  // F4
      [329.63, 4500],  // E4
      [293.66, 5400],  // D4
      [261.63, 6300],  // C4
    ]

    notes.forEach(([freq, delay]) => {
      const tid = window.setTimeout(() => {
        soundEngine.playPianoNote(freq)
      }, delay)
      melodyTimeoutRef.current.push(tid)
    })

    const endTid = window.setTimeout(() => {
      setIsPlayingMelody(false)
    }, 7500)
    melodyTimeoutRef.current.push(endTid)
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center pointer-events-none select-none">
      <div className="pointer-events-auto bg-[#25150d]/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-[#4d2f1d] shadow-2xl flex flex-col items-center max-w-2xl w-full mx-4 text-[#f4ede4]">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-[#3d2417]">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-sm font-bold text-amber-200">
              Walnut Upright Piano • Erik Satie Score
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playSatieMelody}
              disabled={isPlayingMelody}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-700/80 hover:bg-amber-600 text-white disabled:opacity-50 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPlayingMelody ? 'Playing...' : 'Play Satie Melody'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSitSound()
                standUp()
              }}
              className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
              title="Stand Up [ESC / Space]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Piano Keyboard */}
        <div className="relative flex justify-center bg-[#170e08] p-3 rounded-2xl border border-[#3d2417] shadow-inner overflow-x-auto w-full">
          <div className="relative flex">
            {/* White Keys */}
            {PIANO_KEYS.filter(k => !k.isBlack).map((key) => {
              const isActive = activeKey === key.note
              return (
                <button
                  key={key.note}
                  onClick={() => playNote(key)}
                  className={`w-10 sm:w-12 h-36 rounded-b-lg border border-stone-300 shadow transition-all active:scale-[0.98] flex flex-col justify-end items-center pb-2 ${
                    isActive
                      ? 'bg-amber-200 shadow-inner'
                      : 'bg-[#faf6ee] hover:bg-[#fffdfa]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-stone-700">
                    {key.keyboardKey}
                  </span>
                  <span className="text-[9px] font-mono text-stone-400">
                    {key.note}
                  </span>
                </button>
              )
            })}

            {/* Black Keys Positioned Above */}
            <div className="absolute top-0 left-0 right-0 flex pointer-events-none">
              {PIANO_KEYS.map((key, idx) => {
                if (!key.isBlack) return null
                const whiteIndex = PIANO_KEYS.slice(0, idx).filter(k => !k.isBlack).length
                const isActive = activeKey === key.note
                // Width of white key is approx 44px (average)
                return (
                  <button
                    key={key.note}
                    onClick={() => playNote(key)}
                    style={{
                      left: `calc(${whiteIndex} * 2.75rem - 0.85rem)`
                    }}
                    className={`pointer-events-auto absolute top-0 w-6 sm:w-7 h-22 rounded-b-md shadow-xl border border-stone-900 transition-all active:scale-[0.97] flex flex-col justify-end items-center pb-1.5 z-10 ${
                      isActive
                        ? 'bg-amber-600'
                        : 'bg-[#181818] hover:bg-[#282828]'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-amber-200">
                      {key.keyboardKey}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-stone-400 mt-2">
          Play with mouse clicks or keys: <strong className="text-amber-300">A S D F G H J K</strong> (Whites) & <strong className="text-amber-300">W E T Y U</strong> (Blacks) • Press [ESC] or Space to stand up.
        </div>
      </div>
    </div>
  )
}
