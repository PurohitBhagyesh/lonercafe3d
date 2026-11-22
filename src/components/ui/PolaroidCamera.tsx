import React, { useState } from 'react'
import { Camera, X, Download, Sparkles } from 'lucide-react'
import { soundEngine } from '../../audio/soundEngine'
import { useGameStore } from '../../store/gameStore'

export function PolaroidCamera() {
  const { mode } = useGameStore()
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)

  const capturePhoto = () => {
    soundEngine.playCameraShutter()
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setSnapshotUrl(dataUrl)
  }

  return (
    <>
      {/* Floating Shutter Button in bottom corner (when playing) */}
      <button
        onClick={capturePhoto}
        className="fixed bottom-6 right-24 z-30 flex items-center gap-2 bg-[#251710]/90 hover:bg-[#382318] text-[#f4ede4] px-3.5 py-2 rounded-full border border-amber-400/30 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-mono"
        title="Capture Polaroid Photo [P]"
      >
        <Camera className="w-4 h-4 text-amber-300" />
        <span className="hidden sm:inline">Polaroid</span>
      </button>

      {/* Polaroid Photo Modal */}
      {snapshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative bg-[#fcf9f2] p-4 pb-8 rounded-lg shadow-2xl border border-stone-300 max-w-sm w-full flex flex-col items-center rotate-[-1.5deg] animate-in fade-in zoom-in duration-300">
            {/* Close button */}
            <button
              onClick={() => setSnapshotUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#3d2417] text-white flex items-center justify-center shadow-lg hover:bg-[#523320] transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo frame */}
            <div className="w-full aspect-[4/3] bg-black overflow-hidden rounded shadow-inner mb-4">
              <img src={snapshotUrl} alt="Sanctuary Snapshot" className="w-full h-full object-cover" />
            </div>

            {/* Polaroid handwritten caption */}
            <div className="w-full flex items-center justify-between px-2 text-[#3a271d]">
              <span className="font-handwriting text-xl">
                A quiet hour • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <a
                href={snapshotUrl}
                download="lonercafe3d-polaroid.jpg"
                className="flex items-center gap-1 bg-[#3a271d] hover:bg-[#251710] text-[#fcf9f2] px-3 py-1.5 rounded-full text-xs font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Photo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
