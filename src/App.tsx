import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CafeScene } from './components/3d/CafeScene'
import { MainMenu } from './components/ui/MainMenu'
import { PauseMenu } from './components/ui/PauseMenu'
import { WeatherControlHUD } from './components/ui/WeatherControlHUD'
import { TimeOfDayHUD } from './components/ui/TimeOfDayHUD'
import { QuietChatDrawer } from './components/ui/QuietChatDrawer'
import { CrosshairAndPrompt } from './components/ui/CrosshairAndPrompt'
import { MobileControls } from './components/ui/MobileControls'
import { IPodPlayer } from './components/ui/IPodPlayer'
import { DiaryModal } from './components/ui/DiaryModal'
import { LibraryModal } from './components/ui/LibraryModal'
import { CoffeeBrewModal } from './components/ui/CoffeeBrewModal'
import { FoggyWindowOverlay } from './components/ui/FoggyWindowOverlay'
import { PolaroidCamera } from './components/ui/PolaroidCamera'
import { useGameStore } from './store/gameStore'

export default function App() {
  const { weather, gamePhase, fov, mode, reduceMotion } = useGameStore()

  // Handle URL room param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomParam = params.get('room')
    if (roomParam) {
      useGameStore.getState().setConnectedFriend({
        id: roomParam,
        name: `Friend #${roomParam.slice(0, 4)}`,
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
        camera={{ position: [0, 1.45, 0], fov: fov, near: 0.1, far: 80 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          antialias: true
        }}
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color(bgColor)
        }}
        onClick={() => {
          if (gamePhase === 'playing' && mode === 'walking' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            const canvasEl = document.querySelector('canvas')
            canvasEl?.requestPointerLock?.()
          }
        }}
        className="w-full h-full cursor-crosshair"
      >
        <CafeScene />
      </Canvas>

      {/* Screen Rain Streaks (disabled if reduceMotion is active) */}
      {weather === 'rain' && !reduceMotion && gamePhase === 'playing' && (
        <div className="pointer-events-none fixed inset-0 z-10 opacity-25 mix-blend-screen overflow-hidden">
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

      {/* 1. Main Title Menu (when in 'menu' phase) */}
      <MainMenu />

      {/* 2. Pause Menu (ESC key during gameplay) */}
      <PauseMenu />

      {/* 3. In-Game HUD & Controls (only when active in sanctuary) */}
      {gamePhase === 'playing' && (
        <>
          <CrosshairAndPrompt />
          <WeatherControlHUD />
          <TimeOfDayHUD />
          <QuietChatDrawer />
          <MobileControls />

          {/* Diegetic In-Game Interactivity Modals & Tools */}
          <IPodPlayer />
          <DiaryModal />
          <LibraryModal />
          <CoffeeBrewModal />
          <FoggyWindowOverlay />
          <PolaroidCamera />
        </>
      )}
    </div>
  )
}
