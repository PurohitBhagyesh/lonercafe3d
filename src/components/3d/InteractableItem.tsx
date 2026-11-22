import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, SittingSpot } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function SteamingMug({ position, isHeld = false }: { position: [number, number, number]; isHeld?: boolean }) {
  const steamCount = 35
  const [steamGeo, steamPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(steamCount * 3)
    for (let i = 0; i < steamCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.08
      pos[i * 3 + 1] = Math.random() * 0.35 + 0.1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  const steamRef = useRef<THREE.Points>(null)

  useFrame((state, delta) => {
    if (steamRef.current) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < steamCount; i++) {
        positions[i * 3 + 1] += delta * 0.25 // rise
        positions[i * 3 + 0] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.001
        if (positions[i * 3 + 1] > 0.45) {
          positions[i * 3 + 1] = 0.1
          positions[i * 3 + 0] = (Math.random() - 0.5) * 0.06
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Ceramic Mug Body */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#f8f4eb" roughness={0.2} />
      </mesh>
      {/* Coffee Surface */}
      <mesh position={[0, 0.115, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.01, 16]} />
        <meshStandardMaterial color="#361f14" roughness={0.1} />
      </mesh>
      {/* Mug Handle */}
      <mesh position={[0.07, 0.06, 0]} rotation={[0, 0, Math.PI * 0.5]}>
        <torusGeometry args={[0.035, 0.01, 8, 16]} />
        <meshStandardMaterial color="#f8f4eb" roughness={0.2} />
      </mesh>
      {/* Rising Steam */}
      <points ref={steamRef} geometry={steamGeo}>
        <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.35} />
      </points>
    </group>
  )
}

export function InteractableItems() {
  const { 
    setMode, 
    sitDown, 
    mode, 
    heldItem, 
    setHeldItem, 
    tableItems, 
    placeItemOnTable 
  } = useGameStore()

  const windowSeat: SittingSpot = {
    id: 'window-seat',
    name: 'Window Counter Stool',
    seatPosition: [-1.8, 0.65, -4.2],
    cameraPosition: [-1.8, 1.25, -4.2],
    lookAt: [-1.8, 1.35, -12] // Looking straight out the rainy window
  }

  const armchairSeat: SittingSpot = {
    id: 'armchair-seat',
    name: 'Cozy Armchair',
    seatPosition: [-3.5, 0.45, 2.8],
    cameraPosition: [-3.5, 1.15, 2.8],
    lookAt: [0, 1.2, 0] // Looking across the warm cafe
  }

  const deskSeat: SittingSpot = {
    id: 'desk-seat',
    name: 'Writing Desk Chair',
    seatPosition: [-1.2, 0.55, 3.1],
    cameraPosition: [-1.2, 1.1, 3.0],
    lookAt: [-1.2, 0.78, 2.5] // Looking down at the diary
  }

  return (
    <group>
      {/* 1. Steaming Mugs on tables */}
      {tableItems.map((item) => (
        <group 
          key={item.id} 
          onClick={(e) => {
            e.stopPropagation()
            if (heldItem) return
            soundEngine.playCoffeeClink()
            setHeldItem({ id: item.id, name: item.name, type: 'coffee' })
          }}
        >
          <SteamingMug position={item.position} />
        </group>
      ))}

      {/* 2. The Loner's Diary (On writing desk) */}
      <group 
        position={[-1.2, 0.79, 2.5]} 
        rotation={[-Math.PI * 0.5, 0, 0.1]}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playPageFlip()
          sitDown(deskSeat)
          setMode('writing')
        }}
      >
        {/* Leather Cover */}
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.42, 0.03]} />
          <meshStandardMaterial color="#542c16" roughness={0.7} />
        </mesh>
        {/* Paper Block */}
        <mesh position={[0, 0, 0.018]}>
          <boxGeometry args={[0.3, 0.4, 0.02]} />
          <meshStandardMaterial color="#f6f0dd" roughness={0.9} />
        </mesh>
        {/* Golden Bookmark Ribbon */}
        <mesh position={[0.02, 0.22, 0.02]}>
          <boxGeometry args={[0.02, 0.12, 0.005]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
      </group>

      {/* 3. The Retro iPod on the Window Counter */}
      <group 
        position={[-1.4, 0.955, -4.7]} 
        rotation={[-Math.PI * 0.5, 0, -0.2]}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playIpodClick()
          setMode('ipod')
        }}
      >
        {/* iPod Aluminum Body */}
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.24, 0.02]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.05, 0.011]}>
          <planeGeometry args={[0.11, 0.09]} />
          <meshBasicMaterial color="#a7c080" />
        </mesh>
        {/* Click Wheel */}
        <mesh position={[0, -0.05, 0.011]}>
          <circleGeometry args={[0.038, 24]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
        </mesh>
        {/* Center Button */}
        <mesh position={[0, -0.05, 0.012]}>
          <circleGeometry args={[0.015, 16]} />
          <meshStandardMaterial color="#d5d5d5" />
        </mesh>
      </group>

      {/* 4. Vintage Radio on the Coffee Counter */}
      <group 
        position={[3.6, 1.25, 0.8]} 
        rotation={[0, -Math.PI * 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playIpodClick()
          setMode('ipod')
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.35, 0.25]} />
          <meshStandardMaterial color="#5c3826" roughness={0.6} />
        </mesh>
        {/* Speaker Grill */}
        <mesh position={[-0.12, 0, 0.13]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshStandardMaterial color="#33241b" roughness={0.9} />
        </mesh>
        {/* Tuning Dial */}
        <mesh position={[0.14, 0.05, 0.13]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
        {/* Antenna */}
        <mesh position={[-0.2, 0.3, -0.08]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.006, 0.006, 0.45, 8]} />
          <meshStandardMaterial color="#ccc" metalness={0.9} />
        </mesh>
      </group>

      {/* 5. Clickable Sitting Targets (Invisible colliders / visual cues) */}
      <mesh 
        position={windowSeat.seatPosition} 
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playSitSound()
          sitDown(windowSeat)
        }}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
      </mesh>

      <mesh 
        position={armchairSeat.seatPosition} 
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playSitSound()
          sitDown(armchairSeat)
        }}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      </mesh>

      {/* 6. Coffee Counter Barista Maker click */}
      <mesh 
        position={[3.6, 1.3, -0.8]} 
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          setMode('brewing')
        }}
      >
        <boxGeometry args={[1, 0.8, 1]} />
      </mesh>

      {/* 7. Library Bookshelf click */}
      <mesh 
        position={[-5.0, 1.6, -0.8]} 
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playPageFlip()
          setMode('reading')
        }}
      >
        <boxGeometry args={[0.8, 2.5, 4]} />
      </mesh>
    </group>
  )
}
