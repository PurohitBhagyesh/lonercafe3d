import { useRef } from 'react'
import * as THREE from 'three'

export function Furniture() {
  return (
    <group>
      {/* 1. Long Window Counter & Stools along the glass window */}
      <group position={[0, 0, -4.8]}>
        {/* Countertop */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[11, 0.1, 0.9]} />
          <meshStandardMaterial color="#402819" roughness={0.6} />
        </mesh>
        {/* Counter Supports */}
        {[-4.5, -1.5, 1.5, 4.5].map((x, i) => (
          <mesh key={i} position={[x, 0.45, 0.2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#1a1410" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Cozy Stools */}
        {[-3.8, -1.8, 0, 1.8, 3.8].map((x, i) => (
          <group key={i} position={[x, 0, 0.5]}>
            {/* Cushion */}
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.1, 16]} />
              <meshStandardMaterial color="#7a3e26" roughness={0.8} />
            </mesh>
            {/* Stool Leg */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.6, 12]} />
              <meshStandardMaterial color="#1a1410" metalness={0.7} />
            </mesh>
            {/* Stool Base */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
              <meshStandardMaterial color="#1a1410" metalness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. Barista Coffee Bar Counter (Right side) */}
      <group position={[3.6, 0, -0.5]}>
        {/* Main Bar Base */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.1, 4.2]} />
          <meshStandardMaterial color="#2d1c13" roughness={0.7} />
        </mesh>
        {/* Granite Countertop */}
        <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.06, 4.4]} />
          <meshStandardMaterial color="#1f1b19" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Vintage Espresso Machine */}
        <group position={[0, 1.35, -0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.5, 0.6]} />
            <meshStandardMaterial color="#943126" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Chrome Pipes & Portafilters */}
          <mesh position={[-0.2, -0.15, 0.32]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.2, -0.15, 0.32]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Coffee Grinder */}
        <group position={[0.1, 1.35, 0.2]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.08, 0.25, 16]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.5} />
          </mesh>
        </group>

        {/* Cup Stack */}
        {[-0.15, 0, 0.15].map((x, i) => (
          <group key={i} position={[x, 1.18, 1.2]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.04, 0.14, 12]} />
              <meshStandardMaterial color="#f4ede4" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. The Library Bookshelves (Left Wall) */}
      <group position={[-5.2, 0, -0.8]}>
        {/* Bookshelf Frame */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 3.2, 4.5]} />
          <meshStandardMaterial color="#352115" roughness={0.7} />
        </mesh>
        {/* Books on Shelves */}
        {[-1.0, -0.3, 0.4, 1.1].map((shelfY, sIdx) => (
          <group key={sIdx} position={[0.15, 1.6 + shelfY, 0]}>
            {[-1.8, -1.3, -0.8, -0.3, 0.2, 0.7, 1.2, 1.6].map((bookZ, bIdx) => (
              <mesh key={bIdx} position={[0, 0.16, bookZ]} castShadow>
                <boxGeometry args={[0.35, 0.3 + (bIdx % 3) * 0.05, 0.08]} />
                <meshStandardMaterial 
                  color={['#843b22', '#2f4f4f', '#8b5a2b', '#4a3b32', '#6b4226', '#3b5323'][bIdx % 6]} 
                  roughness={0.6} 
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 4. Solitary Reading Armchair & Table in Corner */}
      <group position={[-3.5, 0, 2.8]}>
        {/* Cozy Wingback Armchair */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI * 0.25, 0]}>
          {/* Seat Cushion */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.75, 0.2, 0.75]} />
            <meshStandardMaterial color="#6a3523" roughness={0.8} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.75, -0.32]} castShadow>
            <boxGeometry args={[0.75, 0.7, 0.16]} />
            <meshStandardMaterial color="#6a3523" roughness={0.8} />
          </mesh>
          {/* Left Armrest */}
          <mesh position={[-0.38, 0.52, 0]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.7]} />
            <meshStandardMaterial color="#6a3523" roughness={0.8} />
          </mesh>
          {/* Right Armrest */}
          <mesh position={[0.38, 0.52, 0]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.7]} />
            <meshStandardMaterial color="#6a3523" roughness={0.8} />
          </mesh>
        </group>

        {/* Small Round Side Table */}
        <group position={[0.9, 0, 0.5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
            <meshStandardMaterial color="#402819" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
            <meshStandardMaterial color="#1a1410" />
          </mesh>
        </group>
      </group>

      {/* 5. The Loner's Writing Desk (Near back center-left) */}
      <group position={[-1.2, 0, 2.5]}>
        {/* Desk Surface */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 0.9]} />
          <meshStandardMaterial color="#3a2214" roughness={0.5} />
        </mesh>
        {/* Legs */}
        {[-0.65, 0.65].map((x, i) =>
          [-0.35, 0.35].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.36, z]} castShadow>
              <cylinderGeometry args={[0.03, 0.025, 0.72, 8]} />
              <meshStandardMaterial color="#22150d" />
            </mesh>
          ))
        )}
        {/* Banker's Desk Lamp with Green Glass Shade */}
        <group position={[0.45, 0.8, -0.2]}>
          {/* Base */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Green Glass Shade */}
          <mesh position={[0, 0.3, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#1f442f" roughness={0.2} transparent opacity={0.9} />
          </mesh>
          {/* Lamp Light Glow */}
          <pointLight color="#ffe4b5" intensity={1.5} distance={3.5} decay={2} position={[0, 0.25, 0]} />
        </group>
      </group>

      {/* 6. Pendant Ceiling Lamps (Warm glowing spheres hanging down) */}
      {[
        [-2.5, 3.2, -2.5],
        [1.5, 3.2, -2.5],
        [-1.2, 3.2, 2.5],
        [2.5, 3.2, 1.5]
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          {/* Wire */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.2, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Brass Cap */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.04, 0.08, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Glowing Bulb */}
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#ffe1a8" />
          </mesh>
          <pointLight color="#ffba66" intensity={1.8} distance={6} decay={2} position={[0, -0.1, 0]} />
        </group>
      ))}

      {/* 7. Rug under writing desk */}
      <mesh position={[-1.2, 0.005, 2.5]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
        <planeGeometry args={[2.2, 1.8]} />
        <meshStandardMaterial color="#593c2c" roughness={0.9} />
      </mesh>
    </group>
  )
}
