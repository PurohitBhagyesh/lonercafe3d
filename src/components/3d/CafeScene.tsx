import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { Furniture } from './Furniture'
import { WeatherEffect } from './WeatherEffect'
import { InteractableItems, SteamingMug } from './InteractableItem'
import { PlantsAndWatering, WateringCanMesh } from './PlantsAndWatering'
import { FriendAvatar } from './FriendAvatar'
import { PlayerController } from './PlayerController'

export function CafeScene() {
  const { weather, timeOfDay, heldItem, mode } = useGameStore()
  const { camera } = useThree()
  const heldGroupRef = useRef<THREE.Group>(null)

  // Floating held item in first person view with breathing sway
  useFrame((state) => {
    if (heldGroupRef.current && heldItem && mode === 'walking') {
      const t = state.clock.elapsedTime
      heldGroupRef.current.position.set(0.32, -0.25 + Math.sin(t * 3) * 0.012, -0.55)
      heldGroupRef.current.rotation.set(0.1, -0.2 + Math.cos(t * 2) * 0.015, 0)
    }
  })

  // Blend timeOfDay and weather
  const timeLighting = {
    dawn: {
      ambientColor: '#8a6b74',
      ambientIntensity: 0.65,
      sunColor: '#f7c59f',
      sunIntensity: 1.4,
      sunPos: [5, 4, -12] as [number, number, number]
    },
    noon: {
      ambientColor: '#7a8288',
      ambientIntensity: 0.85,
      sunColor: '#fff8e7',
      sunIntensity: 2.0,
      sunPos: [1, 9, -10] as [number, number, number]
    },
    sunset: {
      ambientColor: '#8c4b2b',
      ambientIntensity: 0.7,
      sunColor: '#ff7733',
      sunIntensity: 2.4,
      sunPos: [4, 4, -12] as [number, number, number]
    },
    twilight: {
      ambientColor: '#2b3052',
      ambientIntensity: 0.5,
      sunColor: '#5c6b9e',
      sunIntensity: 0.9,
      sunPos: [0, 5, -12] as [number, number, number]
    },
    midnight: {
      ambientColor: '#121929',
      ambientIntensity: 0.35,
      sunColor: '#6882ab',
      sunIntensity: 0.45,
      sunPos: [-3, 8, -10] as [number, number, number]
    }
  }[timeOfDay]

  // Weather tint modifier
  const weatherTint = weather === 'rain' ? '#3d4d5e' : weather === 'snow' ? '#687b8f' : weather === 'sakura' ? '#8a626d' : '#000000'

  return (
    <>
      {/* Dynamic Time of Day & Weather Lighting */}
      <ambientLight color={timeLighting.ambientColor} intensity={timeLighting.ambientIntensity} />
      <directionalLight
        color={timeLighting.sunColor}
        intensity={timeLighting.sunIntensity}
        position={timeLighting.sunPos}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Main Room Architecture */}
      <group>
        {/* Wooden Plank Floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
          <planeGeometry args={[11, 10]} />
          <meshStandardMaterial color="#2d1c13" roughness={0.65} metalness={0.1} />
        </mesh>

        {/* Ceiling with Wooden Beams */}
        <mesh position={[0, 3.6, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <planeGeometry args={[11, 10]} />
          <meshStandardMaterial color="#1b120c" roughness={0.9} />
        </mesh>
        {/* Exposed Ceiling Beams */}
        {[-3.5, -1.8, 0, 1.8, 3.5].map((z, i) => (
          <mesh key={i} position={[0, 3.45, z]}>
            <boxGeometry args={[11, 0.25, 0.3]} />
            <meshStandardMaterial color="#24160e" roughness={0.8} />
          </mesh>
        ))}

        {/* Left Brick Wall */}
        <mesh position={[-5.5, 1.8, 0]} rotation={[0, Math.PI * 0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 3.6]} />
          <meshStandardMaterial color="#3d271d" roughness={0.8} />
        </mesh>

        {/* Right Wall */}
        <mesh position={[5.5, 1.8, 0]} rotation={[0, -Math.PI * 0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 3.6]} />
          <meshStandardMaterial color="#362218" roughness={0.8} />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 1.8, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[11, 3.6]} />
          <meshStandardMaterial color="#2c1a11" roughness={0.85} />
        </mesh>

        {/* Front Wall Frame with HUGE Panoramic Window */}
        <mesh position={[0, 0.45, -5]}>
          <boxGeometry args={[11, 0.9, 0.3]} />
          <meshStandardMaterial color="#24160e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.35, -5]}>
          <boxGeometry args={[11, 0.5, 0.3]} />
          <meshStandardMaterial color="#24160e" roughness={0.7} />
        </mesh>
        <mesh position={[-5.3, 1.8, -5]}>
          <boxGeometry args={[0.5, 3.6, 0.3]} />
          <meshStandardMaterial color="#24160e" />
        </mesh>
        <mesh position={[5.3, 1.8, -5]}>
          <boxGeometry args={[0.5, 3.6, 0.3]} />
          <meshStandardMaterial color="#24160e" />
        </mesh>

        {/* Window Center Dividers */}
        {[-2.6, 0, 2.6].map((x, i) => (
          <mesh key={i} position={[x, 2.0, -5]}>
            <boxGeometry args={[0.08, 2.4, 0.2]} />
            <meshStandardMaterial color="#1a110a" />
          </mesh>
        ))}

        {/* The Giant Panoramic Glass Panes */}
        <mesh position={[0, 2.0, -5]}>
          <planeGeometry args={[10.2, 2.4]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.3}
            roughness={0.1}
            transmission={0.9}
            thickness={0.2}
            color="#d4e8f7"
            ior={1.45}
          />
        </mesh>
      </group>

      {/* Outside 3D Weather, Trees, Stars & Horizon */}
      <WeatherEffect weather={weather} />

      {/* Interior Furniture */}
      <Furniture />

      {/* Plants & Watering Can */}
      <PlantsAndWatering />

      {/* Interactable Items (Mugs, Diary, iPod, Books) */}
      <InteractableItems />

      {/* Friend's Avatar (if connected) */}
      <FriendAvatar />

      {/* First-Person Controller */}
      <PlayerController />

      {/* Held Item in player's hands */}
      {heldItem && mode === 'walking' && (
        <primitive object={camera}>
          <group ref={heldGroupRef}>
            {heldItem.type === 'watering-can' ? (
              <WateringCanMesh position={[0, 0, 0]} isHeld={true} />
            ) : (
              <SteamingMug position={[0, 0, 0]} isHeld={true} />
            )}
          </group>
        </primitive>
      )}
    </>
  )
}
