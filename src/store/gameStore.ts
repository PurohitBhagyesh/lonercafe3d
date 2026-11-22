import { create } from 'zustand'
import { soundEngine } from '../audio/soundEngine'
import { database } from '../services/database'

export type GamePhase = 'menu' | 'playing' | 'paused'
export type WeatherType = 'rain' | 'snow' | 'sunset' | 'night' | 'sakura'
export type TimeOfDay = 'dawn' | 'noon' | 'sunset' | 'twilight' | 'midnight'

export type AmbientSoundType = 
  | 'auto'
  | 'rain-thunder'
  | 'cafe-bustle'
  | 'fireplace'
  | 'sakura-chimes'
  | 'winter-wind'
  | 'midnight-crickets'

export type InteractionMode = 
  | 'walking' 
  | 'sitting' 
  | 'reading' 
  | 'writing' 
  | 'brewing' 
  | 'ipod' 
  | 'chat'

export interface DiaryEntry {
  id: string
  date: string
  time: string
  title: string
  content: string
  mood: 'peaceful' | 'melancholy' | 'hopeful' | 'cozy' | 'reflective'
}

export interface SongTrack {
  id: string
  title: string
  artist: string
  url?: string
  isProcedural?: boolean
  synthGenre?: 'lofi' | 'ambient' | 'jazz' | 'piano'
}

export interface SittingSpot {
  id: string
  name: string
  seatPosition: [number, number, number]
  cameraPosition: [number, number, number]
  lookAt: [number, number, number]
}

export interface PlantState {
  id: string
  name: string
  position: [number, number, number]
  hydrated: boolean
  lastWatered?: number
}

export interface ChatMessage {
  id: string
  sender: string
  text: string
  time: string
  isSelf: boolean
}

export type HeldItemType = 'coffee' | 'book' | 'watering-can'

export interface KeyBindings {
  forward: string
  backward: string
  left: string
  right: string
  interact: string
  jump: string
}

interface GameState {
  // Game lifecycle
  gamePhase: GamePhase
  setGamePhase: (phase: GamePhase) => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  quitToMenu: () => void

  // World & Multiplayer (6-digit code & password)
  worldCode: string
  worldPassword: string
  worldName: string
  isWorldPrivate: boolean
  setWorldConfig: (config: { name?: string; password?: string; isPrivate?: boolean }) => void
  connectedFriend: { id: string; name: string; position: [number, number, number]; state: string; isTalking?: boolean } | null
  setConnectedFriend: (friend: { id: string; name: string; position: [number, number, number]; state: string; isTalking?: boolean } | null) => void

  // Gameplay Mode
  mode: InteractionMode
  setMode: (mode: InteractionMode) => void
  currentSittingSpot: SittingSpot | null
  sitDown: (spot: SittingSpot) => void
  standUp: () => void

  // Camera & Accessibility Settings
  reduceMotion: boolean
  setReduceMotion: (val: boolean) => void
  smoothAnimations: boolean
  setSmoothAnimations: (val: boolean) => void
  fov: number
  setFov: (val: number) => void
  mouseSensitivity: number
  setMouseSensitivity: (val: number) => void
  invertY: boolean
  setInvertY: (val: boolean) => void
  keyBindings: KeyBindings
  setKeyBinding: (action: keyof KeyBindings, key: string) => void

  // Mute & Background Sounds
  isMuted: boolean
  toggleMute: () => void
  selectedAmbient: AmbientSoundType
  setSelectedAmbient: (ambient: AmbientSoundType) => void

  // HUD Prompts
  activePrompt: string | null
  promptAction: (() => void) | null
  setActivePrompt: (prompt: string | null, action?: (() => void) | null) => void

  // Inventory & Items
  heldItem: { id: string; name: string; type: HeldItemType; drinkType?: string } | null
  setHeldItem: (item: { id: string; name: string; type: HeldItemType; drinkType?: string } | null) => void
  tableItems: Array<{ id: string; type: 'coffee'; position: [number, number, number]; name: string; drinkType?: string }>
  placeItemOnTable: (position: [number, number, number], name?: string, drinkType?: string) => void

  // Plants & Watering
  plants: PlantState[]
  waterPlant: (plantId: string) => void

  // Environment & Atmosphere
  weather: WeatherType
  setWeather: (weather: WeatherType) => void
  timeOfDay: TimeOfDay
  setTimeOfDay: (time: TimeOfDay) => void

  // Sound Engine
  masterVolume: number
  ambientVolume: number
  musicVolume: number
  sfxVolume: number
  setVolume: (type: 'master' | 'ambient' | 'music' | 'sfx', val: number) => void
  currentStation: 'lofi' | 'jazz' | 'rainy-piano' | 'ambient-nature'
  setStation: (station: 'lofi' | 'jazz' | 'rainy-piano' | 'ambient-nature') => void
  isRadioPlaying: boolean
  toggleRadio: () => void

  // Diary
  diaryEntries: DiaryEntry[]
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'date' | 'time'>) => void
  deleteDiaryEntry: (id: string) => void

  // iPod
  ipodSkin: string
  setIpodSkin: (skin: string) => void
  playlist: SongTrack[]
  currentTrackIndex: number
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  setTrackIndex: (idx: number) => void
  addCustomTrack: (track: { title: string; artist: string; url: string }) => void

  // Chat & Voice
  chatMessages: ChatMessage[]
  lastMessageSentTime: number
  sendChatMessage: (text: string) => boolean
  isMicActive: boolean
  toggleMic: () => void

  // Mobile
  isMobileControls: boolean
  setIsMobileControls: (val: boolean) => void
}

const DEFAULT_PLAYLIST: SongTrack[] = [
  { id: '1', title: 'Rain on Copper Roof', artist: 'Loner Sanctuary', isProcedural: true, synthGenre: 'lofi' },
  { id: '2', title: 'Empty Booths & Warm Steam', artist: 'Solitude Collective', isProcedural: true, synthGenre: 'jazz' },
  { id: '3', title: 'Frost on Window Panes', artist: 'Hygge Studies', isProcedural: true, synthGenre: 'piano' },
  { id: '4', title: 'Silent Hours for Quiet Souls', artist: 'Nocturne Studio', isProcedural: true, synthGenre: 'ambient' },
]

const INITIAL_ENTRIES: DiaryEntry[] = [
  {
    id: 'entry-intro',
    date: 'Nov 22, 2026',
    time: 'Late Evening',
    title: 'Finding this quiet place',
    content: "Sometimes you just need a corner in the world where nobody asks anything of you. The rain outside is tapping gently against the glass, steam is rising from the coffee, and for the first time in a while, it's nice to just breathe.",
    mood: 'peaceful'
  }
]

const INITIAL_PLANTS: PlantState[] = [
  { id: 'plant-library-1', name: 'Monstera Deliciosa (Library Corner)', position: [-4.8, 0, 1.8], hydrated: false },
  { id: 'plant-library-2', name: 'Fiddle Leaf Fig (Window Side)', position: [-4.8, 0, -3.8], hydrated: true },
  { id: 'plant-desk', name: 'Desk Bonsai (Writing Nook)', position: [-0.4, 0.78, 2.5], hydrated: false },
  { id: 'plant-bar', name: 'Hanging Pothos (Bar Counter)', position: [4.2, 1.15, -2.4], hydrated: true },
]

// Generate 6-digit numeric world code
function generateWorldCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const useGameStore = create<GameState>((set, get) => ({
  // Game lifecycle
  gamePhase: 'menu',
  setGamePhase: (phase) => set({ gamePhase: phase }),
  startGame: () => set({ gamePhase: 'playing', mode: 'walking' }),
  pauseGame: () => {
    if (get().gamePhase === 'playing') {
      set({ gamePhase: 'paused' })
    }
  },
  resumeGame: () => {
    if (get().gamePhase === 'paused') {
      set({ gamePhase: 'playing' })
    }
  },
  quitToMenu: () => {
    set({ gamePhase: 'menu', mode: 'walking', currentSittingSpot: null, activePrompt: null })
  },

  // World Config (6-digit room code)
  worldCode: generateWorldCode(),
  worldPassword: '',
  worldName: 'Solitary Haven',
  isWorldPrivate: false,
  setWorldConfig: (config) => set((state) => ({
    worldName: config.name ?? state.worldName,
    worldPassword: config.password ?? state.worldPassword,
    isWorldPrivate: config.isPrivate ?? state.isWorldPrivate
  })),
  connectedFriend: null,
  setConnectedFriend: (friend) => set({ connectedFriend: friend }),

  // Mode
  mode: 'walking',
  setMode: (mode) => set({ mode }),
  currentSittingSpot: null,
  sitDown: (spot) => set({ mode: 'sitting', currentSittingSpot: spot, activePrompt: null }),
  standUp: () => set({ mode: 'walking', currentSittingSpot: null, activePrompt: null }),

  // Accessibility & Controls
  reduceMotion: localStorage.getItem('loners_reduce_motion') === 'true',
  setReduceMotion: (val) => {
    localStorage.setItem('loners_reduce_motion', String(val))
    set({ reduceMotion: val })
  },
  smoothAnimations: localStorage.getItem('loners_smooth_animations') !== 'false',
  setSmoothAnimations: (val) => {
    localStorage.setItem('loners_smooth_animations', String(val))
    set({ smoothAnimations: val })
  },
  fov: 72,
  setFov: (val) => set({ fov: val }),
  mouseSensitivity: parseFloat(localStorage.getItem('loners_sensitivity') || '1.0'),
  setMouseSensitivity: (val) => {
    localStorage.setItem('loners_sensitivity', String(val))
    set({ mouseSensitivity: val })
  },
  invertY: localStorage.getItem('loners_invert_y') === 'true',
  setInvertY: (val) => {
    localStorage.setItem('loners_invert_y', String(val))
    set({ invertY: val })
  },

  // Mute & Background Sounds
  isMuted: localStorage.getItem('loners_muted') === 'true',
  toggleMute: () => set((state) => {
    const next = !state.isMuted
    localStorage.setItem('loners_muted', String(next))
    soundEngine.setMuted(next)
    return { isMuted: next }
  }),
  selectedAmbient: (localStorage.getItem('loners_ambient') as AmbientSoundType) || 'auto',
  setSelectedAmbient: (ambient) => {
    localStorage.setItem('loners_ambient', ambient)
    soundEngine.setCustomAmbient(ambient, get().weather)
    set({ selectedAmbient: ambient })
  },
  keyBindings: {
    forward: 'KeyW',
    backward: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    interact: 'KeyE',
    jump: 'Space'
  },
  setKeyBinding: (action, key) => set((state) => ({
    keyBindings: { ...state.keyBindings, [action]: key }
  })),

  // HUD
  activePrompt: null,
  promptAction: null,
  setActivePrompt: (prompt, action = null) => set({ activePrompt: prompt, promptAction: action }),

  // Items
  heldItem: null,
  setHeldItem: (item) => set({ heldItem: item }),
  tableItems: [
    { id: 'initial-coffee', type: 'coffee', position: [-2.2, 0.78, 1.2], name: 'Hot Cinnamon Latte', drinkType: 'latte' }
  ],
  placeItemOnTable: (position, name = 'Fresh Brewed Coffee', drinkType = 'latte') => {
    const { heldItem } = get()
    if (!heldItem) return
    set((state) => ({
      tableItems: [...state.tableItems, { id: `coffee-${Date.now()}`, type: 'coffee', position, name, drinkType }],
      heldItem: null
    }))
  },

  // Plants
  plants: INITIAL_PLANTS,
  waterPlant: (plantId) => {
    set((state) => ({
      plants: state.plants.map((p) => 
        p.id === plantId ? { ...p, hydrated: true, lastWatered: Date.now() } : p
      )
    }))
  },

  // Atmosphere
  weather: (localStorage.getItem('loners_weather') as WeatherType) || 'sakura',
  setWeather: (weather) => {
    localStorage.setItem('loners_weather', weather)
    soundEngine.setWeatherAmbient(weather)
    database.broadcastWeatherSync(weather, get().timeOfDay)
    set({ weather })
  },
  timeOfDay: (localStorage.getItem('loners_time') as TimeOfDay) || 'sunset',
  setTimeOfDay: (timeOfDay) => {
    localStorage.setItem('loners_time', timeOfDay)
    database.broadcastWeatherSync(get().weather, timeOfDay)
    set({ timeOfDay })
  },

  // Volumes
  masterVolume: 0.8,
  ambientVolume: 0.7,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  setVolume: (type, val) => set({ [`${type}Volume`]: val }),
  currentStation: 'lofi',
  setStation: (station) => set({ currentStation: station }),
  isRadioPlaying: false,
  toggleRadio: () => set((state) => ({ isRadioPlaying: !state.isRadioPlaying })),

  // Diary
  diaryEntries: database.getDiaryEntries(),
  addDiaryEntry: (entryData) => {
    const now = new Date()
    const newEntry: DiaryEntry = {
      id: `entry-${Date.now()}`,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...entryData
    }
    set((state) => {
      const updated = [newEntry, ...state.diaryEntries]
      database.saveDiaryEntries(updated)
      return { diaryEntries: updated }
    })
  },
  deleteDiaryEntry: (id) => {
    set((state) => {
      const updated = state.diaryEntries.filter(e => e.id !== id)
      database.saveDiaryEntries(updated)
      return { diaryEntries: updated }
    })
  },

  // iPod
  ipodSkin: localStorage.getItem('loners_ipod_skin') || 'classic-white',
  setIpodSkin: (skin) => {
    localStorage.setItem('loners_ipod_skin', skin)
    set({ ipodSkin: skin })
  },
  playlist: DEFAULT_PLAYLIST,
  currentTrackIndex: 0,
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setTrackIndex: (idx) => set({ currentTrackIndex: idx }),
  addCustomTrack: (track) => {
    const newTrack: SongTrack = {
      id: `custom-${Date.now()}`,
      title: track.title,
      artist: track.artist || 'My Audio',
      url: track.url,
      isProcedural: false
    }
    set((state) => ({
      playlist: [...state.playlist, newTrack],
      currentTrackIndex: state.playlist.length,
      isPlaying: true
    }))
  },

  // Chat
  chatMessages: [
    {
      id: 'welcome-chat',
      sender: 'Café Keeper',
      text: 'Welcome to Loners Café. Speak softly or sit in peaceful silence.',
      time: 'Just now',
      isSelf: false
    }
  ],
  lastMessageSentTime: 0,
  sendChatMessage: (text) => {
    const now = Date.now()
    const { lastMessageSentTime } = get()
    if (now - lastMessageSentTime < 1500) return false

    const newMsg: ChatMessage = {
      id: `msg-${now}`,
      sender: 'You',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    }

    set((state) => ({
      chatMessages: [...state.chatMessages, newMsg],
      lastMessageSentTime: now
    }))

    const { connectedFriend } = get()
    if (connectedFriend) {
      setTimeout(() => {
        const friendReplies = [
          "The rain sounds lovely today ☕",
          "Takes a sip of warm coffee...",
          "Nods in quiet solidarity.",
          "Hope you're having a gentle evening ✨",
          "Such a peaceful corner."
        ]
        const randomReply = friendReplies[Math.floor(Math.random() * friendReplies.length)]
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: `msg-${Date.now()}`,
              sender: connectedFriend.name,
              text: randomReply,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              isSelf: false
            }
          ]
        }))
      }, 1400)
    }

    return true
  },
  isMicActive: false,
  toggleMic: () => set((state) => ({ isMicActive: !state.isMicActive })),

  // Mobile
  isMobileControls: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  setIsMobileControls: (val) => set({ isMobileControls: val })
}))
