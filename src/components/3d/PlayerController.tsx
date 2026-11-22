import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, SittingSpot } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'
import { database } from '../../services/database'

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
    gamePhase,
    pauseGame,
    resumeGame,
    mode, 
    currentSittingSpot, 
    standUp, 
    sitDown, 
    setActivePrompt, 
    mouseSensitivity,
    invertY,
    reduceMotion,
    smoothAnimations,
    keyBindings,
    heldItem,
    setHeldItem,
    placeItemOnTable,
    setMode
  } = useGameStore()

  // Player position and velocity
  const pos = useRef(new THREE.Vector3(0, 1.45, 0))
  const vel = useRef(new THREE.Vector3())
  const targetEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const currentEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const keys = useRef<{ [key: string]: boolean }>({})
  const isPointerLocked = useRef(false)
  const footstepTimer = useRef(0)
  const headBobTimer = useRef(0)
  const menuCameraAngle = useRef(0)
  const syncTimer = useRef(0)

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
      prompt: 'Press [E] to Sit by the Window',
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
      prompt: 'Press [E] to Sit in Reading Armchair',
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
      prompt: 'Press [E] to Open Private Diary',
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
      prompt: 'Press [E] to Read Books',
      pos: [-4.6, 1.5, -0.8],
      radius: 1.8,
      onAction: () => {
        soundEngine.playPageFlip()
        setMode('reading')
      }
    },
    {
      name: 'coffeebar',
      prompt: 'Press [E] to Brew Artisan Coffee',
      pos: [3.3, 1.2, -0.8],
      radius: 1.7,
      onAction: () => {
        setMode('brewing')
      }
    },
    {
      name: 'ipod',
      prompt: 'Press [E] to Open iPod Music',
      pos: [-1.4, 0.95, -4.6],
      radius: 1.5,
      onAction: () => {
        soundEngine.playIpodClick()
        setMode('ipod')
      }
    },
    {
      name: 'watering-can',
      prompt: 'Press [E] to Pick up Watering Can',
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

      // ESCAPE Key: pause / resume or exit submode
      if (e.code === 'Escape') {
        const { gamePhase, mode } = useGameStore.getState()
        if (gamePhase === 'playing') {
          if (mode !== 'walking') {
            // Exit sitting, diary, or reading mode first
            soundEngine.playSitSound()
            standUp()
            setMode('walking')
          } else {
            // Pause game
            soundEngine.playIpodClick()
            pauseGame()
            if (document.pointerLockElement) {
              document.exitPointerLock?.()
            }
          }
          return
        } else if (gamePhase === 'paused') {
          soundEngine.playSitSound()
          resumeGame()
          if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            document.querySelector('canvas')?.requestPointerLock?.()
          }
          return
        }
      }

      // Interact Key (Default 'KeyE')
      const currentInteractKey = useGameStore.getState().keyBindings.interact
      if (e.code === currentInteractKey) {
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

      // Space to stand up when sitting
      if (e.code === 'Space' && mode === 'sitting') {
        soundEngine.playSitSound()
        standUp()
        return
      }

      // Quick access hotkeys (when not typing in chat or diary)
      const isInput = (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA'
      if (!isInput && gamePhase === 'playing') {
        if (e.code === 'KeyM') {
          soundEngine.playIpodClick()
          setMode(mode === 'ipod' ? 'walking' : 'ipod')
        } else if (e.code === 'KeyD') {
          soundEngine.playPageFlip()
          setMode(mode === 'writing' ? 'walking' : 'writing')
        } else if (e.code === 'KeyB') {
          soundEngine.playPageFlip()
          setMode(mode === 'reading' ? 'walking' : 'reading')
        } else if (e.code === 'KeyC') {
          soundEngine.playIpodClick()
          setMode(mode === 'brewing' ? 'walking' : 'brewing')
        } else if (e.code === 'KeyV') {
          soundEngine.playIpodClick()
          useGameStore.getState().toggleMute()
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    const onMouseMove = (e: MouseEvent) => {
      const { gamePhase, mode } = useGameStore.getState()
      if (gamePhase !== 'playing' || !isPointerLocked.current || mode !== 'walking') return
      const sens = 0.0022 * mouseSensitivity
      targetEuler.current.y -= e.movementX * sens
      targetEuler.current.x += (invertY ? e.movementY : -e.movementY) * sens
      // Clamp vertical look between -80 and +80 degrees
      targetEuler.current.x = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, targetEuler.current.x))
    }

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null
    }

    // Companion Broadcast Sync Listener
    const unsubscribeSync = database.onMessage((payload) => {
      if (payload.type === 'PLAYER_MOVE') {
        useGameStore.getState().setConnectedFriend({
          id: payload.senderId,
          name: payload.senderName || 'Companion',
          position: payload.data.position,
          state: payload.data.state
        })
      } else if (payload.type === 'WEATHER_SYNC') {
        useGameStore.getState().setWeather(payload.data.weather)
        useGameStore.getState().setTimeOfDay(payload.data.timeOfDay)
      }
    })

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      unsubscribeSync()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
    }
  }, [mode, mouseSensitivity, invertY, sitDown, standUp, setMode, pauseGame, resumeGame])

  // Camera frame loop
  useFrame((state, delta) => {
    // 0. If In Title Menu: Cinematic slow camera pan
    if (gamePhase === 'menu') {
      menuCameraAngle.current += delta * 0.08
      camera.position.x = Math.sin(menuCameraAngle.current) * 2.5
      camera.position.z = Math.cos(menuCameraAngle.current) * 1.5 - 1.5
      camera.position.y = 1.7
      camera.lookAt(0, 1.2, -5)
      return
    }

    // If Paused: Do not move camera
    if (gamePhase === 'paused') return

    // 1. If Sitting: Smoothly interpolate camera to sitting viewpoint
    if (mode === 'sitting' && currentSittingSpot) {
      const targetPos = new THREE.Vector3(...currentSittingSpot.cameraPosition)
      const targetLook = new THREE.Vector3(...currentSittingSpot.lookAt)

      if (smoothAnimations && !reduceMotion) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, 6, delta)
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, 6, delta)
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 6, delta)
        
        const currentLook = new THREE.Vector3()
        camera.getWorldDirection(currentLook)
        const lookDelta = targetLook.clone().sub(camera.position).normalize()
        currentLook.lerp(lookDelta, delta * 5)
        camera.lookAt(camera.position.clone().add(currentLook))
      } else {
        camera.position.copy(targetPos)
        camera.lookAt(targetLook)
      }

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
      targetEuler.current.y -= touchState.lookDeltaX * sens
      targetEuler.current.x += (invertY ? touchState.lookDeltaY : -touchState.lookDeltaY) * sens
      targetEuler.current.x = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, targetEuler.current.x))
      touchState.lookDeltaX = 0
      touchState.lookDeltaY = 0
    }

    // Smooth camera damping vs instant 1:1 camera
    if (!smoothAnimations || reduceMotion) {
      currentEuler.current.copy(targetEuler.current)
    } else {
      const lookDampSpeed = 38
      currentEuler.current.x = THREE.MathUtils.damp(currentEuler.current.x, targetEuler.current.x, lookDampSpeed, delta)
      currentEuler.current.y = THREE.MathUtils.damp(currentEuler.current.y, targetEuler.current.y, lookDampSpeed, delta)
    }
    camera.quaternion.setFromEuler(currentEuler.current)

    // 4. Calculate movement direction from rebindable keyboard + mobile virtual joystick
    const moveDir = new THREE.Vector3()
    if (keys.current[keyBindings.forward] || keys.current['ArrowUp'] || touchState.moveY < -0.1) moveDir.z -= 1
    if (keys.current[keyBindings.backward] || keys.current['ArrowDown'] || touchState.moveY > 0.1) moveDir.z += 1
    if (keys.current[keyBindings.left] || keys.current['ArrowLeft'] || touchState.moveX < -0.1) moveDir.x -= 1
    if (keys.current[keyBindings.right] || keys.current['ArrowRight'] || touchState.moveX > 0.1) moveDir.x += 1

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
      // Transform direction relative to camera yaw
      moveDir.applyEuler(new THREE.Euler(0, currentEuler.current.y, 0))

      const targetSpeed = 2.7
      if (smoothAnimations) {
        vel.current.x = THREE.MathUtils.damp(vel.current.x, moveDir.x * targetSpeed, 14, delta)
        vel.current.z = THREE.MathUtils.damp(vel.current.z, moveDir.z * targetSpeed, 14, delta)
      } else {
        vel.current.x = moveDir.x * targetSpeed
        vel.current.z = moveDir.z * targetSpeed
      }

      // Head-bobbing (disabled if reduceMotion is on)
      if (!reduceMotion) {
        headBobTimer.current += delta * 9.5
        camera.position.y = 1.45 + Math.sin(headBobTimer.current) * 0.03
      } else {
        camera.position.y = 1.45
      }

      // Footstep audio
      footstepTimer.current += delta
      if (footstepTimer.current > 0.48) {
        soundEngine.playFootstep()
        footstepTimer.current = 0
      }
    } else {
      if (smoothAnimations) {
        vel.current.x = THREE.MathUtils.damp(vel.current.x, 0, 14, delta)
        vel.current.z = THREE.MathUtils.damp(vel.current.z, 0, 14, delta)
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.45, 8, delta)
      } else {
        vel.current.x = 0
        vel.current.z = 0
        camera.position.y = 1.45
      }
    }

    // Apply movement
    pos.current.x += vel.current.x * delta
    pos.current.z += vel.current.z * delta

    // Room collision boundaries
    pos.current.x = Math.max(-4.4, Math.min(4.4, pos.current.x))
    pos.current.z = Math.max(-4.2, Math.min(3.8, pos.current.z))

    camera.position.x = pos.current.x
    camera.position.z = pos.current.z

    // Live Companion Peer Broadcast Sync every 120ms
    syncTimer.current += delta
    if (syncTimer.current > 0.12) {
      syncTimer.current = 0
      database.broadcastPlayerState(
        [pos.current.x, pos.current.y, pos.current.z],
        currentEuler.current.y,
        'walking',
        'Loner'
      )
    }

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
