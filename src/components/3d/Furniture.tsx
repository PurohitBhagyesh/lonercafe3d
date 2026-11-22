import { useMemo } from 'react'
import { createMarbleTexture } from '../../utils/proceduralTextures'

interface FurnitureProps {
  viewZones?: {
    seeNorth: boolean
    seeSouth: boolean
    seeEast: boolean
    seeWest: boolean
  }
}

export function Furniture({ viewZones }: FurnitureProps) {
  const marbleTexture = useMemo(() => createMarbleTexture(), [])

  const seeNorth = viewZones ? viewZones.seeNorth : true
  const seeSouth = viewZones ? viewZones.seeSouth : true
  const seeEast = viewZones ? viewZones.seeEast : true
  const seeWest = viewZones ? viewZones.seeWest : true

  return (
    <group>
      {/* 1. Long Window Counter & Stools along the front glass window (NORTH ZONE) */}
      <group position={[0, 0, -4.8]} visible={seeNorth}>
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

      {/* 2. Barista Coffee Bar Counter with Granite Marble Countertop (EAST ZONE) */}
      <group position={[3.6, 0, -0.5]} visible={seeEast}>
        {/* Main Bar Base */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.1, 4.2]} />
          <meshStandardMaterial color="#2d1c13" roughness={0.7} />
        </mesh>
        {/* Real Granite Marble Countertop */}
        <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.06, 4.4]} />
          <meshStandardMaterial map={marbleTexture} roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Commercial Dual-Boiler Espresso Machine */}
        <group position={[0, 1.38, -0.9]}>
          {/* Polished Mirror Stainless Steel Body */}
          <mesh castShadow>
            <boxGeometry args={[0.95, 0.52, 0.65]} />
            <meshStandardMaterial color="#d8d8d8" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Top Cup Warmer Rail */}
          <mesh position={[0, 0.28, -0.05]}>
            <boxGeometry args={[0.88, 0.04, 0.5]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.9} />
          </mesh>

          {/* Dual Group Heads */}
          {[-0.22, 0.22].map((x, i) => (
            <group key={i} position={[x, -0.1, 0.34]}>
              {/* Chrome Group Collar */}
              <mesh>
                <cylinderGeometry args={[0.065, 0.065, 0.08, 16]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.1} />
              </mesh>
              {/* Portafilter Spout & Walnut Handle */}
              <mesh position={[0, -0.05, 0.02]}>
                <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} />
              </mesh>
              {/* Walnut Handle extending outward */}
              <mesh position={[0, -0.06, 0.16]} rotation={[Math.PI * 0.5, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.018, 0.18, 12]} />
                <meshStandardMaterial color="#502d16" roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Dual Pressure Gauges */}
          {[-0.32, 0.32].map((x, i) => (
            <group key={i} position={[x, 0.08, 0.33]}>
              <mesh rotation={[Math.PI * 0.5, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.01, 16]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.006]}>
                <circleGeometry args={[0.038, 16]} />
                <meshStandardMaterial color="#fefae0" />
              </mesh>
              <mesh position={[0.01, 0.01, 0.008]} rotation={[0, 0, -Math.PI * 0.25]}>
                <boxGeometry args={[0.003, 0.025, 0.002]} />
                <meshStandardMaterial color="#a71d2a" />
              </mesh>
            </group>
          ))}

          {/* Dual Steam Wands */}
          <mesh position={[-0.44, -0.05, 0.28]} rotation={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.95} />
          </mesh>
          <mesh position={[0.44, -0.05, 0.28]} rotation={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.95} />
          </mesh>
        </group>

        {/* Commercial Coffee Grinder with Bean Hopper */}
        <group position={[0.1, 1.35, 0.15]}>
          <mesh position={[0, -0.05, 0]} castShadow>
            <boxGeometry args={[0.26, 0.35, 0.26]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.12, 0.07, 0.26, 16]} />
            <meshPhysicalMaterial transparent opacity={0.65} color="#4a2e18" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.025, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>

        {/* Knockbox & Tamper */}
        <group position={[-0.45, 1.15, -0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.12, 0.22]} />
            <meshStandardMaterial color="#2b2b2b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.015, 0.015, 0.22, 12]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
          <group position={[0, 0.1, 0.18]}>
            <mesh>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
              <meshStandardMaterial color="#e0e0e0" metalness={0.95} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 0.06, 12]} />
              <meshStandardMaterial color="#502d16" roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* Pour-Over Station */}
        <group position={[-0.1, 1.15, 0.8]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.24, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
            <torusGeometry args={[0.06, 0.008, 8, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.065, 0.09, 16, 1, true]} />
            <meshStandardMaterial color="#f8f4eb" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.045, 0.065, 0.14, 16]} />
            <meshPhysicalMaterial transparent opacity={0.5} color="#3b2014" roughness={0.1} />
          </mesh>
        </group>

        {/* Stack of Ceramic Mugs */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <group key={i} position={[x, 1.18, 1.5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.045, 0.12, 16]} />
              <meshStandardMaterial color="#f5eee6" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.045, 0.12, 16]} />
              <meshStandardMaterial color="#f5eee6" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. The Library Bookshelves (WEST ZONE) */}
      <group position={[-5.2, 0, -0.8]} visible={seeWest}>
        {/* Bookshelf Frame */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 3.2, 4.5]} />
          <meshStandardMaterial color="#352115" roughness={0.7} />
        </mesh>

        {/* Books on shelves */}
        {[-1.0, -0.3, 0.4, 1.1].map((shelfY, sIdx) => (
          <group key={sIdx} position={[0.15, 1.6 + shelfY, 0]}>
            {[-1.8, -1.3, -0.8, -0.3, 0.2, 0.7, 1.2, 1.6].map((bookZ, bIdx) => {
              const height = 0.28 + ((bIdx * 7) % 5) * 0.03
              const depth = 0.32 + ((bIdx * 3) % 4) * 0.02
              const thickness = 0.05 + ((bIdx * 5) % 3) * 0.025
              const isTilted = bIdx === 3 || bIdx === 6
              return (
                <group
                  key={bIdx}
                  position={[0, height / 2, bookZ]}
                  rotation={isTilted ? [0, 0, 0.15] : [0, 0, 0]}
                >
                  <mesh castShadow>
                    <boxGeometry args={[depth, height, thickness]} />
                    <meshStandardMaterial
                      color={['#6e2d1d', '#1d3557', '#7f5539', '#38462b', '#582f0e', '#2b2d42'][bIdx % 6]}
                      roughness={0.65}
                    />
                  </mesh>
                  <mesh position={[depth / 2 + 0.002, 0, 0]}>
                    <planeGeometry args={[0.015, height * 0.75]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.8} />
                  </mesh>
                </group>
              )
            })}
          </group>
        ))}
      </group>

      {/* 4. Solitary Reading Armchair & Table (SOUTH ZONE) */}
      <group position={[-3.5, 0, 2.8]} visible={seeSouth}>
        <group position={[0, 0, 0]} rotation={[0, Math.PI * 0.25, 0]}>
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.75, 0.2, 0.75]} />
            <meshStandardMaterial color="#5c2918" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.75, -0.32]} castShadow>
            <boxGeometry args={[0.75, 0.7, 0.16]} />
            <meshStandardMaterial color="#5c2918" roughness={0.9} />
          </mesh>
          <mesh position={[-0.38, 0.52, 0]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.7]} />
            <meshStandardMaterial color="#5c2918" roughness={0.9} />
          </mesh>
          <mesh position={[0.38, 0.52, 0]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.7]} />
            <meshStandardMaterial color="#5c2918" roughness={0.9} />
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

      {/* 5. The Loner's Writing Desk (SOUTH ZONE) */}
      <group position={[-1.2, 0, 2.5]} visible={seeSouth}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 0.9]} />
          <meshStandardMaterial color="#3a2214" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.795, 0]} receiveShadow>
          <planeGeometry args={[0.9, 0.55]} />
          <meshStandardMaterial color="#21150f" roughness={0.8} />
        </mesh>
        <group position={[0.55, 0.84, 0.25]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#ede0d4" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.003, 0.003, 0.16, 6]} />
            <meshStandardMaterial color="#2b1a10" />
          </mesh>
        </group>
        {[-0.65, 0.65].map((x, i) =>
          [-0.35, 0.35].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.36, z]} castShadow>
              <cylinderGeometry args={[0.03, 0.025, 0.72, 8]} />
              <meshStandardMaterial color="#22150d" />
            </mesh>
          ))
        )}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
          <planeGeometry args={[2.2, 1.8]} />
          <meshStandardMaterial color="#502b1f" roughness={0.9} />
        </mesh>
      </group>

      {/* 6. Pendant Ceiling Lamps with Warm Light */}
      {[
        [-2.5, 3.2, -2.5],
        [1.5, 3.2, -2.5],
        [-1.2, 3.2, 2.5],
        [2.5, 3.2, 1.5]
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.2, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.04, 0.08, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshPhysicalMaterial transparent opacity={0.5} color="#ffe8d6" roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshBasicMaterial color="#ff9500" />
          </mesh>
          <pointLight color="#ffba66" intensity={1.8} distance={6} decay={2} position={[0, -0.1, 0]} />
        </group>
      ))}
    </group>
  )
}
