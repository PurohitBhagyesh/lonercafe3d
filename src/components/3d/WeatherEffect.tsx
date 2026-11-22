import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WeatherType } from '../../store/gameStore'

interface WeatherProps {
  weather: WeatherType
}

export function WeatherEffect({ weather }: WeatherProps) {
  const rainCount = 1500
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

  const snowCount = 800
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

  const sakuraCount = 350
  const [sakuraGeo] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(sakuraCount * 3)
    for (let i = 0; i < sakuraCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = Math.random() * 16 + 1
      pos[i * 3 + 2] = -Math.random() * 14 - 5.5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo]
  }, [])

  const rainRef = useRef<THREE.Points>(null)
  const snowRef = useRef<THREE.Points>(null)
  const sakuraRef = useRef<THREE.Points>(null)

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

    if (weather === 'sakura' && sakuraRef.current) {
      const positions = sakuraRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < sakuraCount; i++) {
        positions[i * 3 + 1] -= delta * 1.4
        positions[i * 3 + 0] += Math.cos(state.clock.elapsedTime * 0.8 + i) * 0.015 + 0.01
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 15
          positions[i * 3 + 0] = (Math.random() - 0.5) * 26
        }
      }
      sakuraRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Atmospheric sky colors
  const skyColor = {
    rain: '#6c7f93',
    snow: '#a8bac9',
    sunset: '#f49c66',
    night: '#131e33',
    sakura: '#f7cad0'
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
        <planeGeometry args={[60, 26]} />
        <meshBasicMaterial color={skyColor} />
      </mesh>

      {/* 2. Soft Mountain Ridge in Distance */}
      <group position={[0, 2, -18]}>
        {[-18, -6, 6, 18].map((x, i) => (
          <mesh key={i} position={[x, 2 + (i % 2) * 1.5, 0]}>
            <coneGeometry args={[9, 8, 4]} />
            <meshBasicMaterial color={weather === 'sunset' ? '#8a4b38' : weather === 'night' ? '#0d1522' : '#4d6270'} />
          </mesh>
        ))}
      </group>

      {/* 3. Outdoor Pine Trees (Layered Depth) */}
      {[-12, -9, -6, -3, 0, 3, 6, 9, 12, 15].map((x, i) => {
        const z = -10 - (i % 3) * 2.5
        const scale = 0.9 + (i % 4) * 0.2
        return (
          <group key={i} position={[x + (i % 2) * 0.4, 0, z]} scale={[scale, scale, scale]}>
            {/* Trunk */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.18, 0.28, 2.8, 8]} />
              <meshStandardMaterial color="#362217" roughness={0.9} />
            </mesh>
            {/* 3-Tier Pine Foliage */}
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

      {/* 4. Outdoor Ground Terrain with Soft Grass/Snow */}
      <mesh position={[0, -0.05, -12]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[50, 25]} />
        <meshStandardMaterial color={weather === 'snow' ? '#edf2f4' : '#2b3a2f'} roughness={0.9} />
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

      {weather === 'sakura' && (
        <points ref={sakuraRef} geometry={sakuraGeo}>
          <pointsMaterial color="#ffcbf2" size={0.3} transparent opacity={0.85} />
        </points>
      )}
    </group>
  )
}
