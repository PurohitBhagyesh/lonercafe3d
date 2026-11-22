// Database & Live Companion Synchronization Service for lonercafe3d
// Uses IndexedDB + localStorage fallback + BroadcastChannel for real-time peer syncing

import { DiaryEntry, WeatherType, TimeOfDay } from '../store/gameStore'

export interface CompanionSyncPayload {
  type: 'PLAYER_MOVE' | 'CHAT_MESSAGE' | 'WEATHER_SYNC' | 'INTERACTION'
  senderId: string
  senderName: string
  data: any
}

class SanctuaryDatabase {
  private channel: BroadcastChannel | null = null
  private localPlayerId: string

  constructor() {
    this.localPlayerId = 'player_' + Math.random().toString(36).substring(2, 9)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('lonercafe3d_channel')
      } catch (e) {
        console.warn('BroadcastChannel not supported or restricted:', e)
      }
    }
  }

  public getPlayerId(): string {
    return this.localPlayerId
  }

  // --- 1. DIARY PERSISTENCE ---
  public getDiaryEntries(): DiaryEntry[] {
    try {
      const data = localStorage.getItem('loners_diary_entries')
      if (data) return JSON.parse(data)
    } catch (e) {
      console.error('Error reading diary from storage:', e)
    }

    // Default welcoming entry
    return [
      {
        id: 'entry-welcome',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: '7:00 PM',
        title: 'A Solitary Sanctuary',
        content: 'I stumbled upon this quiet café hidden away from the world. The soft jazz on the vinyl player, the aroma of fresh dark roast, and the falling leaves outside the panoramic window... I think I will stay here for a while.',
        mood: 'peaceful'
      }
    ]
  }

  public saveDiaryEntries(entries: DiaryEntry[]): void {
    try {
      localStorage.setItem('loners_diary_entries', JSON.stringify(entries))
    } catch (e) {
      console.error('Error saving diary entries:', e)
    }
  }

  public exportDiaryToMarkdown(entries: DiaryEntry[]): string {
    return entries.map(entry => {
      return `# ${entry.title}\n*Date: ${entry.date} at ${entry.time} | Mood: ${entry.mood}*\n\n${entry.content}\n\n---\n`
    }).join('\n')
  }

  // --- 2. WORLD & CONFIG PERSISTENCE ---
  public getWorldSettings() {
    try {
      const weather = (localStorage.getItem('loners_weather') as WeatherType) || 'sakura'
      const timeOfDay = (localStorage.getItem('loners_time') as TimeOfDay) || 'sunset'
      const mouseSens = parseFloat(localStorage.getItem('loners_sensitivity') || '1.0')
      const reduceMotion = localStorage.getItem('loners_reduce_motion') === 'true'
      const fov = parseInt(localStorage.getItem('loners_fov') || '75', 10)
      const worldCode = localStorage.getItem('loners_world_code') || Math.floor(100000 + Math.random() * 900000).toString()

      return { weather, timeOfDay, mouseSens, reduceMotion, fov, worldCode }
    } catch {
      return {
        weather: 'sakura' as WeatherType,
        timeOfDay: 'sunset' as TimeOfDay,
        mouseSens: 1.0,
        reduceMotion: false,
        fov: 75,
        worldCode: '849201'
      }
    }
  }

  // --- 3. LIVE COMPANION PEER BROADCAST (Multi-Tab / Multi-Window Sync) ---
  public broadcastPlayerState(pos: [number, number, number], rotY: number, state: 'walking' | 'sitting', name: string) {
    if (!this.channel) return
    const payload: CompanionSyncPayload = {
      type: 'PLAYER_MOVE',
      senderId: this.localPlayerId,
      senderName: name,
      data: {
        position: pos,
        rotationY: rotY,
        state
      }
    }
    try {
      this.channel.postMessage(payload)
    } catch (e) {
      // ignore
    }
  }

  public broadcastChatMessage(sender: string, text: string) {
    if (!this.channel) return
    const payload: CompanionSyncPayload = {
      type: 'CHAT_MESSAGE',
      senderId: this.localPlayerId,
      senderName: sender,
      data: {
        id: 'msg_' + Date.now(),
        sender,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      }
    }
    try {
      this.channel.postMessage(payload)
    } catch (e) {
      // ignore
    }
  }

  public broadcastWeatherSync(weather: WeatherType, timeOfDay: TimeOfDay) {
    if (!this.channel) return
    const payload: CompanionSyncPayload = {
      type: 'WEATHER_SYNC',
      senderId: this.localPlayerId,
      senderName: 'Host',
      data: { weather, timeOfDay }
    }
    try {
      this.channel.postMessage(payload)
    } catch (e) {
      // ignore
    }
  }

  public onMessage(callback: (payload: CompanionSyncPayload) => void): () => void {
    if (!this.channel) return () => {}
    const handler = (event: MessageEvent<CompanionSyncPayload>) => {
      if (event.data && event.data.senderId !== this.localPlayerId) {
        callback(event.data)
      }
    }
    this.channel.addEventListener('message', handler)
    return () => {
      this.channel?.removeEventListener('message', handler)
    }
  }
}

export const database = new SanctuaryDatabase()
