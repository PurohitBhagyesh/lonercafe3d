import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { Furniture } from './Furniture'
import { WeatherEffect } from './WeatherEffect'
import { InteractableItems, SteamingMug } from './InteractableItem'
import { PlantsAndWatering, WateringCanMesh } from './PlantsAndWatering'
import { FriendAvatar } from './FriendAvatar'
import { PlayerController } from './PlayerController'
import { 
  RealTimeWallClock, 
  ChalkboardMenu, 
  PastryShowcase, 
  VinylTurntable,
  CoffeeBeanJars,
  ScentedCandle,
  BlanketBasket,
  BentwoodCoatRack,
  HangingPendantLamp,
  SleepingCafeCat,
  BankersDeskLamp
} from './RealLifeDecor'
import { CastIronFireplace } from './Fireplace'
import { VinylCrate } from './VinylCrate'
import { UprightPiano } from './UprightPiano'
import { 
  VintageCoffeeGrinder, 
  VictorianGramophone, 
  AntiquarianBookStack 
} from './DetailedModels'
import { 
  createWoodFloorTexture, 
  createBrickWallTexture 
} from '../../utils/proceduralTextures'

export function CafeScene() {
  const { weather, timeOfDay, heldItem, mode } = useGameStore()
  const { camera } = useThree()
  const heldGroupRef = useRef<THREE.Group>(null)

  // Procedural PBR Textures
  const woodFloorTexture = useMemo(() => createWoodFloorTexture(), [])
  const brickWallTexture = useMemo(() => createBrickWallTexture(), [])

  // Camera direction-based view culling (render only when the user looks this way)
  const [viewZones, setViewZones] = useState({
    seeNorth: true, // Window & Outside weather
    seeSouth: true, // Fireplace, Upright Piano, Writing Desk, Clock
    seeEast: true,  // Barista espresso bar, grinder, pastry showcase
    seeWest: true   // Library bookshelves, vinyl turntable, armchair
  })

  const camDir = useRef(new THREE.Vector3())

  // Floating held item in first person view with gentle sway
  useFrame((state) => {
    if (heldGroupRef.current && heldItem && mode === 'walking') {
      const t = state.clock.elapsedTime
      heldGroupRef.current.position.set(0.32, -0.25 + Math.sin(t * 3) * 0.012, -0.55)
      heldGroupRef.current.rotation.set(0.1, -0.2 + Math.cos(t * 2) * 0.015, 0)
    }

    // Selective View Rendering (Hide what is behind the user)
    camera.getWorldDirection(camDir.current)
    const dz = camDir.current.z
    const dx = camDir.current.x

    const nextNorth = dz < 0.45
    const nextSouth = dz > -0.45
    const nextEast = dx > -0.45
    const nextWest = dx < 0.45

    if (
      viewZones.seeNorth !== nextNorth ||
      viewZones.seeSouth !== nextSouth ||
      viewZones.seeEast !== nextEast ||
      viewZones.seeWest !== nextWest
    ) {
      setViewZones({
        seeNorth: nextNorth,
        seeSouth: nextSouth,
        seeEast: nextEast,
        seeWest: nextWest
      })
    }
  })

  // Balanced daylight & sunlight streaming through window
  const sunConfig = {
    dawn: { sunColor: '#ffb088', sunIntensity: 2.2, sunPos: [3, 4, -12] as [number, number, number] },
    noon: { sunColor: '#fff9e6', sunIntensity: 2.8, sunPos: [1, 8, -10] as [number, number, number] },
    sunset: { sunColor: '#ff8a47', sunIntensity: 2.6, sunPos: [3, 4, -12] as [number, number, number] },
    twilight: { sunColor: '#8ea8db', sunIntensity: 1.6, sunPos: [0, 5, -12] as [number, number, number] },
    midnight: { sunColor: '#9bb8ed', sunIntensity: 1.2, sunPos: [-2, 8, -10] as [number, number, number] }
  }[timeOfDay]

  return (
    <>
      {/* 1. Warm Interior Ambience & Sky Fill Light (Prevents pitch-black darkness anywhere) */}
      <hemisphereLight
        args={['#fff8f0', '#7a5438', 2.4]}
      />
      <ambientLight color="#fff7ee" intensity={2.0} />

      {/* 2. Directional Sunlight / Moonlight through the window */}
      <directionalLight
        color={sunConfig.sunColor}
        intensity={sunConfig.sunIntensity}
        position={sunConfig.sunPos}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 3. Interior Warm Fill Lights (Soft decay 1.0 ensures even, cozy café illumination) */}
      {/* Barista Coffee Bar, Espresso Machine & Pastry Showcase */}
      <pointLight color="#ffe8cc" intensity={3.8} distance={18} decay={1.0} position={[3.6, 2.7, -0.5]} />
      {/* Library Bookshelves, Record Crate & Plants */}
      <pointLight color="#ffe8cc" intensity={3.4} distance={18} decay={1.0} position={[-3.8, 2.7, -0.8]} />
      {/* Front Window Counter & Seating */}
      <pointLight color="#ffebd1" intensity={3.0} distance={16} decay={1.0} position={[0, 2.8, -2.5]} />
      {/* Loner's Writing Desk & Reading Armchair */}
      <pointLight color="#ffdfba" intensity={3.0} distance={16} decay={1.0} position={[-1.2, 2.8, 2.5]} />
      {/* Upright Piano Warm Illumination */}
      <pointLight color="#ffe0b5" intensity={3.2} distance={14} decay={1.0} position={[2.2, 2.7, 3.5]} />

      {/* Main Room Architecture */}
      <group>
        {/* Hardwood Oak Plank Floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
          <planeGeometry args={[11, 10]} />
          <meshStandardMaterial map={woodFloorTexture} roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Off-White Ceiling with Dark Timber Beams */}
        <mesh position={[0, 3.6, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <planeGeometry args={[11, 10]} />
          <meshStandardMaterial color="#faf7f2" roughness={0.9} />
        </mesh>
        {[-3.5, -1.8, 0, 1.8, 3.5].map((z, i) => (
          <mesh key={i} position={[0, 3.45, z]}>
            <boxGeometry args={[11, 0.25, 0.3]} />
            <meshStandardMaterial color="#2c1a11" roughness={0.7} />
          </mesh>
        ))}

        {/* Left Wall: Warm Plaster Top + Brick Accent */}
        <mesh position={[-5.5, 1.8, 0]} rotation={[0, Math.PI * 0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 3.6]} />
          <meshStandardMaterial map={brickWallTexture} roughness={0.8} />
        </mesh>

        {/* Right Wall: Warm Cream Plaster (Reflects light onto Barista Counter!) */}
        <mesh position={[5.5, 1.8, 0]} rotation={[0, -Math.PI * 0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 3.6]} />
          <meshStandardMaterial color="#f0e9df" roughness={0.65} />
        </mesh>
        {/* Right Wall Wood Wainscoting Base Panel */}
        <mesh position={[5.48, 0.55, 0]} rotation={[0, -Math.PI * 0.5, 0]}>
          <planeGeometry args={[10, 1.1]} />
          <meshStandardMaterial color="#3a2417" roughness={0.7} />
        </mesh>

        {/* Back Wall: Warm Cream Plaster */}
        <mesh position={[0, 1.8, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[11, 3.6]} />
          <meshStandardMaterial color="#eee6dc" roughness={0.65} />
        </mesh>
        {/* Back Wall Wood Wainscoting */}
        <mesh position={[0, 0.55, 4.98]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[11, 1.1]} />
          <meshStandardMaterial color="#3a2417" roughness={0.7} />
        </mesh>

        {/* Front Wall Frame with Huge Panoramic Window */}
        <mesh position={[0, 0.45, -5]}>
          <boxGeometry args={[11, 0.9, 0.3]} />
          <meshStandardMaterial color="#332014" roughness={0.6} />
        </mesh>
        <mesh position={[0, 3.35, -5]}>
          <boxGeometry args={[11, 0.5, 0.3]} />
          <meshStandardMaterial color="#332014" roughness={0.6} />
        </mesh>
        <mesh position={[-5.3, 1.8, -5]}>
          <boxGeometry args={[0.5, 3.6, 0.3]} />
          <meshStandardMaterial color="#332014" />
        </mesh>
        <mesh position={[5.3, 1.8, -5]}>
          <boxGeometry args={[0.5, 3.6, 0.3]} />
          <meshStandardMaterial color="#332014" />
        </mesh>

        {/* Window Mullions */}
        {[-2.6, 0, 2.6].map((x, i) => (
          <mesh key={i} position={[x, 2.0, -5]}>
            <boxGeometry args={[0.08, 2.4, 0.2]} />
            <meshStandardMaterial color="#22150d" />
          </mesh>
        ))}

        {/* Crystal Clear Window Glass with subtle reflection */}
        <mesh position={[0, 2.0, -5]}>
          <planeGeometry args={[10.2, 2.4]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.18}
            roughness={0.04}
            transmission={0.96}
            thickness={0.15}
            color="#e8f4fd"
            ior={1.45}
          />
        </mesh>
      </group>

      {/* 1. NORTH ZONE: Front Window, Window Counter & Outside Weather (Rendered when facing North) */}
      <group visible={viewZones.seeNorth}>
        <HangingPendantLamp position={[0, 2.5, -2.5]} lightIntensity={2.4} />
        <ScentedCandle position={[0.4, 0.95, -4.7]} />
        <WeatherEffect weather={weather} />
      </group>

      {/* 2. SOUTH ZONE: Fireplace, Upright Piano, Cat, Clock, Writing Desk (Rendered when facing South) */}
      <group visible={viewZones.seeSouth}>
        <RealTimeWallClock position={[-1.2, 2.5, 4.95]} />
        <CastIronFireplace position={[-3.6, 0, 4.3]} />
        <SleepingCafeCat position={[-2.7, 0, 4.3]} />
        <BankersDeskLamp position={[-1.6, 0.77, 2.25]} />
        <UprightPiano position={[2.2, 0, 4.3]} rotation={[0, Math.PI, 0]} />
        <AntiquarianBookStack position={[-2.9, 0.45, 2.6]} />
        <ScentedCandle position={[-1.2, 0.79, 2.7]} />
        <BlanketBasket position={[-4.3, 0, 2.8]} />
        <HangingPendantLamp position={[2.2, 2.5, 3.8]} lightIntensity={2.6} />
      </group>

      {/* 3. EAST ZONE: Barista Coffee Bar, Espresso Machine, Pastry Case, Grinder (Rendered when facing East) */}
      <group visible={viewZones.seeEast}>
        <ChalkboardMenu position={[5.46, 2.3, -0.5]} />
        <PastryShowcase position={[3.6, 1.15, 1.1]} />
        <CoffeeBeanJars position={[3.6, 1.15, -1.8]} />
        <VintageCoffeeGrinder position={[3.6, 1.15, -2.3]} />
        <HangingPendantLamp position={[3.6, 2.5, -1.2]} lightIntensity={2.8} />
        <HangingPendantLamp position={[3.6, 2.5, 0.8]} lightIntensity={2.6} />
      </group>

      {/* 4. WEST ZONE: Library Bookshelves, Turntable, Gramophone, Coat Rack (Rendered when facing West) */}
      <group visible={viewZones.seeWest}>
        <VinylTurntable position={[-4.8, 1.95, -2.1]} />
        <VinylCrate position={[-4.8, 1.95, -1.4]} />
        <VictorianGramophone position={[-4.7, 1.15, -2.6]} />
        <BentwoodCoatRack position={[-4.8, 0, -4.2]} />
        <HangingPendantLamp position={[-3.6, 2.5, -0.8]} lightIntensity={2.6} />
      </group>

      {/* Interior Furniture with strict Directional Zone Culling */}
      <Furniture viewZones={viewZones} />

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
