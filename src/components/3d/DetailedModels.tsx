// AI Procedural High-Fidelity 3D Models for lonercafe3d
// Intricate geometric craftsmanship with PBR materials
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 1. Vintage Hand-Cranked Brass & Walnut Coffee Grinder
export function VintageCoffeeGrinder({ position }: { position: [number, number, number] }) {
  const crankRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (crankRef.current) {
      // Gentle subtle crank vibration
      const t = state.clock.elapsedTime
      crankRef.current.rotation.y = Math.sin(t * 0.5) * 0.08
    }
  })

  return (
    <group position={position}>
      {/* Hand-Joined Walnut Base Box */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.14, 0.18]} />
        <meshStandardMaterial color="#3b2214" roughness={0.6} />
      </mesh>
      {/* Molded Base & Top Plinth */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.2, 0.015, 0.2]} />
        <meshStandardMaterial color="#2d170d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.145, 0]}>
        <boxGeometry args={[0.19, 0.012, 0.19]} />
        <meshStandardMaterial color="#2d170d" roughness={0.7} />
      </mesh>

      {/* Slide-out Ground Coffee Drawer Front */}
      <mesh position={[0, 0.055, 0.092]}>
        <boxGeometry args={[0.12, 0.08, 0.008]} />
        <meshStandardMaterial color="#2a150b" roughness={0.65} />
      </mesh>
      {/* Turned Brass Drawer Pull Knob */}
      <mesh position={[0, 0.055, 0.102]}>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Spun Brass Hemispherical Hopper Bowl */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.07, 16, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Whole Roasted Dark Beans inside the Hopper */}
      <group position={[0, 0.17, 0]}>
        {[-0.02, 0, 0.02].map((x, i) =>
          [-0.02, 0.01, 0.02].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, (i + j) * 0.004, z]} rotation={[i, j, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color="#211208" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* Center Brass Spindle & S-Curved Crank */}
      <group ref={crankRef} position={[0, 0.21, 0]}>
        {/* Vertical Spindle Pin */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        {/* Horizontal Curved Crank Arm */}
        <mesh position={[0.06, 0.038, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.006, 0.014]} />
          <meshStandardMaterial color="#222" metalness={0.7} />
        </mesh>
        {/* Turned Hardwood Upright Handle */}
        <mesh position={[0.11, 0.068, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.01, 0.055, 12]} />
          <meshStandardMaterial color="#5c3822" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// 2. Victorian Morning-Glory Brass Fluted Gramophone
export function VictorianGramophone({ position }: { position: [number, number, number] }) {
  const turntableRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (turntableRef.current) {
      // Smooth 33 RPM rotation
      turntableRef.current.rotation.y += delta * 1.5
    }
  })

  return (
    <group position={position}>
      {/* Octagonal Stepped Mahogany Cabinet Base */}
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.16, 8]} />
        <meshStandardMaterial color="#3b1d11" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Brass Corner Filigree Badges */}
      {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.21, 0.09, Math.cos(angle) * 0.21]}>
          <boxGeometry args={[0.015, 0.12, 0.015]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Revolving Turntable Platter */}
      <group ref={turntableRef} position={[0, 0.18, 0]}>
        {/* Felt Platter */}
        <mesh>
          <cylinderGeometry args={[0.17, 0.17, 0.012, 24]} />
          <meshStandardMaterial color="#1a2e26" roughness={0.9} />
        </mesh>
        {/* Vinyl Shellac Record with Microgrooves */}
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.004, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* Vintage Paper Record Label */}
        <mesh position={[0, 0.011, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.002, 24]} />
          <meshStandardMaterial color="#c29b38" roughness={0.7} />
        </mesh>
      </group>

      {/* Tonearm & Soundbox Needle */}
      <group position={[0.12, 0.22, 0.1]}>
        <mesh position={[-0.04, 0, -0.04]} rotation={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Circular Soundbox Reproducer */}
        <mesh position={[-0.09, -0.015, -0.09]} rotation={[Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* Fluted Morning-Glory Brass Horn */}
      <group position={[-0.08, 0.38, -0.06]} rotation={[-0.3, 0.4, 0]}>
        {/* Support Elbow Tube */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.022, 0.025, 0.22, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Expanding Fluted Horn Cone */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.26, 0.36, 16, 1, true]} />
          <meshStandardMaterial color="#e5b842" metalness={0.88} roughness={0.22} side={THREE.DoubleSide} />
        </mesh>
        {/* Flared Bell Rim */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.26, 0.018, 12, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  )
}

// 3. Antique Leather-Bound Folios Stack
export function AntiquarianBookStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bottom Folio: Deep Oxblood Leather */}
      <group position={[0, 0.025, 0]} rotation={[0, 0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.045, 0.26]} />
          <meshStandardMaterial color="#4a1515" roughness={0.65} />
        </mesh>
        {/* Deckled Edge Paper Pages */}
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.32, 0.04, 0.24]} />
          <meshStandardMaterial color="#edd8b4" roughness={0.9} />
        </mesh>
        {/* Gold Leaf Spine Ribs */}
        {[-0.08, 0, 0.08].map((z, i) => (
          <mesh key={i} position={[-0.171, 0, z]}>
            <boxGeometry args={[0.004, 0.042, 0.012]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Middle Folio: Forest Green Moroccan Calfskin */}
      <group position={[0.01, 0.065, 0.01]} rotation={[0, -0.15, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.038, 0.23]} />
          <meshStandardMaterial color="#1c3a27" roughness={0.6} />
        </mesh>
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.28, 0.034, 0.21]} />
          <meshStandardMaterial color="#edd8b4" roughness={0.9} />
        </mesh>
      </group>

      {/* Top Folio: Navy Gilded Book */}
      <group position={[-0.01, 0.098, -0.01]} rotation={[0, 0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.032, 0.2]} />
          <meshStandardMaterial color="#1b2a4a" roughness={0.6} />
        </mesh>
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.24, 0.028, 0.18]} />
          <meshStandardMaterial color="#f0e2c8" roughness={0.9} />
        </mesh>
        {/* Silk Bookmark Ribbon Draped Out */}
        <mesh position={[0.13, -0.04, 0.05]} rotation={[0.4, 0.2, 0.3]}>
          <boxGeometry args={[0.015, 0.08, 0.004]} />
          <meshStandardMaterial color="#c93838" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
