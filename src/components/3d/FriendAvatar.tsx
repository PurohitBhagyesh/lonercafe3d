import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

export function FriendAvatar() {
  const { connectedFriend } = useGameStore()
  const avatarGroup = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (avatarGroup.current) {
      // Gentle breathing idle animation
      const t = state.clock.elapsedTime
      avatarGroup.current.position.y = (connectedFriend?.position[1] || 0) + Math.sin(t * 1.8) * 0.02
      avatarGroup.current.rotation.y = Math.sin(t * 0.5) * 0.05
    }
  })

  if (!connectedFriend) return null

  const pos = connectedFriend.position || [0.5, 0, -4.2]

  return (
    <group ref={avatarGroup} position={pos}>
      {/* Name tag floating above head */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.12}
        color="#ffe8d6"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {connectedFriend.name || 'Quiet Companion'}
      </Text>

      {/* Cozy Sweater Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
        <meshStandardMaterial color="#4a5759" roughness={0.8} />
      </mesh>

      {/* Scarf */}
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.16, 0.06, 8, 16]} />
        <meshStandardMaterial color="#b76935" roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#eed7c5" roughness={0.5} />
      </mesh>

      {/* Cozy Knit Beanie */}
      <mesh position={[0, 1.44, 0]}>
        <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>
      {/* Beanie Pompom */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#faedcd" roughness={0.9} />
      </mesh>

      {/* Small steaming coffee in their hand */}
      <group position={[0.2, 0.75, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.03, 0.08, 12]} />
          <meshStandardMaterial color="#f7ede2" />
        </mesh>
      </group>
    </group>
  )
}
