import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WeatherType } from '../../store/gameStore'

interface WeatherProps {
  weather: WeatherType
}

// 1. Realistic Japanese Cherry Blossom (Sakura) Tree
function SakuraTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Fallen Petal Carpet Ring under tree */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <circleGeometry args={[2.2, 20]} />
        <meshStandardMaterial color="#f7cad0" roughness={0.9} transparent opacity={0.65} />
      </mesh>

      {/* Main Gnarled Aged Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 2.8, 10]} />
        <meshStandardMaterial color="#382319" roughness={0.85} />
      </mesh>

      {/* Primary Left Branch */}
      <mesh position={[-0.45, 2.3, 0]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.13, 0.2, 1.4, 8]} />
        <meshStandardMaterial color="#382319" roughness={0.85} />
      </mesh>

      {/* Primary Right Branch */}
      <mesh position={[0.5, 2.5, 0.1]} rotation={[0, 0.3, -0.5]}>
        <cylinderGeometry args={[0.12, 0.18, 1.5, 8]} />
        <meshStandardMaterial color="#382319" roughness={0.85} />
      </mesh>

      {/* Volumetric Soft Pink Blossom Clouds (Canopy) */}
      {/* Center Main Canopy */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#ffb4a2" roughness={0.8} />
      </mesh>
      {/* Upper Blossom Dome */}
      <mesh position={[0.2, 4.4, -0.1]}>
        <sphereGeometry args={[1.2, 14, 14]} />
        <meshStandardMaterial color="#ffcbf2" roughness={0.8} />
      </mesh>
      {/* Left Blossom Cluster */}
      <mesh position={[-1.2, 3.2, 0.2]}>
        <sphereGeometry args={[1.3, 14, 14]} />
        <meshStandardMaterial color="#f7cad0" roughness={0.8} />
      </mesh>
      {/* Right Blossom Cluster */}
      <mesh position={[1.3, 3.3, -0.2]}>
        <sphereGeometry args={[1.35, 14, 14]} />
        <meshStandardMaterial color="#e5989b" roughness={0.8} />
      </mesh>
      {/* Forward Blossom Highlights */}
      <mesh position={[0, 3.1, 0.9]}>
        <sphereGeometry args={[1.1, 14, 14]} />
        <meshStandardMaterial color="#ffe5ec" roughness={0.8} />
      </mesh>
      {/* Rear Blossom Highlights */}
      <mesh position={[-0.3, 3.3, -1.0]}>
        <sphereGeometry args={[1.15, 14, 14]} />
        <meshStandardMaterial color="#ffcad4" roughness={0.8} />
      </mesh>
    </group>
  )
}

// 2. High-Performance 3D Fluttering Sakura Blossom Petals (InstancedMesh)
function InstancedSakuraPetals() {
  const count = 420
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Petals state: pos (x,y,z), rot (rx,ry,rz), speed, swaySeed
  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 28,
      y: Math.random() * 14 + 1,
      z: -Math.random() * 12 - 5.5,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      speedY: 0.6 + Math.random() * 0.7,
      swayFreq: 1.2 + Math.random() * 1.5,
      swayAmp: 0.015 + Math.random() * 0.02,
      rotSpeedX: (Math.random() - 0.5) * 2.2,
      rotSpeedY: (Math.random() - 0.5) * 1.8,
      scale: 0.09 + Math.random() * 0.05
    }))
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const p = petals[i]

      // Aerodynamic descent with gentle wind gust from left to right
      p.y -= p.speedY * delta
      p.x += Math.sin(t * p.swayFreq + i) * p.swayAmp + 0.022 // gentle breeze
      p.z += Math.cos(t * p.swayFreq * 0.7 + i) * 0.008

      // 3D tumbling rotation
      p.rx += p.rotSpeedX * delta
      p.ry += p.rotSpeedY * delta
      p.rz += p.rotSpeedX * 0.5 * delta

      // Recycle at top when reaching floor
      if (p.y < 0.15) {
        p.y = 14 + Math.random() * 2
        p.x = (Math.random() - 0.5) * 28 - 2
      }

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rx, p.ry, p.rz)
      dummy.scale.set(p.scale, p.scale * 1.35, p.scale)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Double-sided curved oval blossom petal */}
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#ffccd5"
        roughness={0.5}
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  )
}

export function WeatherEffect({ weather }: WeatherProps) {
  // Rain particles
  const rainCount = 1400
  const [rainGeo] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = Math.random() * 16 + 1
      pos[i * 3 + 2] = -Math.random() * 14 - 5.5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo]
  }, [])

  // Snow particles
  const snowCount = 750
  const [snowGeo] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(snowCount * 3)
    for (let i = 0; i < snowCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = Math.random() * 16 + 1
      pos[i * 3 + 2] = -Math.random() * 14 - 5.5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo]
  }, [])

  const rainRef = useRef<THREE.Points>(null)
  const snowRef = useRef<THREE.Points>(null)

  useFrame((state, delta) => {
    if (weather === 'rain' && rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= delta * 16
        if (positions[i * 3 + 1] < 0.2) positions[i * 3 + 1] = 16
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (weather === 'snow' && snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < snowCount; i++) {
        positions[i * 3 + 1] -= delta * 2.2
        positions[i * 3 + 0] += Math.sin(state.clock.elapsedTime + i) * 0.008
        if (positions[i * 3 + 1] < 0.2) positions[i * 3 + 1] = 15
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Atmospheric sky colors
  const skyColor = {
    rain: '#6c7f93',
    snow: '#a8bac9',
    sunset: '#f49c66',
    night: '#131e33',
    sakura: '#fde2e4'
  }[weather]

  const foliageColor = {
    rain: '#2d4734',
    snow: '#e2ebf0',
    sunset: '#3f5e42',
    night: '#122417',
    sakura: '#e5989b'
  }[weather]

  return (
    <group>
      {/* 1. Luminous Sky Backdrop */}
      <mesh position={[0, 7, -19]}>
        <planeGeometry args={[65, 28]} />
        <meshBasicMaterial color={skyColor} />
      </mesh>

      {/* 2. Soft Mountain Ridge in Distance */}
      <group position={[0, 2, -18]}>
        {[-18, -6, 6, 18].map((x, i) => (
          <mesh key={i} position={[x, 2 + (i % 2) * 1.5, 0]}>
            <coneGeometry args={[9, 8, 4]} />
            <meshBasicMaterial
              color={
                weather === 'sakura'
                  ? '#b5838d'
                  : weather === 'sunset'
                  ? '#8a4b38'
                  : weather === 'night'
                  ? '#0d1522'
                  : '#4d6270'
              }
            />
          </mesh>
        ))}
      </group>

      {/* 3. Outdoor Trees: Sakura Grove or Pine Forest */}
      {weather === 'sakura' ? (
        <group>
          {/* Japanese Sakura Trees */}
          {[
            { pos: [-10.5, 0, -11.5], scale: 1.15 },
            { pos: [-5.8, 0, -9.8], scale: 1.05 },
            { pos: [-1.2, 0, -12.5], scale: 1.2 },
            { pos: [3.8, 0, -10.2], scale: 1.1 },
            { pos: [8.5, 0, -11.8], scale: 1.25 },
            { pos: [13.2, 0, -13.0], scale: 1.3 }
          ].map((tree, idx) => (
            <SakuraTree
              key={idx}
              position={tree.pos as [number, number, number]}
              scale={tree.scale}
            />
          ))}

          {/* 3D Fluttering Sakura Blossom Petals in Breeze */}
          <InstancedSakuraPetals />
        </group>
      ) : (
        <group>
          {/* Layered Pine Trees */}
          {[-12, -9, -6, -3, 0, 3, 6, 9, 12, 15].map((x, i) => {
            const z = -10 - (i % 3) * 2.5
            const scale = 0.9 + (i % 4) * 0.2
            return (
              <group key={i} position={[x + (i % 2) * 0.4, 0, z]} scale={[scale, scale, scale]}>
                <mesh position={[0, 1.4, 0]}>
                  <cylinderGeometry args={[0.18, 0.28, 2.8, 8]} />
                  <meshStandardMaterial color="#362217" roughness={0.9} />
                </mesh>
                <mesh position={[0, 3.2, 0]}>
                  <coneGeometry args={[1.6, 2.4, 8]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.7} />
                </mesh>
                <mesh position={[0, 4.4, 0]}>
                  <coneGeometry args={[1.2, 2.1, 8]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.7} />
                </mesh>
                <mesh position={[0, 5.4, 0]}>
                  <coneGeometry args={[0.8, 1.8, 8]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.7} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}

      {/* 4. Outdoor Ground Terrain with Soft Grass/Snow */}
      <mesh position={[0, -0.05, -12]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[55, 26]} />
        <meshStandardMaterial
          color={
            weather === 'snow'
              ? '#edf2f4'
              : weather === 'sakura'
              ? '#3a5a40'
              : '#2b3a2f'
          }
          roughness={0.9}
        />
      </mesh>

      {/* Celestial Bodies */}
      {weather === 'sunset' && (
        <mesh position={[4, 6, -18]}>
          <circleGeometry args={[2.8, 32]} />
          <meshBasicMaterial color="#ffe4b5" />
        </mesh>
      )}

      {weather === 'night' && (
        <mesh position={[8, 10, -18]}>
          <circleGeometry args={[1.4, 32]} />
          <meshBasicMaterial color="#fffbe6" />
        </mesh>
      )}

      {weather === 'sakura' && (
        <mesh position={[2, 7.5, -18]}>
          <circleGeometry args={[2.2, 32]} />
          <meshBasicMaterial color="#fff4e6" />
        </mesh>
      )}

      {/* Particles */}
      {weather === 'rain' && (
        <points ref={rainRef} geometry={rainGeo}>
          <pointsMaterial color="#a9cce3" size={0.14} transparent opacity={0.75} />
        </points>
      )}

      {weather === 'snow' && (
        <points ref={snowRef} geometry={snowGeo}>
          <pointsMaterial color="#ffffff" size={0.28} transparent opacity={0.9} />
        </points>
      )}
    </group>
  )
}
