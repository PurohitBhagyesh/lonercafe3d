import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createChalkboardTexture } from '../../utils/proceduralTextures'

// 1. Real-Time Synchronized Wall Clock
export function RealTimeWallClock({ position }: { position: [number, number, number] }) {
  const hourHandRef = useRef<THREE.Group>(null)
  const minuteHandRef = useRef<THREE.Group>(null)
  const secondHandRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const now = new Date()
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000

    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -((seconds / 60) * Math.PI * 2)
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -(((minutes + seconds / 60) / 60) * Math.PI * 2)
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -(((hours + minutes / 60) / 12) * Math.PI * 2)
    }
  })

  return (
    <group position={position}>
      {/* Clock Outer Rim */}
      <mesh castShadow receiveShadow rotation={[Math.PI * 0.5, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 32]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.7} />
      </mesh>
      {/* Brass Bezel */}
      <mesh position={[0, 0, 0.026]}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Clock Face Plate */}
      <mesh position={[0, 0, 0.028]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial color="#f7f2e7" roughness={0.5} />
      </mesh>

      {/* Hour Markers (12, 3, 6, 9) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
        const angle = (h / 12) * Math.PI * 2
        const r = 0.32
        const isMajor = h % 3 === 0
        return (
          <mesh
            key={h}
            position={[Math.sin(angle) * r, Math.cos(angle) * r, 0.03]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[isMajor ? 0.015 : 0.008, isMajor ? 0.045 : 0.025, 0.005]} />
            <meshStandardMaterial color="#1f140e" />
          </mesh>
        )
      })}

      {/* Hour Hand */}
      <group ref={hourHandRef} position={[0, 0, 0.033]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.018, 0.2, 0.004]} />
          <meshStandardMaterial color="#1a110a" />
        </mesh>
      </group>

      {/* Minute Hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.036]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.012, 0.28, 0.004]} />
          <meshStandardMaterial color="#1a110a" />
        </mesh>
      </group>

      {/* Second Hand (Red brass needle) */}
      <group ref={secondHandRef} position={[0, 0, 0.039]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.005, 0.32, 0.003]} />
          <meshStandardMaterial color="#b23a22" />
        </mesh>
        {/* Center Pivot Cap */}
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[0.018, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

// 2. Real-Life Chalkboard Daily Menu
export function ChalkboardMenu({ position }: { position: [number, number, number] }) {
  const chalkTexture = useMemo(() => createChalkboardTexture(), [])

  return (
    <group position={position}>
      {/* Dark Oak Wooden Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.8, 0.08]} />
        <meshStandardMaterial color="#2d1b10" roughness={0.7} />
      </mesh>
      {/* Slate Board Surface with Handwritten Chalk Menu */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.35, 1.65]} />
        <meshStandardMaterial map={chalkTexture} roughness={0.85} />
      </mesh>
    </group>
  )
}

// 3. Real-Life Pastry Showcase with Fresh Croissants & Cinnamon Brioche
export function PastryShowcase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden Display Stand Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.6]} />
        <meshStandardMaterial color="#402819" roughness={0.6} />
      </mesh>

      {/* Glass Showcase Cover */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.05, 0.38, 0.55]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.3}
          roughness={0.05}
          transmission={0.9}
          thickness={0.05}
          color="#ffffff"
          ior={1.48}
        />
      </mesh>

      {/* Pastries on Porcelain Tray */}
      {/* 1. Golden Butter Croissant */}
      <group position={[-0.26, 0.1, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.065, 0.035, 8, 16, Math.PI * 1.3]} />
          <meshStandardMaterial color="#d4944d" roughness={0.7} />
        </mesh>
      </group>

      {/* 2. Cinnamon Swirl Roll */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 16]} />
          <meshStandardMaterial color="#9c6644" roughness={0.8} />
        </mesh>
        {/* Vanilla Sugar Drizzle */}
        <mesh position={[0, 0.068, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.005, 16]} />
          <meshStandardMaterial color="#fefae0" roughness={0.3} />
        </mesh>
      </group>

      {/* 3. Chocolate Muffin */}
      <group position={[0.26, 0.1, 0]}>
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.05, 16]} />
          <meshStandardMaterial color="#ede0d4" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.065, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color="#43281c" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// 4. Vintage Turntable with Spinning Vinyl Record & Glowing Vacuum Tubes
export function VinylTurntable({ position }: { position: [number, number, number] }) {
  const vinylRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (vinylRef.current) {
      vinylRef.current.rotation.z -= delta * 1.8 // 33 RPM spin
    }
  })

  return (
    <group position={position}>
      {/* Wooden Plinth Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#362215" roughness={0.5} />
      </mesh>

      {/* Aluminum Platter */}
      <mesh position={[-0.06, 0.085, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.015, 24]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Spinning Vinyl Record */}
      <mesh ref={vinylRef} position={[-0.06, 0.095, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.03, 0.145, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Vinyl Center Paper Label */}
      <mesh position={[-0.06, 0.096, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <circleGeometry args={[0.04, 24]} />
        <meshStandardMaterial color="#c86d51" roughness={0.6} />
      </mesh>

      {/* Brass Tonearm */}
      <group position={[0.16, 0.1, 0.12]}>
        {/* Pivot Column */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} />
        </mesh>
        {/* Arm Rod pointing across record */}
        <mesh position={[-0.1, 0.05, -0.06]} rotation={[0, -0.6, Math.PI * 0.5]}>
          <cylinderGeometry args={[0.004, 0.004, 0.22, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} />
        </mesh>
      </group>

      {/* Glowing Warm Vacuum Tubes */}
      {[0.12, 0.18].map((x, i) => (
        <group key={i} position={[x, 0.09, -0.1]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
            <meshPhysicalMaterial transparent opacity={0.6} color="#ffe8d6" roughness={0.1} />
          </mesh>
          {/* Glowing Filament */}
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshBasicMaterial color="#ff7b00" />
          </mesh>
          <pointLight color="#ff8500" intensity={0.4} distance={0.8} decay={2} />
        </group>
      ))}
    </group>
  )
}
