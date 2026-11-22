import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function WateringCanMesh({ position, isHeld = false }: { position: [number, number, number]; isHeld?: boolean }) {
  return (
    <group position={position} rotation={isHeld ? [0.2, -0.4, 0] : [0, 0.4, 0]}>
      {/* Copper Body */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Long Spout */}
      <mesh position={[0.08, 0.14, 0]} rotation={[0, 0, -Math.PI * 0.28]}>
        <cylinderGeometry args={[0.012, 0.016, 0.18, 12]} />
        <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Spout Rose / Sprinkler Head */}
      <mesh position={[0.16, 0.22, 0]} rotation={[0, 0, -Math.PI * 0.28]}>
        <cylinderGeometry args={[0.025, 0.015, 0.03, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Top Arch Handle */}
      <mesh position={[-0.04, 0.18, 0]} rotation={[0, 0, Math.PI * 0.5]}>
        <torusGeometry args={[0.08, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function PlantsAndWatering() {
  const { plants, waterPlant, heldItem, setHeldItem } = useGameStore()
  const wateringParticlesRef = useRef<THREE.Points>(null)
  const isWateringRef = useRef(false)

  // Water droplets particles
  const dropletCount = 40
  const [dropletGeo, dropletPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(dropletCount * 3)
    for (let i = 0; i < dropletCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.2
      pos[i * 3 + 1] = Math.random() * 0.3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  return (
    <group>
      {/* 1. Vintage Watering Can on lower shelf of library */}
      {heldItem?.type !== 'watering-can' && (
        <group
          position={[-4.9, 0.48, 0.5]}
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.playIpodClick()
            setHeldItem({
              id: 'copper-watering-can',
              name: 'Vintage Copper Watering Can',
              type: 'watering-can'
            })
          }}
        >
          <WateringCanMesh position={[0, 0, 0]} />
        </group>
      )}

      {/* 2. Interactive Potted Plants */}
      {plants.map((plant) => (
        <group
          key={plant.id}
          position={plant.position}
          onClick={(e) => {
            e.stopPropagation()
            if (heldItem?.type === 'watering-can') {
              soundEngine.playWaterSound()
              soundEngine.playPlantSparkle()
              waterPlant(plant.id)
            }
          }}
        >
          {/* Ceramic Pot */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.16, 0.44, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.8} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.04, 16]} />
            <meshStandardMaterial color="#2d1d12" roughness={0.9} />
          </mesh>

          {/* Plant Stems & Broad Leaves */}
          <group position={[0, 0.45, 0]}>
            {[
              { rot: [0.3, 0.2, 0.4], scale: [1, 1, 1], pos: [0.05, 0.2, 0.05] },
              { rot: [-0.3, 1.4, -0.3], scale: [1.1, 1, 0.9], pos: [-0.08, 0.35, -0.05] },
              { rot: [0.4, 2.6, 0.2], scale: [0.9, 1.1, 1], pos: [0.08, 0.3, -0.06] },
              { rot: [-0.2, 3.8, 0.5], scale: [1.1, 1.2, 1], pos: [-0.06, 0.45, 0.08] },
              { rot: [0.1, 5.1, -0.4], scale: [1, 1.1, 1.1], pos: [0.05, 0.55, 0.04] },
            ].map((leaf, lIdx) => (
              <group key={lIdx} position={leaf.pos as [number, number, number]} rotation={leaf.rot as [number, number, number]}>
                {/* Thin Stem */}
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.008, 0.012, 0.22, 6]} />
                  <meshStandardMaterial color="#2a4d33" roughness={0.7} />
                </mesh>
                {/* Leaf Blade */}
                <mesh position={[0, 0.24, 0]} rotation={[Math.PI * 0.2, 0, 0]} castShadow>
                  <sphereGeometry args={[0.16, 8, 8]} />
                  <meshStandardMaterial
                    color={plant.hydrated ? '#2d6a4f' : '#526955'}
                    roughness={plant.hydrated ? 0.3 : 0.8}
                  />
                </mesh>
              </group>
            ))}

            {/* Sparkle halo when hydrated */}
            {plant.hydrated && (
              <pointLight color="#74c69d" intensity={0.6} distance={1.2} decay={2} position={[0, 0.6, 0]} />
            )}
          </group>
        </group>
      ))}
    </group>
  )
}
