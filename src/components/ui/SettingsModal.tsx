import React from 'react'
import { X, Sliders, Volume2, Eye, Compass } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function SettingsModal() {
  const { 
    mode, 
    setMode, 
    masterVolume, 
    ambientVolume, 
    musicVolume, 
    sfxVolume, 
    setVolume,
    mouseSensitivity,
    setMouseSensitivity
  } = useGameStore()

  if (mode !== 'settings') return null

  const handleVolumeChange = (type: 'master' | 'ambient' | 'music' | 'sfx', val: number) => {
    setVolume(type, val)
    soundEngine.setVolumes(
      type === 'master' ? val : masterVolume,
      type === 'ambient' ? val : ambientVolume,
      type === 'music' ? val : musicVolume,
      type === 'sfx' ? val : sfxVolume
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#251811] rounded-2xl p-6 shadow-2xl border-4 border-[#1c110b] flex flex-col text-[#f4ede4]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#432b1d]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium">Café Sanctuary Settings</h3>
          </div>
          <button
            onClick={() => setMode('walking')}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Mixers */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300/80 font-bold">
            Sound Atmosphere Mixer
          </h4>

          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Master Volume</span>
              <span>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Weather / Rain Ambience */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Rain & Window Weather</span>
              <span>{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientVolume}
              onChange={(e) => handleVolumeChange('ambient', parseFloat(e.target.value))}
              className="w-full accent-blue-400"
            />
          </div>

          {/* Lo-Fi Music */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>iPod / Lo-Fi Music</span>
              <span>{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* SFX / Footsteps / Clicks */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Tactile Clicks & Footsteps</span>
              <span>{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
              className="w-full accent-stone-400"
            />
          </div>
        </div>

        {/* Mouse Sensitivity */}
        <div className="mb-6 pt-3 border-t border-[#432b1d]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300/80 font-bold mb-3">
            Trackpad & Mouse Controls
          </h4>
          <div className="flex justify-between text-xs font-mono mb-1">
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

        {/* Keybinding Reference */}
        <div className="bg-[#19100a] p-3 rounded-xl border border-[#382216] text-[11px] font-mono space-y-1 text-stone-400">
          <p className="text-amber-300/80 font-bold mb-1">Controls Guide:</p>
          <p>• <span className="text-white">W, A, S, D</span> — Walk through café</p>
          <p>• <span className="text-white">Mouse / Trackpad</span> — Look around</p>
          <p>• <span className="text-white">E</span> — Sit on bench, pick coffee, open diary</p>
          <p>• <span className="text-white">Space / Esc</span> — Stand up or close menu</p>
        </div>

        <button
          onClick={() => setMode('walking')}
          className="mt-5 w-full py-2.5 rounded-xl bg-[#4a3020] hover:bg-[#5c3c28] text-white font-mono text-xs font-semibold transition"
        >
          Close Settings
        </button>
      </div>
    </div>
  )
}
