import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WeatherType } from '../../store/gameStore'

interface WeatherProps {
  weather: WeatherType
}

export function WeatherEffect({ weather }: WeatherProps) {
  // Rain particles
  const rainCount = 1800
  const [rainGeo, rainPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 25 // X
      pos[i * 3 + 1] = Math.random() * 15 + 1     // Y
      pos[i * 3 + 2] = -Math.random() * 15 - 5    // Z outside the window
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  // Snow particles
  const snowCount = 900
  const [snowGeo, snowPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(snowCount * 3)
    for (let i = 0; i < snowCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = Math.random() * 15 + 1
      pos[i * 3 + 2] = -Math.random() * 15 - 5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  // Sakura petals
  const sakuraCount = 400
  const [sakuraGeo, sakuraPos] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(sakuraCount * 3)
    for (let i = 0; i < sakuraCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = Math.random() * 15 + 1
      pos[i * 3 + 2] = -Math.random() * 15 - 5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return [geo, pos]
  }, [])

  const rainRef = useRef<THREE.Points>(null)
  const snowRef = useRef<THREE.Points>(null)
  const sakuraRef = useRef<THREE.Points>(null)

  useFrame((state, delta) => {
    if (weather === 'rain' && rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= delta * 18 // fast rain
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 16
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (weather === 'snow' && snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < snowCount; i++) {
        positions[i * 3 + 1] -= delta * 2.2 // gentle floating snow
        positions[i * 3 + 0] += Math.sin(state.clock.elapsedTime + i) * 0.01
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 15
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (weather === 'sakura' && sakuraRef.current) {
      const positions = sakuraRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < sakuraCount; i++) {
        positions[i * 3 + 1] -= delta * 1.5
        positions[i * 3 + 0] += Math.cos(state.clock.elapsedTime * 0.8 + i) * 0.02 + 0.01 // breeze to right
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 15
          positions[i * 3 + 0] = (Math.random() - 0.5) * 25
        }
      }
      sakuraRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Outside Horizon & Pine Tree Silhouettes */}
      <mesh position={[0, 4, -18]}>
        <planeGeometry args={[50, 20]} />
        <meshBasicMaterial 
          color={
            weather === 'sunset' ? '#ff7e47' :
            weather === 'snow' ? '#b0c4de' :
            weather === 'night' ? '#070b19' :
            weather === 'sakura' ? '#fcd5ce' : '#2c3540'
          } 
        />
      </mesh>

      {/* Pine Trees outside window */}
      {[-8, -5, -2, 2, 5, 8, 11].map((x, i) => (
        <group key={i} position={[x + (i % 2) * 0.5, 0, -12 - (i % 3)]}>
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
            <meshStandardMaterial color="#2d1c12" roughness={0.9} />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 3.2, 0]}>
            <coneGeometry args={[1.5, 2.5, 7]} />
            <meshStandardMaterial 
              color={weather === 'snow' ? '#e2ebf0' : weather === 'sakura' ? '#e5989b' : '#1e3827'} 
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <coneGeometry args={[1.1, 2.2, 7]} />
            <meshStandardMaterial 
              color={weather === 'snow' ? '#ffffff' : weather === 'sakura' ? '#ffb4a2' : '#274732'} 
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Moon or Sun in sky */}
      {weather === 'night' && (
        <mesh position={[6, 9, -17]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial color="#fffae0" />
        </mesh>
      )}

      {weather === 'sunset' && (
        <mesh position={[0, 5, -17]}>
          <circleGeometry args={[2.5, 32]} />
          <meshBasicMaterial color="#ffa34d" />
        </mesh>
      )}

      {/* Particles */}
      {weather === 'rain' && (
        <points ref={rainRef} geometry={rainGeo}>
          <pointsMaterial 
            color="#8fbcdb" 
            size={0.12} 
            transparent 
            opacity={0.65} 
          />
        </points>
      )}

      {weather === 'snow' && (
        <points ref={snowRef} geometry={snowGeo}>
          <pointsMaterial 
            color="#ffffff" 
            size={0.25} 
            transparent 
            opacity={0.85} 
          />
        </points>
      )}

      {weather === 'sakura' && (
        <points ref={sakuraRef} geometry={sakuraGeo}>
          <pointsMaterial 
            color="#ffb7b2" 
            size={0.28} 
            transparent 
            opacity={0.8} 
          />
        </points>
      )}
    </group>
  )
}
