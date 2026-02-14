export class SynthEngine {
  constructor(ctx, output) {
    this.ctx = ctx

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 2000
    this.filter.Q.value = 1

    this.envelope = ctx.createGain()
    this.envelope.gain.value = 0

    this.filter.connect(this.envelope)
    this.envelope.connect(output)

    this.osc = null
    this.attack = 0.05
    this.release = 0.3
    this.playing = false
  }

  noteOn(freq) {
    const now = this.ctx.currentTime

    if (!this.osc) {
      this.osc = this.ctx.createOscillator()
      this.osc.type = 'sine'
      this.osc.frequency.setValueAtTime(freq, now)
      this.osc.connect(this.filter)
      this.osc.start()
    } else {
      this.osc.frequency.setValueAtTime(freq, now)
    }

    this.envelope.gain.cancelScheduledValues(now)
    this.envelope.gain.setValueAtTime(this.envelope.gain.value, now)
    this.envelope.gain.linearRampToValueAtTime(0.4, now + this.attack)
    this.playing = true
  }

  noteOff() {
    if (!this.playing) return
    const now = this.ctx.currentTime
    this.envelope.gain.cancelScheduledValues(now)
    this.envelope.gain.setValueAtTime(this.envelope.gain.value, now)
    this.envelope.gain.linearRampToValueAtTime(0, now + this.release)
    this.playing = false
  }

  setCutoff(v) {
    this.filter.frequency.setValueAtTime(v, this.ctx.currentTime)
  }

  setResonance(v) {
    this.filter.Q.setValueAtTime(v, this.ctx.currentTime)
  }

  setAttack(v) {
    this.attack = v
  }

  setRelease(v) {
    this.release = v
  }

  destroy() {
    if (this.osc) {
      this.osc.stop()
      this.osc.disconnect()
    }
    this.filter.disconnect()
    this.envelope.disconnect()
  }
}
