// AI Autonomous Sanctuary Companion Engine for lonercafe3d
// Simulates an intelligent, comforting, solitary companion (Maya) with 3D pathing & dialogue
import { useGameStore, WeatherType, TimeOfDay } from '../store/gameStore'
import { soundEngine } from '../audio/soundEngine'

interface AIWaypoint {
  name: string
  position: [number, number, number]
  rotationY: number
  state: 'walking' | 'sitting' | 'piano' | 'coffee' | 'watering'
  heldItem: string | null
  durationMs: number
  action?: () => void
}

class AICompanionEngine {
  private isActive: boolean = false
  private currentWaypointIndex: number = 0
  private currentPos: [number, number, number] = [3.6, 0, -0.5]
  private targetPos: [number, number, number] = [3.6, 0, -0.5]
  private currentRotY: number = -Math.PI * 0.5
  private state: string = 'walking'
  private heldItem: string | null = null
  private moveTimer: any = null
  private pianoInterval: any = null

  // Waypoint pathing circuit around the cafe
  private waypoints: AIWaypoint[] = [
    // 1. Espresso Counter: Brewing Coffee
    {
      name: 'barista-station',
      position: [3.4, 0, -0.6],
      rotationY: -Math.PI * 0.5,
      state: 'coffee',
      heldItem: 'steaming-mug',
      durationMs: 14000,
      action: () => {
        soundEngine.playCoffeeClink()
      }
    },
    // 2. Window Counter: Savoring coffee & watching outside
    {
      name: 'window-seat',
      position: [-1.8, 0.65, -4.2],
      rotationY: 0,
      state: 'sitting',
      heldItem: 'steaming-mug',
      durationMs: 18000,
      action: () => {
        soundEngine.playSitSound()
      }
    },
    // 3. Upright Piano: Playing gentle Erik Satie arpeggios
    {
      name: 'upright-piano',
      position: [2.2, 0.52, 3.4],
      rotationY: 0,
      state: 'piano',
      heldItem: null,
      durationMs: 16000,
      action: () => {
        soundEngine.playSitSound()
        this.playPianoMelody()
      }
    },
    // 4. Monstera Corner: Watering plants
    {
      name: 'plant-care',
      position: [-4.2, 0, 1.8],
      rotationY: Math.PI * 0.5,
      state: 'watering',
      heldItem: 'copper-watering-can',
      durationMs: 12000,
      action: () => {
        useGameStore.getState().waterPlant('plant-library-1')
        soundEngine.playWaterSound()
      }
    },
    // 5. Reading Armchair: Enjoying Basho poetry
    {
      name: 'reading-armchair',
      position: [-3.5, 0.45, 2.8],
      rotationY: Math.PI * 0.3,
      state: 'sitting',
      heldItem: 'book',
      durationMs: 18000,
      action: () => {
        soundEngine.playSitSound()
        soundEngine.playPageFlip()
      }
    }
  ]

  public start() {
    if (this.isActive) return
    this.isActive = true

    // Set companion state in store
    useGameStore.getState().setConnectedFriend({
      id: 'ai-companion-maya',
      name: 'Maya (Sanctuary Companion)',
      position: this.currentPos,
      rotationY: this.currentRotY,
      state: 'coffee',
      heldItem: 'steaming-mug',
      isTalking: false,
      isAi: true
    })

    this.advanceToWaypoint()
  }

  public stop() {
    this.isActive = false
    if (this.moveTimer) clearTimeout(this.moveTimer)
    if (this.pianoInterval) clearInterval(this.pianoInterval)
    const current = useGameStore.getState().connectedFriend
    if (current && current.id === 'ai-companion-maya') {
      useGameStore.getState().setConnectedFriend(null)
    }
  }

  private advanceToWaypoint() {
    if (!this.isActive) return

    const wp = this.waypoints[this.currentWaypointIndex]
    this.targetPos = [...wp.position]
    this.currentRotY = wp.rotationY
    this.state = wp.state
    this.heldItem = wp.heldItem

    // Trigger action
    if (wp.action) wp.action()

    // Sync to store
    useGameStore.getState().setConnectedFriend({
      id: 'ai-companion-maya',
      name: 'Maya (Sanctuary Companion)',
      position: this.targetPos,
      rotationY: this.currentRotY,
      state: this.state,
      heldItem: this.heldItem,
      isTalking: false,
      isAi: true
    })

    this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length
    this.moveTimer = setTimeout(() => this.advanceToWaypoint(), wp.durationMs)
  }

  private playPianoMelody() {
    const satieNotes = [392.00, 369.99, 329.63, 293.66, 349.23, 329.63]
    let step = 0
    this.pianoInterval = setInterval(() => {
      if (!this.isActive || this.state !== 'piano' || step >= satieNotes.length) {
        clearInterval(this.pianoInterval)
        return
      }
      soundEngine.playPianoNote(satieNotes[step])
      step++
    }, 1800)
  }

  // AI Dialogue response generator when player speaks in chat
  public respondToChat(userMessage: string) {
    if (!this.isActive) return

    const weather = useGameStore.getState().weather
    const time = useGameStore.getState().timeOfDay

    const responsesByMood = {
      rain: [
        "The sound of rain against the window makes this room feel like the safest place in the world.",
        "Rain has a quiet way of washing away all the noise. Drink your coffee while it's hot.",
        "There's something wonderful about being indoors while a quiet storm rolls outside."
      ],
      snow: [
        "Everything outside is blanketed in silent snow. The warmth from the fireplace reaches all the way here.",
        "A cup of cinnamon cocoa and a quiet corner... winter is meant for days like this.",
        "Soft flakes drifting past the glass... it feels like time itself has slowed down."
      ],
      sakura: [
        "Look at the pink sakura petals dancing across the window glass. Spring has arrived in our sanctuary.",
        "A delicate breeze and cherry blossoms... it reminds me to appreciate gentle fleeting moments.",
        "The wind chimes outside sound so peaceful today."
      ],
      sunset: [
        "The golden sunlight across the hardwood floor is breathtaking at this hour.",
        "Sunset is my favorite time here. The amber glow makes every thought feel peaceful.",
        "The day is gently saying goodbye. You did well today."
      ],
      night: [
        "The stars are out over the forest. Nighttime in the cafe is when true contemplation begins.",
        "Midnight, soft lo-fi piano, and solitude. We don't need anything else right now.",
        "Rest your mind. The sanctuary stays warm all night long."
      ]
    }

    const moodPool = responsesByMood[weather] || responsesByMood.sunset
    const randomReply = moodPool[Math.floor(Math.random() * moodPool.length)]

    // Reply after gentle human-like typing pause (1.2s)
    setTimeout(() => {
      if (!this.isActive) return

      useGameStore.setState((state) => ({
        chatMessages: [
          ...state.chatMessages,
          {
            id: 'maya_' + Date.now(),
            sender: 'Maya (Companion)',
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: false
          }
        ]
      }))

      // Floating 3D speech bubble above Maya
      useGameStore.getState().setFriendSpeech(randomReply)
      soundEngine.playIpodClick()
    }, 1200)
  }
}

export const aiCompanion = new AICompanionEngine()
