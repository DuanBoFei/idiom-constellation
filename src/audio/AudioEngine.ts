class AudioEngine {
  private ctx: AudioContext | null = null

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playNote(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3): void {
    const ctx = this.ensureContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  }

  playMelody(frequencies: number[], duration = 0.2, type: OscillatorType = 'sine'): void {
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, duration, type), i * (duration * 1000 + 50))
    })
  }

  playClick(pitch: number): void {
    this.playNote(pitch, 0.15, 'sine', 0.2)
  }

  playError(): void {
    this.playNote(150, 0.3, 'sawtooth', 0.25)
  }

  playFanfare(): void {
    this.playMelody([262, 330, 392, 524], 0.25, 'sine')
  }

  destroy(): void {
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

export const audioEngine = new AudioEngine()
