import { create } from 'zustand'

export type WeatherType = 'rain' | 'snow' | 'sunset' | 'night' | 'sakura'
export type TimeOfDay = 'dawn' | 'noon' | 'sunset' | 'twilight' | 'midnight'

export type InteractionMode = 
  | 'walking' 
  | 'sitting' 
  | 'reading' 
  | 'writing' 
  | 'brewing' 
  | 'ipod' 
  | 'settings' 
  | 'friends' 
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

interface GameState {
  // Mode & Interactions
  mode: InteractionMode
  setMode: (mode: InteractionMode) => void
  currentSittingSpot: SittingSpot | null
  sitDown: (spot: SittingSpot) => void
  standUp: () => void

  // Camera Eye-View mode
  isEyeView: boolean
  toggleEyeView: () => void

  // Prompt / Raycasting HUD
  activePrompt: string | null
  promptAction: (() => void) | null
  setActivePrompt: (prompt: string | null, action?: (() => void) | null) => void

  // Inventory / Held Item
  heldItem: { id: string; name: string; type: HeldItemType; drinkType?: string } | null
  setHeldItem: (item: { id: string; name: string; type: HeldItemType; drinkType?: string } | null) => void

  // Coffee on tables
  tableItems: Array<{ id: string; type: 'coffee'; position: [number, number, number]; name: string; drinkType?: string }>
  placeItemOnTable: (position: [number, number, number], name?: string, drinkType?: string) => void

  // Plants & Watering
  plants: PlantState[]
  waterPlant: (plantId: string) => void

  // Environment, Weather & Time of Day
  weather: WeatherType
  setWeather: (weather: WeatherType) => void
  timeOfDay: TimeOfDay
  setTimeOfDay: (time: TimeOfDay) => void

  // Audio / Soundboard & Radio
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

  // iPod Player
  ipodSkin: string
  setIpodSkin: (skin: string) => void
  playlist: SongTrack[]
  currentTrackIndex: number
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  setTrackIndex: (idx: number) => void
  addCustomTrack: (track: { title: string; artist: string; url: string }) => void

  // Settings
  mouseSensitivity: number
  setMouseSensitivity: (val: number) => void
  isMobileControls: boolean
  setIsMobileControls: (val: boolean) => void

  // Friend / Multiplayer Presence & Chat
  friendCode: string
  connectedFriend: { id: string; name: string; position: [number, number, number]; state: string; isTalking?: boolean } | null
  setConnectedFriend: (friend: { id: string; name: string; position: [number, number, number]; state: string; isTalking?: boolean } | null) => void
  chatMessages: ChatMessage[]
  lastMessageSentTime: number
  sendChatMessage: (text: string) => boolean
  isMicActive: boolean
  toggleMic: () => void
}

const DEFAULT_PLAYLIST: SongTrack[] = [
  { id: '1', title: 'Midnight Raindrops', artist: 'Loners Sanctuary', isProcedural: true, synthGenre: 'lofi' },
  { id: '2', title: 'Warm Coffee & Empty Booths', artist: 'Solitude Sounds', isProcedural: true, synthGenre: 'jazz' },
  { id: '3', title: 'Winter Window Pane', artist: 'Hygge Ensemble', isProcedural: true, synthGenre: 'piano' },
  { id: '4', title: 'Starry Silence for One', artist: 'Quiet Mind', isProcedural: true, synthGenre: 'ambient' },
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

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'walking',
  setMode: (mode) => set({ mode }),
  currentSittingSpot: null,
  sitDown: (spot) => set({ mode: 'sitting', currentSittingSpot: spot, activePrompt: null }),
  standUp: () => set({ mode: 'walking', currentSittingSpot: null, activePrompt: null }),

  isEyeView: true,
  toggleEyeView: () => set((state) => ({ isEyeView: !state.isEyeView })),

  activePrompt: null,
  promptAction: null,
  setActivePrompt: (prompt, action = null) => set({ activePrompt: prompt, promptAction: action }),

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

  // Plants & Watering
  plants: INITIAL_PLANTS,
  waterPlant: (plantId) => {
    set((state) => ({
      plants: state.plants.map((p) => 
        p.id === plantId ? { ...p, hydrated: true, lastWatered: Date.now() } : p
      )
    }))
  },

  // Weather & Time of Day
  weather: (localStorage.getItem('loners_weather') as WeatherType) || 'rain',
  setWeather: (weather) => {
    localStorage.setItem('loners_weather', weather)
    set({ weather })
  },
  timeOfDay: (localStorage.getItem('loners_time') as TimeOfDay) || 'sunset',
  setTimeOfDay: (timeOfDay) => {
    localStorage.setItem('loners_time', timeOfDay)
    set({ timeOfDay })
  },

  // Audio Volumes
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
  diaryEntries: (() => {
    try {
      const saved = localStorage.getItem('loners_diary')
      return saved ? JSON.parse(saved) : INITIAL_ENTRIES
    } catch {
      return INITIAL_ENTRIES
    }
  })(),
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
      localStorage.setItem('loners_diary', JSON.stringify(updated))
      return { diaryEntries: updated }
    })
  },
  deleteDiaryEntry: (id) => {
    set((state) => {
      const updated = state.diaryEntries.filter(e => e.id !== id)
      localStorage.setItem('loners_diary', JSON.stringify(updated))
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
      artist: track.artist || 'My Upload',
      url: track.url,
      isProcedural: false
    }
    set((state) => ({
      playlist: [...state.playlist, newTrack],
      currentTrackIndex: state.playlist.length,
      isPlaying: true
    }))
  },

  // Settings
  mouseSensitivity: 1.0,
  setMouseSensitivity: (val) => set({ mouseSensitivity: val }),
  isMobileControls: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  setIsMobileControls: (val) => set({ isMobileControls: val }),

  // Friends & Chat
  friendCode: Math.random().toString(36).substring(2, 6).toUpperCase(),
  connectedFriend: null,
  setConnectedFriend: (friend) => set({ connectedFriend: friend }),
  chatMessages: [
    {
      id: 'welcome-chat',
      sender: 'Café Keeper',
      text: 'Welcome to Loners Café. Speak softly or sit in peaceful silence. You are safe here.',
      time: 'Just now',
      isSelf: false
    }
  ],
  lastMessageSentTime: 0,
  sendChatMessage: (text) => {
    const now = Date.now()
    const { lastMessageSentTime } = get()
    // Rate limit: 1 message every 1.5 seconds to keep chat peaceful
    if (now - lastMessageSentTime < 1500) {
      return false
    }

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

    // Echo simulated gentle reply if connected to quiet stranger
    const { connectedFriend } = get()
    if (connectedFriend) {
      setTimeout(() => {
        const friendReplies = [
          "The rain sounds lovely today ☕",
          "Takes a sip of coffee...",
          "Nods gently in quiet solidarity.",
          "Hope you're having a restful evening ✨",
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
  toggleMic: () => set((state) => ({ isMicActive: !state.isMicActive }))
}))
