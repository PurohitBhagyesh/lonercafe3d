import React, { useState, useEffect } from 'react'
import { Camera, X, Download } from 'lucide-react'
import { soundEngine } from '../../audio/soundEngine'
import { useGameStore } from '../../store/gameStore'

export function PolaroidCamera() {
  const { mode } = useGameStore()
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)

  const capturePhoto = () => {
    soundEngine.playCameraShutter()
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    setSnapshotUrl(dataUrl)
  }

  // Listen to keyboard shortcut [P] and custom event from SanctuaryTopBar
  useEffect(() => {
    const handleCustomCapture = () => capturePhoto()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === 'KeyP') &&
        (e.target as HTMLElement).tagName !== 'INPUT' &&
        (e.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        capturePhoto()
      }
    }

    window.addEventListener('take-polaroid', handleCustomCapture)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('take-polaroid', handleCustomCapture)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {/* Polaroid Photo Modal (when photo captured) */}
      {snapshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
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
