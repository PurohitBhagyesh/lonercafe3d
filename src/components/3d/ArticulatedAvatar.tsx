// High-Detail Articulated 3D Stylized Character Model for Co-Op & AI Companions
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { ConnectedFriend } from '../../store/gameStore'
import { SteamingMug } from './InteractableItem'
import { WateringCanMesh } from './PlantsAndWatering'

interface ArticulatedAvatarProps {
  friend: ConnectedFriend
}

export function ArticulatedAvatar({ friend }: ArticulatedAvatarProps) {
  const rootRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  // Current interpolated position & rotation for silky smooth movement
  const currentPos = useRef(new THREE.Vector3(...friend.position))
  const currentRotY = useRef(friend.rotationY || 0)
  const walkPhase = useRef(0)
  const lastPos = useRef(new THREE.Vector3(...friend.position))

  useFrame((state, delta) => {
    if (!rootRef.current) return

    // Smooth position lerp
    const target = new THREE.Vector3(...friend.position)
    currentPos.current.lerp(target, Math.min(delta * 9, 1))
    rootRef.current.position.copy(currentPos.current)

    // Smooth rotation lerp
    const targetRot = friend.rotationY || 0
    let diff = targetRot - currentRotY.current
    while (diff < -Math.PI) diff += Math.PI * 2
    while (diff > Math.PI) diff -= Math.PI * 2
    currentRotY.current += diff * Math.min(delta * 10, 1)
    rootRef.current.rotation.y = currentRotY.current

    // Check speed to drive walk cycle
    const distMoved = currentPos.current.distanceTo(lastPos.current)
    lastPos.current.copy(currentPos.current)
    const isMoving = distMoved > 0.002 && friend.state !== 'sitting' && friend.state !== 'piano'

    const t = state.clock.elapsedTime

    if (isMoving) {
      walkPhase.current += delta * 9
      const legAngle = Math.sin(walkPhase.current) * 0.45
      const armAngle = -legAngle * 0.7

      // Leg stride animation
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle

      // Arm swing animation (if not holding something)
      if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle
      if (rightArmRef.current && !friend.heldItem) {
        rightArmRef.current.rotation.x = -armAngle
      }

      // Vertical bounce
      rootRef.current.position.y = friend.position[1] + Math.abs(Math.sin(walkPhase.current)) * 0.04
    } else {
      // Idle / Sitting animation
      const isSeated = friend.state === 'sitting' || friend.state === 'piano'
      
      if (isSeated) {
        // Seated leg pose: 90 deg forward bend
        if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI * 0.45
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI * 0.45
        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.PI * 0.2
        if (rightArmRef.current) rightArmRef.current.rotation.x = Math.PI * 0.2
      } else {
        // Standing idle breathing
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0
        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.05
        if (rightArmRef.current && !friend.heldItem) {
          rightArmRef.current.rotation.x = -Math.sin(t * 1.5) * 0.05
        }
      }

      // Breathing idle motion
      if (headRef.current) {
        headRef.current.position.y = 1.35 + Math.sin(t * 2) * 0.012
        headRef.current.rotation.y = Math.sin(t * 0.6) * 0.08
      }
    }

    // Voice presence pulsating halo
    if (haloRef.current && friend.isTalking) {
      haloRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.15)
    }
  })

  // Theme colors
  const sweaterColor = friend.isAi ? '#8b4513' : '#3d405b' // Warm cognac for Maya, navy for guest
  const beanieColor = friend.isAi ? '#c86d3b' : '#d4a373'
  const scarfColor = friend.isAi ? '#2b4141' : '#b76935'

  const hasRecentMessage = friend.lastMessage && friend.lastMessageTime && (Date.now() - friend.lastMessageTime < 6500)

  return (
    <group ref={rootRef} position={friend.position}>
      {/* 1. Nameplate & Status Badge Floating Above */}
      <group position={[0, 1.95, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.2, 0.22]} />
          <meshBasicMaterial color="#190e08" transparent opacity={0.75} />
        </mesh>
        <Text
          position={[0, 0, 0]}
          fontSize={0.095}
          color="#fefae0"
          anchorX="center"
          anchorY="middle"
        >
          {friend.isAi ? `🤖 ${friend.name}` : `☕ ${friend.name}`}
        </Text>
      </group>

      {/* 2. 3D Floating Speech Bubble (when companion speaks) */}
      {hasRecentMessage && (
        <group position={[0, 2.35, 0]}>
          {/* Bubble Background */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.0, 0.44]} />
            <meshBasicMaterial color="#fefae0" />
          </mesh>
          <mesh position={[0, -0.26, -0.02]} rotation={[0, 0, Math.PI * 0.25]}>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial color="#fefae0" />
          </mesh>
          {/* Speech Text */}
          <Text
            position={[0, 0, 0]}
            fontSize={0.082}
            maxWidth={1.85}
            color="#28150c"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            {friend.lastMessage}
          </Text>
        </group>
      )}

      {/* 3. Voice Presence Sound Wave Halo */}
      {friend.isTalking && (
        <mesh ref={haloRef} position={[0, 0.9, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color="#52b788" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 4. Torso: Oversized Cable-Knit Sweater */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.42, 8, 16]} />
        <meshStandardMaterial color={sweaterColor} roughness={0.85} />
      </mesh>

      {/* Chunky Scarf */}
      <group position={[0, 1.15, 0]}>
        <mesh>
          <torusGeometry args={[0.17, 0.065, 8, 16]} />
          <meshStandardMaterial color={scarfColor} roughness={0.9} />
        </mesh>
        {/* Scarf Draped Tail */}
        <mesh position={[0.08, -0.16, 0.14]} rotation={[0.2, 0, -0.1]}>
          <boxGeometry args={[0.08, 0.28, 0.04]} />
          <meshStandardMaterial color={scarfColor} roughness={0.9} />
        </mesh>
      </group>

      {/* 5. Stylized Head */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color="#fae1dd" roughness={0.6} />
        </mesh>
        {/* Eyes (Peaceful resting curve) */}
        {[-0.06, 0.06].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0.16]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.02, 0.005, 4, 8, Math.PI]} />
            <meshBasicMaterial color="#2d1c14" />
          </mesh>
        ))}
        {/* Warm Cheek Blush */}
        {[-0.09, 0.09].map((x, i) => (
          <mesh key={i} position={[x, -0.02, 0.15]}>
            <circleGeometry args={[0.025, 12]} />
            <meshBasicMaterial color="#f28482" transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Cable-Knit Beanie */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={beanieColor} roughness={0.9} />
        </mesh>
        {/* Beanie Fluffy Pompom */}
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#faedcd" roughness={0.95} />
        </mesh>
      </group>

      {/* 6. Articulated Left Arm */}
      <group ref={leftArmRef} position={[-0.26, 1.05, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
          <meshStandardMaterial color={sweaterColor} roughness={0.85} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#fae1dd" />
        </mesh>
      </group>

      {/* 7. Articulated Right Arm (Holds items or plays piano) */}
      <group ref={rightArmRef} position={[0.26, 1.05, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
          <meshStandardMaterial color={sweaterColor} roughness={0.85} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#fae1dd" />
        </mesh>

        {/* Held Item Mesh */}
        {friend.heldItem === 'steaming-mug' && (
          <group position={[0, -0.36, 0.12]}>
            <SteamingMug position={[0, 0, 0]} isHeld={true} />
          </group>
        )}
        {friend.heldItem === 'copper-watering-can' && (
          <group position={[0, -0.36, 0.12]} scale={0.7}>
            <WateringCanMesh position={[0, 0, 0]} isHeld={true} />
          </group>
        )}
      </group>

      {/* 8. Articulated Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.55, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color="#2b2d42" roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.44, 0.04]}>
          <boxGeometry args={[0.1, 0.1, 0.16]} />
          <meshStandardMaterial color="#1f140e" roughness={0.7} />
        </mesh>
      </group>

      {/* 9. Articulated Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.55, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color="#2b2d42" roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.44, 0.04]}>
          <boxGeometry args={[0.1, 0.1, 0.16]} />
          <meshStandardMaterial color="#1f140e" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}
