import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { soundEngine } from '../../audio/soundEngine'

const VINYL_ALBUMS = [
  { id: '1', title: 'Rain on Copper Roof', artist: 'Loner Sanctuary', color: '#8a5032' },
  { id: '2', title: 'Empty Booths & Warm Steam', artist: 'Solitude Collective', color: '#2b4162' },
  { id: '3', title: 'Frost on Window Panes', artist: 'Hygge Studies', color: '#4a5759' },
  { id: '4', title: 'Silent Hours for Quiet Souls', artist: 'Nocturne Studio', color: '#582f0e' },
]

export function VinylCrate({ position }: { position: [number, number, number] }) {
  const { setTrackIndex, setIsPlaying, currentTrackIndex } = useGameStore()

  return (
    <group position={position}>
      {/* Rustic Wooden Crate Box */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.38, 0.16, 0.44]} />
        <meshStandardMaterial color="#402819" roughness={0.7} />
      </mesh>
      {/* Hollow Interior */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.34, 0.14, 0.4]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.8} />
      </mesh>

      {/* Row of Vinyl Records standing upright in crate */}
      {VINYL_ALBUMS.map((album, idx) => {
        const isCurrent = idx === currentTrackIndex
        return (
          <group
            key={album.id}
            position={[0, 0.18, -0.14 + idx * 0.09]}
            rotation={[0.1, 0, 0]}
            onClick={(e) => {
              e.stopPropagation()
              soundEngine.playVinylNeedleDrop()
              setTrackIndex(idx)
              setIsPlaying(true)
              soundEngine.startLofiMusic()
            }}
          >
            {/* Cardboard Album Jacket Sleeve */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.3, 0.015]} />
              <meshStandardMaterial
                color={album.color}
                roughness={0.6}
              />
            </mesh>
            {/* Vinyl Record slightly peeking out */}
            <mesh position={[0.04, 0.08, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
              <ringGeometry args={[0.03, 0.13, 24]} />
              <meshStandardMaterial color="#111" roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Selection indicator glow if currently spinning */}
            {isCurrent && (
              <pointLight color="#ffba66" intensity={0.4} distance={0.6} decay={2} position={[0, 0.15, 0.05]} />
            )}
          </group>
        )
      })}
    </group>
  )
}
