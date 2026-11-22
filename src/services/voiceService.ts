// Real-Time WebRTC Voice Microphone & Audio Streaming Service for lonercafe3d
import { networkSync } from './networkSync'
import { useGameStore } from '../store/gameStore'

class VoiceService {
  private localStream: MediaStream | null = null
  private audioCtx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private animationFrameId: number | null = null
  private remoteAudioElement: HTMLAudioElement | null = null
  private isListening: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      let el = document.getElementById('peer-voice-audio') as HTMLAudioElement
      if (!el) {
        el = document.createElement('audio')
        el.id = 'peer-voice-audio'
        el.autoplay = true
        document.body.appendChild(el)
      }
      this.remoteAudioElement = el
    }
  }

  public async toggleMic(): Promise<boolean> {
    const currentState = useGameStore.getState().isMicActive
    if (currentState) {
      this.stopMic()
      return false
    } else {
      return await this.startMic()
    }
  }

  public async startMic(): Promise<boolean> {
    if (this.isListening) return true

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Microphone not supported on this browser.')
        return false
      }

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })

      // Set up audio analyzer for voice activity detection
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
      const source = this.audioCtx.createMediaStreamSource(this.localStream)
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 256
      source.connect(this.analyser)

      this.isListening = true
      useGameStore.setState({ isMicActive: true })

      // Forward stream to WebRTC peer if connected
      networkSync.streamAudioToPeers(this.localStream)

      this.monitorVoiceLevel()
      return true
    } catch (err) {
      console.warn('Microphone access denied or error:', err)
      this.stopMic()
      return false
    }
  }

  public stopMic() {
    this.isListening = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop()
      })
      this.localStream = null
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {})
      this.audioCtx = null
    }

    useGameStore.setState({ isMicActive: false })
  }

  private monitorVoiceLevel() {
    if (!this.isListening || !this.analyser) return

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    
    const checkVolume = () => {
      if (!this.isListening || !this.analyser) return

      this.analyser.getByteFrequencyData(dataArray)
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const averageVolume = sum / dataArray.length
      const isSpeaking = averageVolume > 14 // Voice detection threshold

      const currentFriend = useGameStore.getState().connectedFriend
      // Broadcast if speaking state changed
      if (isSpeaking) {
        useGameStore.setState((state) => ({
          connectedFriend: state.connectedFriend ? { ...state.connectedFriend, isTalking: true } : null
        }))
      }

      this.animationFrameId = requestAnimationFrame(checkVolume)
    }

    this.animationFrameId = requestAnimationFrame(checkVolume)
  }

  public attachRemoteStream(stream: MediaStream) {
    if (this.remoteAudioElement) {
      this.remoteAudioElement.srcObject = stream
      this.remoteAudioElement.play().catch(e => console.warn('Audio play autoplay blocked:', e))
    }
  }

  public getStream(): MediaStream | null {
    return this.localStream
  }
}

export const voiceService = new VoiceService()
