// Sound Engine using Web Audio API for 100% self-contained, offline-first cozy audio

class SoundEngine {
  private ctx: AudioContext | null = null
  private rainNode: AudioNode | null = null
  private rainGain: GainNode | null = null
  private vinylGain: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private masterGain: GainNode | null = null
  private customAudio: HTMLAudioElement | null = null
  private isLoFiLoopRunning = false
  private chordInterval: number | null = null
  private weatherAmbientInterval: number | null = null
  private currentWeather: string = 'rain'
  private currentAmbientMode: string = 'auto'
  private rainFilter: BiquadFilterNode | null = null
  private isMuted: boolean = false
  private savedMasterVolume: number = 0.8

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()
      
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.8
      this.masterGain.connect(this.ctx.destination)

      this.rainGain = this.ctx.createGain()
      this.rainGain.gain.value = 0.5
      this.rainGain.connect(this.masterGain)

      this.vinylGain = this.ctx.createGain()
      this.vinylGain.gain.value = 0.08
      this.vinylGain.connect(this.masterGain)

      this.musicGain = this.ctx.createGain()
      this.musicGain.gain.value = 0.6
      this.musicGain.connect(this.masterGain)

      this.sfxGain = this.ctx.createGain()
      this.sfxGain.gain.value = 0.7
      this.sfxGain.connect(this.masterGain)

      this.startRainSynth()
      this.startVinylCrackle()
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public ensureStarted() {
    this.initContext()
  }

  public setVolumes(master: number, ambient: number, music: number, sfx: number) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(master, now, 0.05)
    if (this.rainGain) this.rainGain.gain.setTargetAtTime(ambient, now, 0.05)
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(music, now, 0.05)
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(sfx, now, 0.05)
  }

  // Realistic procedural rain with pink noise and bandpass filters
  private startRainSynth() {
    if (!this.ctx || !this.rainGain) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08
      b6 = white * 0.115926
    }

    const whiteNoise = this.ctx.createBufferSource()
    whiteNoise.buffer = buffer
    whiteNoise.loop = true

    // Lowpass filter for cozy muffled rain
    this.rainFilter = this.ctx.createBiquadFilter()
    this.rainFilter.type = 'lowpass'
    this.rainFilter.frequency.value = 950

    whiteNoise.connect(this.rainFilter)
    this.rainFilter.connect(this.rainGain)
    whiteNoise.start()
    this.rainNode = whiteNoise
  }

  // Vintage vinyl record crackle
  private startVinylCrackle() {
    if (!this.ctx || !this.vinylGain) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // sparse random clicks
      if (Math.random() < 0.001) {
        data[i] = (Math.random() * 2 - 1) * 0.7
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.005
      }
    }
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.vinylGain)
    source.start()
  }

  // Procedural Cozy Lo-Fi chord progression (Rhodes electric piano vibe)
  public startLofiMusic() {
    this.initContext()
    if (this.isLoFiLoopRunning) return
    this.isLoFiLoopRunning = true

    // Nostalgic jazz chord frequencies: Dm9 -> G13 -> Cmaj9 -> A7b13
    const progressions = [
      [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9
      [246.94, 329.63, 392.0, 493.88],         // G13
      [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
      [220.0, 277.18, 329.63, 415.3, 523.25]   // A7b13
    ]

    let step = 0
    const playChord = () => {
      if (!this.ctx || !this.musicGain || !this.isLoFiLoopRunning) return
      const chord = progressions[step % progressions.length]
      step++

      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const noteGain = this.ctx!.createGain()
        const filter = this.ctx!.createBiquadFilter()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime)

        // warm slight detune for tape warble
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx!.currentTime)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx!.currentTime)

        const now = this.ctx!.currentTime + idx * 0.04 // gentle strum
        noteGain.gain.setValueAtTime(0, now)
        noteGain.gain.linearRampToValueAtTime(0.06, now + 0.15)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8)

        osc.connect(filter)
        filter.connect(noteGain)
        noteGain.connect(this.musicGain!)

        osc.start(now)
        osc.stop(now + 4.0)
      })
    }

    playChord()
    this.chordInterval = window.setInterval(playChord, 4200)
  }

  public stopLofiMusic() {
    this.isLoFiLoopRunning = false
    if (this.chordInterval) {
      clearInterval(this.chordInterval)
      this.chordInterval = null
    }
  }

  // Play uploaded custom MP3 track
  public playCustomAudio(url: string) {
    this.initContext()
    this.stopLofiMusic()
    if (this.customAudio) {
      this.customAudio.pause()
      this.customAudio.src = ''
    }
    this.customAudio = new Audio(url)
    this.customAudio.crossOrigin = 'anonymous'
    const source = this.ctx!.createMediaElementSource(this.customAudio)
    source.connect(this.musicGain!)
    this.customAudio.play().catch(e => console.warn('Audio play prevented:', e))
  }

  public pauseCustomAudio() {
    if (this.customAudio) {
      this.customAudio.pause()
    }
  }

  public resumeCustomAudio() {
    if (this.customAudio) {
      this.customAudio.play().catch(e => console.warn('Audio resume error:', e))
    }
  }

  // Tactile sound effects
  public playFootstep() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80 + Math.random() * 20, this.ctx.currentTime)
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  public playSitSound() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(120, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.4)
  }

  public playCoffeeClink() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime)
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  public playPageFlip() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const bufferSize = this.ctx.sampleRate * 0.15
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.15
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    noise.connect(this.sfxGain)
    noise.start()
  }

  public playWaterSound() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const bufferSize = this.ctx.sampleRate * 0.4
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI) * 0.15
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime)
    filter.Q.value = 3
    noise.connect(filter)
    filter.connect(this.sfxGain)
    noise.start()
  }

  public playPlantSparkle() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const notes = [523.25, 659.25, 783.99, 1046.50] // C E G C arpeggio
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.08)
      gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.08 + 0.3)
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      osc.start(this.ctx!.currentTime + i * 0.08)
      osc.stop(this.ctx!.currentTime + i * 0.08 + 0.35)
    })
  }

  public playIpodClick() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(2200, this.ctx.currentTime)
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.03)
  }

  public playCameraShutter() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.09)
  }

  public playVinylNeedleDrop() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(100, this.ctx.currentTime)
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18)
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  // Dynamic Weather Ambient Audio (Rain, Snow, Sakura Breeze & Bells, Night Crickets)
  public setWeatherAmbient(weather: string) {
    this.initContext()
    this.currentWeather = weather

    if (this.weatherAmbientInterval) {
      clearInterval(this.weatherAmbientInterval)
      this.weatherAmbientInterval = null
    }

    if (!this.ctx || !this.rainGain) return
    const now = this.ctx.currentTime

    if (weather === 'rain') {
      this.rainGain.gain.setTargetAtTime(0.5, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(950, now, 0.4)
    } else if (weather === 'snow') {
      this.rainGain.gain.setTargetAtTime(0.18, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(450, now, 0.4)
    } else if (weather === 'sakura') {
      this.rainGain.gain.setTargetAtTime(0.12, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(600, now, 0.4)

      // Start gentle spring wind chime & distant bird calls
      this.weatherAmbientInterval = window.setInterval(() => {
        if (this.currentWeather === 'sakura') {
          if (Math.random() > 0.4) {
            this.playWindChime()
          } else {
            this.playSpringBird()
          }
        }
      }, 5000)
    } else if (weather === 'night') {
      this.rainGain.gain.setTargetAtTime(0.08, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        if (this.currentWeather === 'night') {
          this.playNightCricket()
        }
      }, 4200)
    } else { // sunset
      this.rainGain.gain.setTargetAtTime(0.15, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(700, now, 0.4)
    }
  }

  // Pentatonic Wind Chime (Crystal bells)
  public playWindChime() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const pentatonic = [1318.5, 1479.98, 1661.22, 1975.53, 2217.46, 2637.02]
    const note = pentatonic[Math.floor(Math.random() * pentatonic.length)]
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(note, now)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2)

    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 3.3)
  }

  // Gentle morning spring bird trill
  public playSpringBird() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(2400, now)
    osc.frequency.exponentialRampToValueAtTime(2900, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.18)

    gain.gain.setValueAtTime(0.02, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Night crickets
  public playNightCricket() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const now = this.ctx.currentTime
    for (let c = 0; c < 3; c++) {
      const t = now + c * 0.08
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(4500, t)

      gain.gain.setValueAtTime(0.012, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)

      osc.connect(gain)
      gain.connect(this.sfxGain)
      osc.start(t)
      osc.stop(t + 0.05)
    }
  }

  // --- MUTE / UNMUTE BACKGROUND & MASTER SOUND ---
  public setMuted(muted: boolean) {
    this.initContext()
    this.isMuted = muted
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime
    if (muted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.04)
      if (this.customAudio) {
        this.customAudio.muted = true
      }
    } else {
      this.masterGain.gain.setTargetAtTime(this.savedMasterVolume, now, 0.05)
      if (this.customAudio) {
        this.customAudio.muted = false
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  // --- DIFFERENT AMBIENT SOUNDSCAPES ---
  public setCustomAmbient(ambient: string, weather: string) {
    this.initContext()
    this.currentAmbientMode = ambient

    if (this.weatherAmbientInterval) {
      clearInterval(this.weatherAmbientInterval)
      this.weatherAmbientInterval = null
    }

    if (!this.ctx || !this.rainGain) return
    const now = this.ctx.currentTime

    if (ambient === 'auto') {
      this.setWeatherAmbient(weather)
      return
    }

    if (ambient === 'rain-thunder') {
      // Deep pouring rain + rolling distant thunder
      this.rainGain.gain.setTargetAtTime(0.55, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(1150, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        if (Math.random() > 0.4) {
          this.playDistantThunder()
        }
      }, 6500)
    } else if (ambient === 'cafe-bustle') {
      // Warm room tone + periodic steam hiss and porcelain clinks
      this.rainGain.gain.setTargetAtTime(0.2, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(800, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        const rand = Math.random()
        if (rand < 0.45) {
          this.playSteamWandHiss()
        } else if (rand < 0.8) {
          this.playCoffeeClink()
        }
      }, 4200)
    } else if (ambient === 'fireplace') {
      // Warm low crackle + popping cedar wood
      this.rainGain.gain.setTargetAtTime(0.16, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(450, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        this.playFireplaceCrackle()
      }, 1000)
    } else if (ambient === 'sakura-chimes') {
      // Spring breeze + pentatonic wind chimes + delicate birdsong
      this.rainGain.gain.setTargetAtTime(0.12, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(600, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        if (Math.random() > 0.4) {
          this.playWindChime()
        } else {
          this.playSpringBird()
        }
      }, 4800)
    } else if (ambient === 'winter-wind') {
      // Sub-bass winter howling wind
      this.rainGain.gain.setTargetAtTime(0.26, now, 0.4)
      if (this.rainFilter) this.rainFilter.frequency.setTargetAtTime(360, now, 0.4)
    } else if (ambient === 'midnight-crickets') {
      // Peaceful night breeze + nocturnal crickets
      this.rainGain.gain.setTargetAtTime(0.08, now, 0.4)
      this.weatherAmbientInterval = window.setInterval(() => {
        this.playNightCricket()
      }, 3600)
    }
  }

  // Distant low-frequency rolling thunder
  public playDistantThunder() {
    this.initContext()
    if (!this.ctx || !this.rainGain) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(68, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 3.0)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(130, now)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.16, now + 0.35)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.rainGain)

    osc.start(now)
    osc.stop(now + 3.5)
  }

  // Steam wand hiss for cafe ambience
  public playSteamWandHiss() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const bufferSize = this.ctx.sampleRate * 0.7
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI) * 0.07
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1750, this.ctx.currentTime)
    filter.Q.value = 1.6

    noise.connect(filter)
    filter.connect(this.sfxGain)
    noise.start()
  }

  // Crackling popping fireplace embers
  public playFireplaceCrackle() {
    this.initContext()
    if (!this.ctx || !this.sfxGain) return
    const pops = 1 + Math.floor(Math.random() * 3)
    const now = this.ctx.currentTime
    for (let p = 0; p < pops; p++) {
      const t = now + p * 0.12 + Math.random() * 0.08
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(180 + Math.random() * 350, t)

      gain.gain.setValueAtTime(0.045, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)

      osc.connect(gain)
      gain.connect(this.sfxGain)
      osc.start(t)
      osc.stop(t + 0.05)
    }
  }
}

export const soundEngine = new SoundEngine()
