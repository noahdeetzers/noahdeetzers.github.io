export class SynthEngine {
  constructor(ctx, output) {
    this.ctx = ctx
    this.voices = new Map()

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 2000
    this.filter.Q.value = 1
    this.filter.connect(output)

    this.attack = 0.05
    this.release = 0.3
  }

  noteOn(freq, time) {
    const t = time || this.ctx.currentTime

    // Release existing voice for this freq to avoid stacking
    if (this.voices.has(freq)) {
      this._releaseVoice(freq, t)
    }

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)

    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.001, t)
    env.gain.exponentialRampToValueAtTime(0.2, t + Math.max(this.attack, 0.005))

    osc.connect(env)
    env.connect(this.filter)
    osc.start(t)

    this.voices.set(freq, { osc, env })
  }

  noteOff(freq, time) {
    const t = time || this.ctx.currentTime
    if (freq != null) {
      this._releaseVoice(freq, t)
    } else {
      // Release all voices (keyboard / legacy behavior)
      for (const f of [...this.voices.keys()]) {
        this._releaseVoice(f, t)
      }
    }
  }

  _releaseVoice(freq, t) {
    const voice = this.voices.get(freq)
    if (!voice) return
    this.voices.delete(freq)

    const { osc, env } = voice
    const tau = Math.max(this.release, 0.01) / 5

    // setTargetAtTime avoids the cancelScheduledValues + setValueAtTime
    // discontinuity that caused crackling — it smoothly decays from
    // whatever value the gain currently has at time t
    env.gain.cancelScheduledValues(t)
    env.gain.setTargetAtTime(0.001, t, tau)

    const stopTime = t + this.release + 0.1
    try { osc.stop(stopTime) } catch (e) {}

    const delay = Math.max(0, (stopTime - this.ctx.currentTime) * 1000) + 200
    setTimeout(() => {
      try { osc.disconnect() } catch (e) {}
      try { env.disconnect() } catch (e) {}
    }, delay)
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
    for (const f of [...this.voices.keys()]) {
      this._releaseVoice(f, this.ctx.currentTime)
    }
    this.filter.disconnect()
  }
}
