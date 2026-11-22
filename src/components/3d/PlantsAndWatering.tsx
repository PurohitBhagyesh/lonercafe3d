import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, PlantState } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

export function WateringCanMesh({ position, isHeld = false }: { position: [number, number, number]; isHeld?: boolean }) {
  return (
    <group position={position} rotation={isHeld ? [0.2, -0.4, 0] : [0, 0.4, 0]}>
      {/* Hand-Hammered Vintage Copper Body */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Long Angled Brass Spout */}
      <mesh position={[0.08, 0.14, 0]} rotation={[0, 0, -Math.PI * 0.28]}>
        <cylinderGeometry args={[0.012, 0.016, 0.18, 12]} />
        <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Brass Rose Sprinkler Nozzle Head */}
      <mesh position={[0.16, 0.22, 0]} rotation={[0, 0, -Math.PI * 0.28]}>
        <cylinderGeometry args={[0.025, 0.015, 0.03, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Arching Loop Handle */}
      <mesh position={[-0.04, 0.18, 0]} rotation={[0, 0, Math.PI * 0.5]}>
        <torusGeometry args={[0.08, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  )
}

// 1. Monstera Deliciosa (Library Corner)
function MonsteraModel({ plant }: { plant: PlantState }) {
  return (
    <group>
      {/* Terracotta Plant Pot */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.48, 20]} />
        <meshStandardMaterial color="#c36b47" roughness={0.85} />
      </mesh>
      {/* Soil (turns rich dark glistening brown when hydrated) */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 20]} />
        <meshStandardMaterial
          color={plant.hydrated ? '#1a110a' : '#573d27'}
          roughness={plant.hydrated ? 0.25 : 0.9}
        />
      </mesh>

      {/* Monstera Stems & Broad Fenestrated Leaves */}
      <group position={[0, 0.48, 0]}>
        {[
          { rot: [0.35, 0.2, 0.4], scale: [1.1, 1, 1.2], pos: [0.08, 0.25, 0.06] },
          { rot: [-0.3, 1.4, -0.3], scale: [1.2, 1, 1], pos: [-0.1, 0.4, -0.06] },
          { rot: [0.4, 2.6, 0.2], scale: [1, 1.1, 1.1], pos: [0.1, 0.35, -0.08] },
          { rot: [-0.25, 3.8, 0.5], scale: [1.2, 1.2, 1.1], pos: [-0.08, 0.5, 0.1] },
          { rot: [0.15, 5.1, -0.4], scale: [1.1, 1.2, 1.2], pos: [0.06, 0.65, 0.05] },
        ].map((leaf, idx) => (
          <group key={idx} position={leaf.pos as [number, number, number]} rotation={leaf.rot as [number, number, number]}>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.01, 0.015, 0.28, 8]} />
              <meshStandardMaterial color="#2d5035" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.28, 0]} rotation={[Math.PI * 0.25, 0, 0]} castShadow>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial
                color={plant.hydrated ? '#1e5e3a' : '#496350'}
                roughness={plant.hydrated ? 0.3 : 0.8}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// 2. Desk Bonsai (Writing Nook)
function BonsaiModel({ plant }: { plant: PlantState }) {
  return (
    <group>
      {/* Glazed Ceramic Shallow Oval Bonsai Pot */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.15, 0.08, 20]} />
        <meshStandardMaterial color="#1a2f3b" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Moss & Soil Bed */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 20]} />
        <meshStandardMaterial
          color={plant.hydrated ? '#283618' : '#606c38'}
          roughness={plant.hydrated ? 0.3 : 0.9}
        />
      </mesh>

      {/* Gnarled Aged Trunk */}
      <group position={[0, 0.08, 0]}>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.02, 0.035, 0.16, 8]} />
          <meshStandardMaterial color="#382216" roughness={0.8} />
        </mesh>
        <mesh position={[0.04, 0.18, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.012, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#382216" roughness={0.8} />
        </mesh>

        {/* Cloud-like Pine Foliage Pads */}
        {[
          [0.08, 0.24, 0],
          [-0.04, 0.18, 0.04],
          [0.02, 0.28, -0.03]
        ].map((padPos, idx) => (
          <mesh key={idx} position={padPos as [number, number, number]} castShadow>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial
              color={plant.hydrated ? '#1e4d2b' : '#3d5a42'}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function PlantsAndWatering() {
  const { plants, waterPlant, heldItem, setHeldItem } = useGameStore()

  return (
    <group>
      {/* 1. Vintage Copper Watering Can on shelf */}
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

      {/* 2. Interactive Plant Collection */}
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
          {plant.id === 'plant-desk' ? (
            <BonsaiModel plant={plant} />
          ) : (
            <MonsteraModel plant={plant} />
          )}

          {/* Hydration Ambient Glow */}
          {plant.hydrated && (
            <pointLight color="#80ed99" intensity={0.5} distance={1.2} decay={2} position={[0, 0.6, 0]} />
          )}
        </group>
      ))}
    </group>
  )
}
