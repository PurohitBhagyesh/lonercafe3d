import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { X, QrCode, Smartphone, Copy, Check } from 'lucide-react'
import { soundEngine } from '../../audio/soundEngine'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

export function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 260,
        margin: 2,
        color: {
          dark: '#1e120b',
          light: '#fbf7ee'
        }
      })
        .then(setQrDataUrl)
        .catch(err => console.error('QR code generation error:', err))
    }
  }, [isOpen, url])

  if (!isOpen) return null

  const handleCopy = () => {
    soundEngine.playIpodClick()
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#251710] rounded-3xl p-6 shadow-2xl border-4 border-[#3d2417] text-[#f4ede4] text-center flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-full bg-[#3d2719] flex items-center justify-center mb-3 border border-amber-400/40">
          <Smartphone className="w-6 h-6 text-amber-300 animate-pulse" />
        </div>
        <h3 className="font-serif text-xl font-bold text-amber-200">
          Scan to Play on Phone
        </h3>
        <p className="text-xs text-stone-300 mt-1 mb-4 leading-relaxed">
          Point your smartphone camera at this code to open Loners Café with mobile virtual touch controls!
        </p>

        {/* The QR Code Canvas / Image */}
        <div className="bg-[#fbf7ee] p-3 rounded-2xl shadow-inner border-2 border-amber-400/30 mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Sanctuary QR Code" className="w-52 h-52 rounded-lg" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-stone-600 font-mono text-xs">
              Generating QR...
            </div>
          )}
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#3d2719] hover:bg-[#4d3221] px-4 py-2 rounded-xl text-xs font-mono text-amber-200 border border-[#5c3c28] transition active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile Link'}</span>
        </button>
      </div>
    </div>
  )
}
