import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CafeScene } from './components/3d/CafeScene'
import { WeatherControlHUD } from './components/ui/WeatherControlHUD'
import { TimeOfDayHUD } from './components/ui/TimeOfDayHUD'
import { QuietChatDrawer } from './components/ui/QuietChatDrawer'
import { CrosshairAndPrompt } from './components/ui/CrosshairAndPrompt'
import { MobileControls } from './components/ui/MobileControls'
import { IPodPlayer } from './components/ui/IPodPlayer'
import { DiaryModal } from './components/ui/DiaryModal'
import { LibraryModal } from './components/ui/LibraryModal'
import { CoffeeBrewModal } from './components/ui/CoffeeBrewModal'
import { SettingsModal } from './components/ui/SettingsModal'
import { FriendConnectModal } from './components/ui/FriendConnectModal'
import { useGameStore } from './store/gameStore'
import { soundEngine } from './audio/soundEngine'
import { Coffee, Sparkles, Volume2, ArrowRight } from 'lucide-react'

export default function App() {
  const { weather, mode, setMode } = useGameStore()
  const [hasEntered, setHasEntered] = useState(false)

  // Start sound engine on first user interaction
  const handleEnterSanctuary = () => {
    soundEngine.ensureStarted()
    setHasEntered(true)
    
    // Request pointer lock on desktop if clicking the screen
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl) {
        canvasEl.requestPointerLock?.()
      }
    }
  }

  // Handle URL room param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomParam = params.get('room')
    if (roomParam) {
      useGameStore.getState().setConnectedFriend({
        id: roomParam,
        name: `Friend (${roomParam})`,
        position: [0.5, 0, -4.2],
        state: 'sitting'
      })
    }
  }, [])

  const bgColor = {
    rain: '#1a222d',
    snow: '#2b3644',
    sunset: '#4a2518',
    night: '#080d19',
    sakura: '#3a272b'
  }[weather]

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#120d0a] select-none font-sans">
      
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.45, 0], fov: 72, near: 0.1, far: 80 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          antialias: true
        }}
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color(bgColor)
        }}
        onClick={() => {
          if (hasEntered && mode === 'walking' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            const canvasEl = document.querySelector('canvas')
            canvasEl?.requestPointerLock?.()
          }
        }}
        className="w-full h-full cursor-crosshair"
      >
        <CafeScene />
      </Canvas>

      {/* Weather Rain Droplets Screen Effect (when raining) */}
      {weather === 'rain' && (
        <div className="pointer-events-none fixed inset-0 z-10 opacity-30 mix-blend-screen overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] h-14 bg-gradient-to-b from-transparent via-blue-200 to-transparent animate-rain-streak"
              style={{
                left: `${(i * 5.8) % 100}%`,
                animationDelay: `${(i * 0.23) % 2}s`,
                animationDuration: `${0.8 + (i % 5) * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Crosshair & Prompts HUD */}
      <CrosshairAndPrompt />

      {/* Outside Weather Dial Switcher */}
      <WeatherControlHUD />

      {/* Time of Day Cycle Switcher */}
      <TimeOfDayHUD />

      {/* Quiet Chat & Voice/Mic Drawer */}
      <QuietChatDrawer />

      {/* Mobile Controls (Virtual Thumbstick & Touch buttons) */}
      <MobileControls />

      {/* Modals & Interfaces */}
      <IPodPlayer />
      <DiaryModal />
      <LibraryModal />
      <CoffeeBrewModal />
      <SettingsModal />
      <FriendConnectModal />

      {/* First-Time Welcome Screen Overlay */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#251710] rounded-3xl p-6 sm:p-8 border-4 border-[#3a2419] shadow-2xl text-center text-[#f4ede4]">
            <div className="w-16 h-16 rounded-full bg-[#402819] flex items-center justify-center mx-auto mb-4 border border-amber-400/40 shadow-inner">
              <Coffee className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-amber-200 mb-2">
              lonercafe3d
            </h1>
            <p className="font-serif italic text-stone-300 text-sm mb-6 leading-relaxed">
              "A quiet sanctuary for solitary souls to drink coffee, watch the rain, write in their diary, and simply breathe."
            </p>

            <div className="bg-[#180f0a] p-4 rounded-2xl border border-[#382015] text-left text-xs font-mono space-y-2 mb-6 text-stone-300">
              <p className="text-amber-300 font-bold">How to enjoy:</p>
              <p>• <span className="text-white">WASD or Thumbstick</span> to walk around</p>
              <p>• <span className="text-white">Trackpad / Mouse / Drag</span> to look</p>
              <p>• <span className="text-white">[E]</span> to sit on the window bench or armchair</p>
              <p>• Open your <span className="text-white">Diary</span> to write private thoughts</p>
              <p>• Play your own music on the <span className="text-white">Retro iPod</span></p>
            </div>

            <button
              onClick={handleEnterSanctuary}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-serif font-bold text-base shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Step Inside the Café</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
