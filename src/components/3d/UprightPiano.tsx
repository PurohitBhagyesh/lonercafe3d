import React, { useRef } from 'react'
import * as THREE from 'three'

interface UprightPianoProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export function UprightPiano({ position, rotation = [0, 0, 0] }: UprightPianoProps) {
  // Piano keys definition: 21 white keys across 3 octaves
  const whiteKeyCount = 21
  const blackKeysIndices = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20]

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Main Upright Piano Walnut Wooden Cabinet */}
      {/* Lower Front Board */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.84, 0.54]} />
        <meshStandardMaterial color="#2d170e" roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Upper Soundboard & Front Cabinet */}
      <mesh position={[0, 1.15, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[1.48, 0.64, 0.42]} />
        <meshStandardMaterial color="#2d170e" roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Top Lid / Cornice */}
      <mesh position={[0, 1.48, -0.06]} castShadow>
        <boxGeometry args={[1.54, 0.05, 0.46]} />
        <meshStandardMaterial color="#24120a" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Left & Right Side Cheeks / Columns */}
      {[-0.73, 0.73].map((x, i) => (
        <group key={i} position={[x, 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 1.44, 0.58]} />
            <meshStandardMaterial color="#221109" roughness={0.35} />
          </mesh>
          {/* Classical Front Column Carving */}
          <mesh position={[0, -0.3, 0.28]}>
            <cylinderGeometry args={[0.035, 0.04, 0.68, 12]} />
            <meshStandardMaterial color="#2d170e" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 2. Keybed Shelf */}
      <mesh position={[0, 0.72, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.32]} />
        <meshStandardMaterial color="#1a0c06" roughness={0.4} />
      </mesh>

      {/* 3. Detailed Keyboard: White Ivory Keys */}
      <group position={[-0.58, 0.76, 0.24]}>
        {Array.from({ length: whiteKeyCount }).map((_, idx) => {
          const keyWidth = 0.055
          return (
            <mesh key={`w-${idx}`} position={[idx * keyWidth, 0, 0]} castShadow>
              <boxGeometry args={[0.052, 0.024, 0.22]} />
              <meshStandardMaterial color="#fcfaf2" roughness={0.25} />
            </mesh>
          )
        })}

        {/* Black Ebony Sharp Keys */}
        {blackKeysIndices.map((idx) => {
          const keyWidth = 0.055
          return (
            <mesh
              key={`b-${idx}`}
              position={[idx * keyWidth - keyWidth * 0.5, 0.018, -0.04]}
              castShadow
            >
              <boxGeometry args={[0.032, 0.028, 0.14]} />
              <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.2} />
            </mesh>
          )
        })}
      </group>

      {/* 4. Hinged Fallboard & Music Stand */}
      <mesh position={[0, 0.88, 0.1]} rotation={[-Math.PI * 0.12, 0, 0]}>
        <boxGeometry args={[1.38, 0.2, 0.02]} />
        <meshStandardMaterial color="#28140b" roughness={0.35} />
      </mesh>

      {/* Brass Music Stand Ledge */}
      <group position={[0, 0.98, 0.14]}>
        <mesh>
          <boxGeometry args={[0.72, 0.02, 0.06]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Open Sheet Music (Erik Satie / Chopin score) */}
        <mesh position={[0, 0.14, -0.02]} rotation={[-Math.PI * 0.08, 0, 0]}>
          <planeGeometry args={[0.42, 0.28]} />
          <meshStandardMaterial color="#fbf7ec" roughness={0.8} />
        </mesh>
        {/* Sheet Music Staff Lines */}
        {[-0.08, -0.02, 0.04, 0.1].map((y, lineIdx) => (
          <mesh key={lineIdx} position={[0, 0.14 + y, -0.018]} rotation={[-Math.PI * 0.08, 0, 0]}>
            <planeGeometry args={[0.36, 0.003]} />
            <meshBasicMaterial color="#3d2a1f" />
          </mesh>
        ))}
      </group>

      {/* 5. Triple Polished Brass Pedals */}
      <group position={[0, 0.06, 0.24]}>
        {[-0.09, 0, 0.09].map((x, pIdx) => (
          <group key={pIdx} position={[x, 0, 0]}>
            <mesh rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.035, 0.015, 0.12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.02, -0.04]}>
              <boxGeometry args={[0.05, 0.05, 0.02]} />
              <meshStandardMaterial color="#1a110a" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Upholstered Velvet Piano Bench / Stool */}
      <group position={[0, 0, 0.65]}>
        {/* Velvet Wine-Red Tufted Cushion */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.72, 0.08, 0.36]} />
          <meshStandardMaterial color="#58181e" roughness={0.9} />
        </mesh>
        {/* Bench Walnut Apron & Frame */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.34]} />
          <meshStandardMaterial color="#2d170e" roughness={0.4} />
        </mesh>
        {/* 4 Fluted Legs with Brass Ferrules */}
        {[-0.3, 0.3].map((x, lx) =>
          [-0.13, 0.13].map((z, lz) => (
            <group key={`${lx}-${lz}`} position={[x, 0.2, z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.022, 0.016, 0.4, 8]} />
                <meshStandardMaterial color="#24120a" roughness={0.4} />
              </mesh>
              {/* Brass Ferrule Tip */}
              <mesh position={[0, -0.18, 0]}>
                <cylinderGeometry args={[0.017, 0.015, 0.04, 8]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} />
              </mesh>
            </group>
          ))
        )}
      </group>
    </group>
  )
}
