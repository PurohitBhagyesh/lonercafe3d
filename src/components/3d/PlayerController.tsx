import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, SittingSpot } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

// Virtual touch movement store for mobile
export const touchState = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
}

export function PlayerController() {
  const { camera } = useThree()
  const { 
    mode, 
    currentSittingSpot, 
    standUp, 
    sitDown, 
    setActivePrompt, 
    mouseSensitivity,
    heldItem,
    setHeldItem,
    placeItemOnTable,
    tableItems,
    setMode
  } = useGameStore()

  // Player position and velocity
  const pos = useRef(new THREE.Vector3(0, 1.5, 0))
  const vel = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const keys = useRef<{ [key: string]: boolean }>({})
  const isPointerLocked = useRef(false)
  const footstepTimer = useRef(0)
  const headBobTimer = useRef(0)

  // Pre-defined hotspots
  const hotspots: Array<{
    name: string
    prompt: string
    pos: [number, number, number]
    radius: number
    onAction: () => void
  }> = [
    {
      name: 'window-seat',
      prompt: 'Press [E] or Tap to Sit by the Window',
      pos: [-1.8, 0.65, -4.2],
      radius: 1.5,
      onAction: () => {
        soundEngine.playSitSound()
        sitDown({
          id: 'window-seat',
          name: 'Window Counter Stool',
          seatPosition: [-1.8, 0.65, -4.2],
          cameraPosition: [-1.8, 1.25, -4.2],
          lookAt: [-1.8, 1.35, -12]
        })
      }
    },
    {
      name: 'armchair',
      prompt: 'Press [E] or Tap to Sit in Reading Armchair',
      pos: [-3.5, 0.5, 2.8],
      radius: 1.6,
      onAction: () => {
        soundEngine.playSitSound()
        sitDown({
          id: 'armchair-seat',
          name: 'Cozy Armchair',
          seatPosition: [-3.5, 0.45, 2.8],
          cameraPosition: [-3.5, 1.15, 2.8],
          lookAt: [0, 1.2, 0]
        })
      }
    },
    {
      name: 'diary',
      prompt: 'Press [E] or Tap to Open Loner\'s Diary',
      pos: [-1.2, 0.8, 2.5],
      radius: 1.4,
      onAction: () => {
        soundEngine.playPageFlip()
        sitDown({
          id: 'desk-seat',
          name: 'Writing Desk',
          seatPosition: [-1.2, 0.55, 3.1],
          cameraPosition: [-1.2, 1.1, 3.0],
          lookAt: [-1.2, 0.78, 2.5]
        })
        setMode('writing')
      }
    },
    {
      name: 'bookshelf',
      prompt: 'Press [E] or Tap to Browse Library',
      pos: [-4.6, 1.5, -0.8],
      radius: 1.8,
      onAction: () => {
        soundEngine.playPageFlip()
        setMode('reading')
      }
    },
    {
      name: 'coffeebar',
      prompt: 'Press [E] or Tap to Brew Coffee',
      pos: [3.3, 1.2, -0.8],
      radius: 1.7,
      onAction: () => {
        setMode('brewing')
      }
    },
    {
      name: 'ipod',
      prompt: 'Press [E] or Tap to Open iPod Music',
      pos: [-1.4, 0.95, -4.6],
      radius: 1.5,
      onAction: () => {
        soundEngine.playIpodClick()
        setMode('ipod')
      }
    },
    {
      name: 'watering-can',
      prompt: 'Press [E] or Tap to Pick up Watering Can',
      pos: [-4.9, 0.5, 0.5],
      radius: 1.4,
      onAction: () => {
        soundEngine.playIpodClick()
        setHeldItem({
          id: 'copper-watering-can',
          name: 'Vintage Copper Watering Can',
          type: 'watering-can'
        })
      }
    }
  ]

  // Setup keyboard & mouse listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true

      // E key interactions
      if (e.code === 'KeyE') {
        const currentPrompt = useGameStore.getState().activePrompt
        const action = useGameStore.getState().promptAction
        if (action) {
          action()
          return
        }

        // If sitting, stand up
        if (mode === 'sitting') {
          soundEngine.playSitSound()
          standUp()
          return
        }
      }

      // Space or Escape to stand up or close modal
      if ((e.code === 'Space' || e.code === 'Escape') && mode === 'sitting') {
        soundEngine.playSitSound()
        standUp()
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current || mode !== 'walking') return
      const sens = 0.002 * mouseSensitivity
      euler.current.y -= e.movementX * sens
      euler.current.x -= e.movementY * sens
      // Clamp vertical look between -80 and +80 degrees
      euler.current.x = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, euler.current.x))
    }

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
    }
  }, [mode, mouseSensitivity, sitDown, standUp, setMode])

  // Camera frame loop
  useFrame((state, delta) => {
    // 1. If Sitting: Smoothly interpolate camera to sitting viewpoint
    if (mode === 'sitting' && currentSittingSpot) {
      const targetPos = new THREE.Vector3(...currentSittingSpot.cameraPosition)
      const targetLook = new THREE.Vector3(...currentSittingSpot.lookAt)

      camera.position.lerp(targetPos, delta * 3.5)
      
      const currentLook = new THREE.Vector3()
      camera.getWorldDirection(currentLook)
      const lookDelta = targetLook.clone().sub(camera.position).normalize()
      currentLook.lerp(lookDelta, delta * 4)
      camera.lookAt(camera.position.clone().add(currentLook))

      setActivePrompt('Press [E] or Space to Stand Up', () => {
        soundEngine.playSitSound()
        standUp()
      })
      return
    }

    // 2. If inspecting a modal (Diary, iPod, Books), freeze movement
    if (mode !== 'walking') return

    // 3. Touch look controls on mobile
    if (touchState.lookDeltaX !== 0 || touchState.lookDeltaY !== 0) {
      const sens = 0.003 * mouseSensitivity
      euler.current.y -= touchState.lookDeltaX * sens
      euler.current.x -= touchState.lookDeltaY * sens
      euler.current.x = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, euler.current.x))
      touchState.lookDeltaX = 0
      touchState.lookDeltaY = 0
    }

    camera.quaternion.setFromEuler(euler.current)

    // 4. Calculate movement direction from keyboard + mobile virtual joystick
    const moveDir = new THREE.Vector3()
    if (keys.current['KeyW'] || keys.current['ArrowUp'] || touchState.moveY < -0.1) moveDir.z -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown'] || touchState.moveY > 0.1) moveDir.z += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft'] || touchState.moveX < -0.1) moveDir.x -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight'] || touchState.moveX > 0.1) moveDir.x += 1

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
      // Transform direction relative to camera yaw
      moveDir.applyEuler(new THREE.Euler(0, euler.current.y, 0))

      const speed = 2.8
      vel.current.x = moveDir.x * speed
      vel.current.z = moveDir.z * speed

      // Head-bobbing
      headBobTimer.current += delta * 10
      camera.position.y = 1.45 + Math.sin(headBobTimer.current) * 0.04

      // Footstep audio
      footstepTimer.current += delta
      if (footstepTimer.current > 0.48) {
        soundEngine.playFootstep()
        footstepTimer.current = 0
      }
    } else {
      vel.current.x *= 0.8
      vel.current.z *= 0.8
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.45, delta * 5)
    }

    // Apply movement
    pos.current.x += vel.current.x * delta
    pos.current.z += vel.current.z * delta

    // Room collision boundaries (prevent walking through walls)
    pos.current.x = Math.max(-4.4, Math.min(4.4, pos.current.x))
    pos.current.z = Math.max(-4.2, Math.min(3.8, pos.current.z))

    camera.position.x = pos.current.x
    camera.position.z = pos.current.z

    // 5. Proximity hotspot check for interaction prompts
    let foundPrompt: { text: string; action: () => void } | null = null

    for (const spot of hotspots) {
      const dist = Math.hypot(pos.current.x - spot.pos[0], pos.current.z - spot.pos[2])
      if (dist < spot.radius) {
        foundPrompt = { text: spot.prompt, action: spot.onAction }
        break
      }
    }

    // Check plants & watering
    if (!foundPrompt && heldItem?.type === 'watering-can') {
      const { plants, waterPlant } = useGameStore.getState()
      for (const p of plants) {
        const dist = Math.hypot(pos.current.x - p.position[0], pos.current.z - p.position[2])
        if (dist < 1.6) {
          foundPrompt = {
            text: p.hydrated ? `Press [E] to Tend to ${p.name}` : `Press [E] to Water ${p.name}`,
            action: () => {
              soundEngine.playWaterSound()
              soundEngine.playPlantSparkle()
              waterPlant(p.id)
            }
          }
          break
        }
      }

      // Check if near shelf to return watering can
      if (!foundPrompt) {
        const distShelf = Math.hypot(pos.current.x - (-4.9), pos.current.z - 0.5)
        if (distShelf < 1.6) {
          foundPrompt = {
            text: 'Press [E] to Put Back Watering Can',
            action: () => {
              soundEngine.playIpodClick()
              setHeldItem(null)
            }
          }
        }
      }
    }

    // Check coffee mugs on table
    if (!foundPrompt && heldItem?.type === 'coffee') {
      const nearDesk = Math.hypot(pos.current.x - (-1.2), pos.current.z - 2.5) < 1.5
      const nearWindow = Math.hypot(pos.current.x - (-2.0), pos.current.z - (-4.2)) < 1.5
      if (nearDesk) {
        foundPrompt = {
          text: 'Press [E] to Place Coffee on Desk',
          action: () => {
            soundEngine.playCoffeeClink()
            placeItemOnTable([-1.4, 0.79, 2.3], heldItem.name, heldItem.drinkType)
          }
        }
      } else if (nearWindow) {
        foundPrompt = {
          text: 'Press [E] to Place Coffee by Window',
          action: () => {
            soundEngine.playCoffeeClink()
            placeItemOnTable([-2.0, 0.95, -4.6], heldItem.name, heldItem.drinkType)
          }
        }
      }
    }

    if (foundPrompt) {
      setActivePrompt(foundPrompt.text, foundPrompt.action)
    } else {
      setActivePrompt(null, null)
    }
  })

  return null
}
