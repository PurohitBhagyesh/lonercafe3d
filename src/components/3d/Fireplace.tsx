import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundEngine } from '../../audio/soundEngine'

export function CastIronFireplace({ position }: { position: [number, number, number] }) {
  const flameLightRef = useRef<THREE.PointLight>(null)
  const embersRef = useRef<THREE.Points>(null)

  // Floating glowing embers
  const emberCount = 35
  const [emberGeo, emberPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(emberCount * 3)
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.35
      pos[i * 3 + 1] = Math.random() * 0.35 + 0.1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.25
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  useFrame((state, delta) => {
    // Flickering firelight
    if (flameLightRef.current) {
      flameLightRef.current.intensity = 1.8 + Math.sin(state.clock.elapsedTime * 8) * 0.3 + (Math.random() - 0.5) * 0.15
    }

    // Floating embers rising
    if (embersRef.current) {
      const positions = embersRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3 + 1] += delta * 0.35
        positions[i * 3 + 0] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.002
        if (positions[i * 3 + 1] > 0.55) {
          positions[i * 3 + 1] = 0.1
          positions[i * 3 + 0] = (Math.random() - 0.5) * 0.35
        }
      }
      embersRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Stone Hearth Base Plinth */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[0.9, 0.08, 0.8]} />
        <meshStandardMaterial color="#221814" roughness={0.9} />
      </mesh>

      {/* Cast Iron Stove Body */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.72, 0.55]} />
        <meshStandardMaterial color="#1a1817" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Stove Legs */}
      {[-0.26, 0.26].map((x, i) =>
        [-0.2, 0.2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.1, z]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.14, 8]} />
            <meshStandardMaterial color="#141312" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* Chimney Stovepipe leading up through ceiling */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 2.2, 16]} />
        <meshStandardMaterial color="#181716" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Pipe Elbow Collar */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.06, 16]} />
        <meshStandardMaterial color="#2a2826" metalness={0.8} />
      </mesh>

      {/* Arched Firebox Glass Door */}
      <mesh position={[0, 0.42, 0.28]}>
        <planeGeometry args={[0.42, 0.4]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.35}
          roughness={0.15}
          color="#ffb703"
          transmission={0.85}
        />
      </mesh>
      {/* Brass Door Handle */}
      <mesh position={[0.22, 0.42, 0.29]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </mesh>

      {/* Fireplace Interior Coals & Logs */}
      <group position={[0, 0.25, 0.08]}>
        {/* Birch Firewood Logs */}
        <mesh position={[-0.08, 0.04, 0]} rotation={[0, 0.4, Math.PI * 0.48]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 0.32, 8]} />
          <meshStandardMaterial color="#3a2416" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, 0.08, -0.04]} rotation={[0, -0.5, -Math.PI * 0.48]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.9} />
        </mesh>

        {/* Glowing Orange Embers Bed */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.4, 0.06, 0.3]} />
          <meshStandardMaterial
            color="#ff4800"
            emissive="#ff3300"
            emissiveIntensity={2}
            roughness={0.9}
          />
        </mesh>

        {/* Dynamic Warm Fireplace Light */}
        <pointLight
          ref={flameLightRef}
          color="#ff7b00"
          intensity={2.2}
          distance={4.5}
          decay={2}
          position={[0, 0.15, 0.15]}
        />

        {/* Rising Glowing Embers Particle Points */}
        <points ref={embersRef} geometry={emberGeo}>
          <pointsMaterial
            color="#ffbe0b"
            size={0.035}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  )
}
