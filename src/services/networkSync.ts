// Real-Time P2P WebRTC & BroadcastChannel Co-Op Networking Engine for lonercafe3d
import { Peer, DataConnection } from 'peerjs'
import { useGameStore, WeatherType, TimeOfDay } from '../store/gameStore'
import { soundEngine } from '../audio/soundEngine'

export interface NetworkPacket {
  type: 
    | 'PLAYER_MOVE' 
    | 'CHAT_MESSAGE' 
    | 'PIANO_NOTE' 
    | 'PLANT_WATERED' 
    | 'WEATHER_SYNC' 
    | 'HEARTBEAT'
  senderId: string
  senderName: string
  data: any
}

class NetworkSyncService {
  private peer: Peer | null = null
  private connections: Map<string, DataConnection> = new Map()
  private broadcastChannel: BroadcastChannel | null = null
  private localPlayerId: string = 'player_' + Math.random().toString(36).substring(2, 8)
  private playerName: string = 'Loner'
  private currentRoomCode: string = ''
  private isHost: boolean = false
  private isInitialized: boolean = false

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('lonercafe3d_coop_mesh')
        this.broadcastChannel.onmessage = (e) => this.handlePacket(e.data)
      } catch (err) {
        console.warn('BroadcastChannel error:', err)
      }
    }
  }

  public getPlayerId(): string {
    return this.localPlayerId
  }

  public initialize(roomCode: string, isHost: boolean, playerName: string = 'Quiet Soul') {
    if (this.isInitialized && this.currentRoomCode === roomCode) return

    this.currentRoomCode = roomCode
    this.isHost = isHost
    this.playerName = playerName
    this.isInitialized = true

    useGameStore.getState().setCoopStatus('connecting')

    try {
      // Deterministic peer ID for host, random for guest
      const peerId = isHost 
        ? `lonercafe-room-${roomCode}` 
        : `lonercafe-guest-${roomCode}-${this.localPlayerId}`

      this.peer = new Peer(peerId, {
        debug: 0
      })

      this.peer.on('open', (id) => {
        console.log(`[P2P Mesh] Connected with Peer ID: ${id}`)
        if (!isHost) {
          // Connect to the host
          this.connectToPeer(`lonercafe-room-${roomCode}`)
        } else {
          useGameStore.getState().setCoopStatus('connected')
        }
      })

      // When another peer connects to this peer for data
      this.peer.on('connection', (conn) => {
        this.setupConnection(conn)
      })

      // When another peer calls with microphone voice stream
      this.peer.on('call', (mediaConn) => {
        const localStream = (window as any).__loners_local_stream
        mediaConn.answer(localStream || undefined)
        mediaConn.on('stream', (remoteStream) => {
          const audioEl = document.querySelector('#peer-voice-audio') as HTMLAudioElement
          if (audioEl) {
            audioEl.srcObject = remoteStream
            audioEl.play().catch(() => {})
          }
        })
      })

      this.peer.on('error', (err) => {
        // If host peerId is taken, fallback to guest connection
        if (err.type === 'unavailable-id' && isHost) {
          console.warn('[P2P Mesh] Host ID in use, connecting as co-host client.')
          this.peer?.destroy()
          this.peer = new Peer(`lonercafe-cohost-${roomCode}-${this.localPlayerId}`)
          this.peer.on('open', () => {
            this.connectToPeer(`lonercafe-room-${roomCode}`)
          })
          this.peer.on('connection', (conn) => this.setupConnection(conn))
        } else {
          console.warn('[P2P Mesh] PeerJS connection note:', err.message)
        }
      })
    } catch (e) {
      console.warn('Failed to start WebRTC P2P:', e)
    }
  }

  private connectToPeer(targetPeerId: string) {
    if (!this.peer) return
    const conn = this.peer.connect(targetPeerId, {
      reliable: true
    })
    this.setupConnection(conn)
  }

  private setupConnection(conn: DataConnection) {
    conn.on('open', () => {
      console.log(`[P2P Mesh] Direct DataChannel open with peer: ${conn.peer}`)
      this.connections.set(conn.peer, conn)
      useGameStore.getState().setCoopStatus('connected')

      // Announce self
      this.sendPacket({
        type: 'PLAYER_MOVE',
        senderId: this.localPlayerId,
        senderName: this.playerName,
        data: {
          position: [0, 1.45, 0],
          rotationY: 0,
          state: 'walking',
          heldItem: null,
          isTalking: false
        }
      })
    })

    conn.on('data', (data) => {
      this.handlePacket(data as NetworkPacket)
    })

    conn.on('close', () => {
      this.connections.delete(conn.peer)
      if (this.connections.size === 0 && !this.isHost) {
        useGameStore.getState().setCoopStatus('offline')
      }
    })

    conn.on('error', (err) => {
      console.warn('[P2P Mesh] DataConnection error:', err)
    })
  }

  private sendPacket(packet: NetworkPacket) {
    // 1. Send over WebRTC peer data channels
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(packet)
        } catch (e) {
          // ignore
        }
      }
    })

    // 2. Also send over local BroadcastChannel for zero-latency multi-tab sync
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(packet)
      } catch (e) {
        // ignore
      }
    }
  }

  private handlePacket(packet: NetworkPacket) {
    if (!packet || packet.senderId === this.localPlayerId) return

    switch (packet.type) {
      case 'PLAYER_MOVE': {
        const { position, rotationY, state, heldItem, isTalking } = packet.data
        useGameStore.getState().setConnectedFriend({
          id: packet.senderId,
          name: packet.senderName || 'Companion',
          position: position || [0, 1.45, 0],
          rotationY: rotationY || 0,
          state: state || 'walking',
          heldItem: heldItem || null,
          isTalking: !!isTalking,
          isAi: false
        })
        break
      }

      case 'CHAT_MESSAGE': {
        const { text, sender } = packet.data
        useGameStore.setState((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: 'peer_' + Date.now(),
              sender: sender || packet.senderName,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSelf: false
            }
          ]
        }))
        // Display 3D floating speech bubble above companion
        useGameStore.getState().setFriendSpeech(text)
        soundEngine.playIpodClick()
        break
      }

      case 'PIANO_NOTE': {
        if (packet.data && packet.data.freq) {
          soundEngine.playPianoNote(packet.data.freq)
        }
        break
      }

      case 'PLANT_WATERED': {
        const plantId = packet.data?.plantId
        if (plantId) {
          useGameStore.getState().waterPlant(plantId)
          soundEngine.playWaterSound()
        }
        break
      }

      case 'WEATHER_SYNC': {
        if (packet.data?.weather) {
          useGameStore.getState().setWeather(packet.data.weather)
        }
        if (packet.data?.timeOfDay) {
          useGameStore.getState().setTimeOfDay(packet.data.timeOfDay)
        }
        break
      }
    }
  }

  // --- Public Broadcast Methods ---
  public broadcastPlayerState(
    position: [number, number, number],
    rotationY: number,
    state: string,
    heldItem: string | null = null,
    isTalking: boolean = false
  ) {
    this.sendPacket({
      type: 'PLAYER_MOVE',
      senderId: this.localPlayerId,
      senderName: this.playerName,
      data: {
        position,
        rotationY,
        state,
        heldItem,
        isTalking
      }
    })
  }

  public broadcastChatMessage(text: string) {
    this.sendPacket({
      type: 'CHAT_MESSAGE',
      senderId: this.localPlayerId,
      senderName: this.playerName,
      data: {
        text,
        sender: this.playerName
      }
    })
  }

  public broadcastPianoNote(freq: number) {
    this.sendPacket({
      type: 'PIANO_NOTE',
      senderId: this.localPlayerId,
      senderName: this.playerName,
      data: { freq }
    })
  }

  public broadcastPlantWatered(plantId: string) {
    this.sendPacket({
      type: 'PLANT_WATERED',
      senderId: this.localPlayerId,
      senderName: this.playerName,
      data: { plantId }
    })
  }

  public broadcastWeatherSync(weather: WeatherType, timeOfDay: TimeOfDay) {
    this.sendPacket({
      type: 'WEATHER_SYNC',
      senderId: this.localPlayerId,
      senderName: this.playerName,
      data: { weather, timeOfDay }
    })
  }

  public streamAudioToPeers(stream: MediaStream) {
    if (!this.peer) return
    (window as any).__loners_local_stream = stream
    this.connections.forEach((conn) => {
      const call = this.peer?.call(conn.peer, stream)
      call?.on('stream', (remoteStream) => {
        const audioEl = document.querySelector('#peer-voice-audio') as HTMLAudioElement
        if (audioEl) {
          audioEl.srcObject = remoteStream
          audioEl.play().catch(() => {})
        }
      })
    })
  }

  public disconnect() {
    this.connections.forEach(conn => conn.close())
    this.connections.clear()
    this.peer?.destroy()
    this.peer = null
    this.isInitialized = false
    useGameStore.getState().setCoopStatus('offline')
  }
}

export const networkSync = new NetworkSyncService()
