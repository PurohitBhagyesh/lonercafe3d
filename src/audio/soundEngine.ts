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
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 950

    whiteNoise.connect(filter)
    filter.connect(this.rainGain)
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
}

export const soundEngine = new SoundEngine()
