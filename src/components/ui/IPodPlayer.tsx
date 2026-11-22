import React, { useRef, useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Upload, 
  X, 
  Volume2, 
  Music, 
  Palette,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { useGameStore, SongTrack } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const IPOD_SKINS = [
  { id: 'classic-white', name: 'Classic White', bg: 'bg-[#ededed]', wheel: 'bg-[#f8f8f8]', text: 'text-gray-800' },
  { id: 'stealth-black', name: 'Stealth Black', bg: 'bg-[#1e1e1e]', wheel: 'bg-[#2a2a2a]', text: 'text-gray-100' },
  { id: 'bondi-blue', name: 'Bondi Blue', bg: 'bg-[#1b4965]', wheel: 'bg-[#62b6cb]', text: 'text-white' },
  { id: 'sakura-pink', name: 'Sakura Pink', bg: 'bg-[#e5989b]', wheel: 'bg-[#ffb4a2]', text: 'text-gray-900' },
  { id: 'warm-amber', name: 'Vintage Amber', bg: 'bg-[#8c532b]', wheel: 'bg-[#b87333]', text: 'text-white' },
]

export function IPodPlayer() {
  const { 
    mode, 
    setMode, 
    ipodSkin, 
    setIpodSkin, 
    playlist, 
    currentTrackIndex, 
    setTrackIndex, 
    isPlaying, 
    setIsPlaying, 
    addCustomTrack 
  } = useGameStore()

  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'nowPlaying' | 'playlist' | 'skins'>('nowPlaying')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentTrack = playlist[currentTrackIndex] || playlist[0]
  const currentSkin = IPOD_SKINS.find(s => s.id === ipodSkin) || IPOD_SKINS[0]

  // Handle play / pause logic
  const togglePlay = () => {
    soundEngine.playIpodClick()
    if (isPlaying) {
      soundEngine.stopLofiMusic()
      soundEngine.pauseCustomAudio()
      setIsPlaying(false)
    } else {
      if (currentTrack.isProcedural) {
        soundEngine.startLofiMusic()
      } else if (currentTrack.url) {
        soundEngine.playCustomAudio(currentTrack.url)
      }
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    soundEngine.playIpodClick()
    const nextIdx = (currentTrackIndex + 1) % playlist.length
    setTrackIndex(nextIdx)
    const nextT = playlist[nextIdx]
    if (isPlaying) {
      if (nextT.isProcedural) {
        soundEngine.startLofiMusic()
      } else if (nextT.url) {
        soundEngine.playCustomAudio(nextT.url)
      }
    }
  }

  const prevTrack = () => {
    soundEngine.playIpodClick()
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length
    setTrackIndex(prevIdx)
    const prevT = playlist[prevIdx]
    if (isPlaying) {
      if (prevT.isProcedural) {
        soundEngine.startLofiMusic()
      } else if (prevT.url) {
        soundEngine.playCustomAudio(prevT.url)
      }
    }
  }

  // Handle user MP3 file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    soundEngine.playIpodClick()
    const fileUrl = URL.createObjectURL(file)
    const fileName = file.name.replace(/\.[^/.]+$/, '')

    addCustomTrack({
      title: fileName,
      artist: 'Local Audio',
      url: fileUrl
    })

    soundEngine.playCustomAudio(fileUrl)
    setIsPlaying(true)
  }

  // If in another mode and not minimized, do not render full modal
  if (mode !== 'ipod' && !isMinimized) {
    return (
      /* Tiny floating mini-player button in corner */
      <button
        onClick={() => {
          soundEngine.playIpodClick()
          setMode('ipod')
        }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-[#2a1d15]/90 hover:bg-[#3d2a1f] text-[#f4ede4] px-4 py-2.5 rounded-full border border-[#8c6b53]/40 shadow-xl backdrop-blur-md transition-all active:scale-95"
      >
        <Music className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-xs font-mono tracking-wide">
          {isPlaying ? `Playing: ${currentTrack.title.slice(0, 18)}...` : 'iPod Music'}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/*"
        className="hidden"
      />

      {/* Retro iPod Device Chassis */}
      <div className={`relative w-[340px] sm:w-[360px] rounded-[36px] p-6 shadow-2xl border-4 border-white/20 transition-all ${currentSkin.bg}`}>
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">
            Loners Pod • 30GB
          </span>
          <button
            onClick={() => {
              soundEngine.playIpodClick()
              setMode('walking')
            }}
            className="p-1 rounded-full hover:bg-black/10 text-gray-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LCD Screen Container */}
        <div className="w-full h-[180px] rounded-2xl bg-[#a3b899] p-3 shadow-inner border-2 border-[#7b9171] flex flex-col justify-between text-[#1f2d1a] font-mono select-none">
          {/* Status bar */}
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#7b9171]/40">
            <span className="font-bold flex items-center gap-1">
              {isPlaying ? '▶ Playing' : '❚❚ Paused'}
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <span>EQ: Cozy</span>
              <span>🔋 94%</span>
            </div>
          </div>

          {/* Screen Content Tabs */}
          {activeTab === 'nowPlaying' && (
            <div className="py-2 text-center flex flex-col justify-center items-center flex-1">
              <p className="text-[13px] font-bold line-clamp-1">{currentTrack.title}</p>
              <p className="text-[11px] opacity-80 mt-0.5">{currentTrack.artist}</p>
              {currentTrack.isProcedural && (
                <span className="text-[9px] bg-[#1f2d1a]/15 px-2 py-0.5 rounded-full mt-1.5">
                  Live Procedural Lo-Fi Synthesizer
                </span>
              )}

              {/* Faux Progress Bar */}
              <div className="w-full bg-[#1f2d1a]/20 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-[#1f2d1a] h-full rounded-full transition-all duration-300" 
                  style={{ width: isPlaying ? '65%' : '30%' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'playlist' && (
            <div className="py-1 flex-1 overflow-y-auto max-h-[120px] text-left text-[11px] space-y-1 pr-1">
              {playlist.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => {
                    soundEngine.playIpodClick()
                    setTrackIndex(idx)
                    if (track.isProcedural) {
                      soundEngine.startLofiMusic()
                    } else if (track.url) {
                      soundEngine.playCustomAudio(track.url)
                    }
                    setIsPlaying(true)
                  }}
                  className={`p-1 rounded cursor-pointer truncate ${idx === currentTrackIndex ? 'bg-[#1f2d1a] text-[#a3b899] font-bold' : 'hover:bg-[#1f2d1a]/10'}`}
                >
                  {idx + 1}. {track.title}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skins' && (
            <div className="py-1 flex-1 flex flex-col justify-center items-center gap-2">
              <span className="text-[11px] font-bold">Select iPod Shell:</span>
              <div className="flex items-center gap-2">
                {IPOD_SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      soundEngine.playIpodClick()
                      setIpodSkin(s.id)
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${s.bg} ${ipodSkin === s.id ? 'border-[#1f2d1a] scale-110' : 'border-black/20'}`}
                    title={s.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Screen Bottom Nav */}
          <div className="flex justify-around text-[10px] pt-1 border-t border-[#7b9171]/40">
            <button 
              onClick={() => { soundEngine.playIpodClick(); setActiveTab('nowPlaying') }}
              className={`hover:underline ${activeTab === 'nowPlaying' ? 'font-bold underline' : ''}`}
            >
              Now Playing
            </button>
            <button 
              onClick={() => { soundEngine.playIpodClick(); setActiveTab('playlist') }}
              className={`hover:underline ${activeTab === 'playlist' ? 'font-bold underline' : ''}`}
            >
              Tracks ({playlist.length})
            </button>
            <button 
              onClick={() => { soundEngine.playIpodClick(); setActiveTab('skins') }}
              className={`hover:underline ${activeTab === 'skins' ? 'font-bold underline' : ''}`}
            >
              Custom Skin
            </button>
          </div>
        </div>

        {/* Upload Custom MP3 Button */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-mono bg-black/10 hover:bg-black/20 text-gray-800 px-3 py-1.5 rounded-full transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load Your Own MP3 Song</span>
          </button>
        </div>

        {/* The Famous Mechanical Click Wheel */}
        <div className="relative w-48 h-48 mx-auto mt-4 flex items-center justify-center">
          <div className={`w-full h-full rounded-full shadow-lg border border-black/10 flex items-center justify-center relative ${currentSkin.wheel}`}>
            {/* Top: Menu */}
            <button 
              onClick={() => {
                soundEngine.playIpodClick()
                setActiveTab(prev => prev === 'nowPlaying' ? 'playlist' : 'nowPlaying')
              }}
              className="absolute top-3 font-mono font-bold text-xs tracking-wider text-gray-500 hover:text-gray-900 active:scale-95"
            >
              MENU
            </button>

            {/* Left: Previous */}
            <button 
              onClick={prevTrack}
              className="absolute left-3 text-gray-500 hover:text-gray-900 active:scale-90"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Right: Next */}
            <button 
              onClick={nextTrack}
              className="absolute right-3 text-gray-500 hover:text-gray-900 active:scale-90"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Bottom: Play / Pause */}
            <button 
              onClick={togglePlay}
              className="absolute bottom-3 text-gray-500 hover:text-gray-900 active:scale-90"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Center Button */}
            <button 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white/70 shadow-inner border border-black/10 flex items-center justify-center active:scale-95 transition"
            >
              <span className="text-[10px] font-mono text-gray-400">SELECT</span>
            </button>
          </div>
        </div>

        {/* Footer tip */}
        <p className="text-center text-[10px] font-mono text-gray-500 mt-4">
          Click outside or top X to resume walking • Music keeps playing
        </p>
      </div>
    </div>
  )
}
