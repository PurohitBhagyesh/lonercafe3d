import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createChalkboardTexture } from '../../utils/proceduralTextures'

// 1. Real-Time Synchronized Regulator Wall Clock with Swinging Pendulum
export function RealTimeWallClock({ position }: { position: [number, number, number] }) {
  const hourHandRef = useRef<THREE.Group>(null)
  const minuteHandRef = useRef<THREE.Group>(null)
  const secondHandRef = useRef<THREE.Group>(null)
  const pendulumRef = useRef<THREE.Group>(null)

  useFrame((state) => {
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

    // Swinging pendulum at 1Hz natural harmonic beat
    if (pendulumRef.current) {
      const t = state.clock.elapsedTime
      pendulumRef.current.rotation.z = Math.sin(t * Math.PI * 1.8) * 0.16
    }
  })

  return (
    <group position={position}>
      {/* Wooden Regulator Clock Case Extension (Lower Housing) */}
      <mesh position={[0, -0.42, -0.01]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.65, 0.08]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.65} />
      </mesh>
      {/* Lower Glass Window Pane */}
      <mesh position={[0, -0.42, 0.035]}>
        <planeGeometry args={[0.26, 0.52]} />
        <meshPhysicalMaterial transparent opacity={0.25} roughness={0.05} color="#e8f4fd" />
      </mesh>

      {/* Swinging Brass Pendulum */}
      <group ref={pendulumRef} position={[0, -0.15, 0.015]}>
        {/* Brass Rod */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.44, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Heavy Brass Bob Disc */}
        <mesh position={[0, -0.44, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.016, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

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

// 5. Coffee Bean Glass Apothecary Jars on the Bar Counter
export function CoffeeBeanJars({ position }: { position: [number, number, number] }) {
  const beanRoasts = [
    { color: '#2b170c', label: 'Dark Sumatra' },
    { color: '#54321c', label: 'Ethiopia Yirgacheffe' },
    { color: '#68784d', label: 'Green Raw Geisha' }
  ]

  return (
    <group position={position}>
      {beanRoasts.map((roast, idx) => (
        <group key={idx} position={[(idx - 1) * 0.22, 0, 0]}>
          {/* Clear Glass Jar Body */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.2, 16]} />
            <meshPhysicalMaterial transparent opacity={0.35} roughness={0.05} transmission={0.9} color="#eef6fb" />
          </mesh>
          {/* Coffee Beans Fill Inside */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.058, 0.058, 0.15, 16]} />
            <meshStandardMaterial color={roast.color} roughness={0.7} />
          </mesh>
          {/* Natural Cork Stopper */}
          <mesh position={[0, 0.21, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#c4a482" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// 6. Cozy Scented Candle in Amber Glass with Flickering Wick
export function ScentedCandle({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime
      lightRef.current.intensity = 0.5 + Math.sin(t * 8) * 0.06 + Math.cos(t * 13) * 0.04
    }
  })

  return (
    <group position={position}>
      {/* Amber Glass Tumbler Jar */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.1, 16]} />
        <meshPhysicalMaterial transparent opacity={0.75} roughness={0.15} color="#b86b2b" />
      </mesh>
      {/* Soy Wax Fill */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.08, 16]} />
        <meshStandardMaterial color="#faf6ee" roughness={0.6} />
      </mesh>
      {/* Tiny Golden Flame Wick */}
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.008, 0.024, 8]} />
        <meshBasicMaterial color="#ffb703" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.12, 0]} color="#ff9e00" intensity={0.5} distance={2.5} decay={2} />
    </group>
  )
}

// 7. Woven Wicker Blanket Basket by the Armchair
export function BlanketBasket({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Woven Basket */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.2, 0.36, 16]} />
        <meshStandardMaterial color="#8b5e34" roughness={0.9} />
      </mesh>
      {/* Rolled Soft Flannel Throws */}
      <group position={[0, 0.28, 0]}>
        <mesh position={[-0.08, 0, 0.05]} rotation={[0.4, 0.2, 0.3]}>
          <cylinderGeometry args={[0.07, 0.07, 0.24, 12]} />
          <meshStandardMaterial color="#7f4f24" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, 0, -0.04]} rotation={[-0.3, 0.4, -0.2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.24, 12]} />
          <meshStandardMaterial color="#936639" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0.1, -0.3, 0.4]}>
          <cylinderGeometry args={[0.065, 0.065, 0.22, 12]} />
          <meshStandardMaterial color="#eddcd2" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

// 8. Bentwood Vintage Coat Rack with Hanging Trench Coat & Scarf
export function BentwoodCoatRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stand Base Pegs */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
        <meshStandardMaterial color="#2d170e" roughness={0.6} />
      </mesh>
      {/* Tall Turned Center Post */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 1.95, 12]} />
        <meshStandardMaterial color="#2d170e" roughness={0.5} />
      </mesh>
      {/* Curved Peg Hooks */}
      {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={i} position={[0, 1.75, 0]} rotation={[0, angle, 0]}>
          <mesh position={[0.1, 0.06, 0]} rotation={[0, 0, -Math.PI * 0.25]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
            <meshStandardMaterial color="#2d170e" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Hanging Woolen Scarf */}
      <mesh position={[0.12, 1.45, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.05, 0.48, 0.12]} />
        <meshStandardMaterial color="#9c4221" roughness={0.9} />
      </mesh>
    </group>
  )
}

// 9. Warm Brass Fluted Hanging Pendant Lamp
export function HangingPendantLamp({
  position,
  lightIntensity = 2.4,
  lightDistance = 12
}: {
  position: [number, number, number]
  lightIntensity?: number
  lightDistance?: number
}) {
  return (
    <group position={position}>
      {/* Thin black suspension cord from ceiling beam */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.0, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Spun Brass Shade Socket & Top Cap */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.08, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Flared Warm Amber / Brass Dome Shade */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <coneGeometry args={[0.22, 0.16, 24, 1, true]} />
        <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing Warm Edison Filament Bulb */}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffe8aa" />
      </mesh>
      {/* Dedicated Point Light */}
      <pointLight
        position={[0, -0.06, 0]}
        color="#ffe2ba"
        intensity={lightIntensity}
        distance={lightDistance}
        decay={1.2}
      />
    </group>
  )
}

// 10. Peaceful Sleeping Calico Café Cat curled by the hearth
export function SleepingCafeCat({ position }: { position: [number, number, number] }) {
  const catBodyRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (catBodyRef.current) {
      const t = state.clock.elapsedTime
      // Rhythmic gentle breathing: expansion & relaxation
      const breath = Math.sin(t * 1.6) * 0.025
      catBodyRef.current.scale.set(1 + breath * 0.8, 1 + breath, 1 + breath * 0.8)
    }
  })

  return (
    <group position={position}>
      {/* Knitted Round Oatmeal Wool Cushion */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.08, 20]} />
        <meshStandardMaterial color="#d6c7b2" roughness={0.9} />
      </mesh>
      {/* Cat Cushion Cord Piping */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.28, 0.016, 8, 24]} />
        <meshStandardMaterial color="#b5a28a" roughness={0.8} />
      </mesh>

      {/* Sleeping Cat Curled Group */}
      <group ref={catBodyRef} position={[0, 0.09, 0]}>
        {/* Curled Body Crescent */}
        <mesh position={[0, 0.07, 0]} rotation={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#d97736" roughness={0.8} />
        </mesh>
        {/* Calico White & Dark Patches */}
        <mesh position={[-0.05, 0.08, 0.04]} rotation={[0.2, 0.4, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#fefefe" roughness={0.8} />
        </mesh>
        <mesh position={[0.06, 0.09, -0.03]} rotation={[-0.2, 0.1, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#2d1c14" roughness={0.8} />
        </mesh>

        {/* Sleeping Cat Head Tucked Resting */}
        <group position={[-0.1, 0.07, 0.08]} rotation={[0.1, 0.8, -0.1]}>
          <mesh castShadow>
            <sphereGeometry args={[0.075, 14, 14]} />
            <meshStandardMaterial color="#d97736" roughness={0.8} />
          </mesh>
          {/* White Muzzle */}
          <mesh position={[0, -0.02, 0.06]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#fafafa" roughness={0.7} />
          </mesh>
          {/* Left & Right Triangular Ears */}
          <mesh position={[-0.035, 0.06, 0.01]} rotation={[-0.2, 0, 0.3]}>
            <coneGeometry args={[0.025, 0.04, 4]} />
            <meshStandardMaterial color="#cf6a27" roughness={0.8} />
          </mesh>
          <mesh position={[0.035, 0.06, 0.01]} rotation={[-0.2, 0, -0.3]}>
            <coneGeometry args={[0.025, 0.04, 4]} />
            <meshStandardMaterial color="#cf6a27" roughness={0.8} />
          </mesh>
        </group>

        {/* Curled Fluffy Tail */}
        <mesh position={[0.08, 0.04, 0.04]} rotation={[0, -0.8, 0.2]}>
          <cylinderGeometry args={[0.022, 0.028, 0.26, 8]} />
          <meshStandardMaterial color="#fefefe" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// 11. Vintage Emerald Banker's Desk Lamp with Pull Chain
export function BankersDeskLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Heavy Stepped Brass Base */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
      {/* Curved Brass Gooseneck Arm */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.28, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.3, 0.03]} rotation={[Math.PI * 0.35, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.08, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
      </mesh>
      {/* Cylindrical Emerald Green Glass Shade */}
      <mesh position={[0, 0.31, 0.08]} rotation={[0, 0, Math.PI * 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.22, 16, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#125438"
          roughness={0.12}
          transmission={0.65}
          thickness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner Soft Filament Glow */}
      <mesh position={[0, 0.3, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
        <meshBasicMaterial color="#ffe8aa" />
      </mesh>
      <pointLight position={[0, 0.28, 0.08]} color="#ffe0a0" intensity={1.8} distance={3.5} decay={1.5} />
    </group>
  )
}


