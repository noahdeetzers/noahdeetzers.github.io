let noiseBuf = null

function getNoiseBuf(ctx) {
  if (!noiseBuf || noiseBuf.sampleRate !== ctx.sampleRate) {
    const len = ctx.sampleRate * 0.5
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

export class DrumEngine {
  constructor(ctx, output) {
    this.ctx = ctx
    this.output = output
  }

  trigger(type, time) {
    const t = time || this.ctx.currentTime
    const fn = this['_' + type]
    if (fn) fn.call(this, t)
  }

  _kick(t) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12)
    gain.gain.setValueAtTime(0.8, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc.connect(gain)
    gain.connect(this.output)
    osc.start(t)
    osc.stop(t + 0.4)
  }

  _snare(t) {
    const ctx = this.ctx
    // noise
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuf(ctx)
    const nf = ctx.createBiquadFilter()
    nf.type = 'highpass'
    nf.frequency.value = 1000
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.4, t)
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    noise.connect(nf)
    nf.connect(ng)
    ng.connect(this.output)
    noise.start(t)
    noise.stop(t + 0.15)
    // body
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, t)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.25, t)
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.connect(og)
    og.connect(this.output)
    osc.start(t)
    osc.stop(t + 0.08)
  }

  _hat(t) {
    const ctx = this.ctx
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuf(ctx)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 8000
    bp.Q.value = 1
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.25, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    noise.connect(bp)
    bp.connect(g)
    g.connect(this.output)
    noise.start(t)
    noise.stop(t + 0.06)
  }

  _clap(t) {
    const ctx = this.ctx
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuf(ctx)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2000
    bp.Q.value = 0.5
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    // multi-hit clap envelope
    for (let i = 0; i < 3; i++) {
      g.gain.setValueAtTime(0.3, t + i * 0.015)
      g.gain.exponentialRampToValueAtTime(0.1, t + i * 0.015 + 0.01)
    }
    g.gain.setValueAtTime(0.3, t + 0.045)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    noise.connect(bp)
    bp.connect(g)
    g.connect(this.output)
    noise.start(t)
    noise.stop(t + 0.2)
  }

  _tom(t) {
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, t)
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15)
    g.gain.setValueAtTime(0.5, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    osc.connect(g)
    g.connect(this.output)
    osc.start(t)
    osc.stop(t + 0.3)
  }

  _rim(t) {
    const ctx = this.ctx
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuf(ctx)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 4000
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
    noise.connect(hp)
    hp.connect(g)
    g.connect(this.output)
    noise.start(t)
    noise.stop(t + 0.02)
  }

  _perc(t) {
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(800, t)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05)
    g.gain.setValueAtTime(0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.connect(g)
    g.connect(this.output)
    osc.start(t)
    osc.stop(t + 0.08)
  }

  _cowbell(t) {
    const ctx = this.ctx
    const o1 = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    o1.type = 'square'
    o2.type = 'square'
    o1.frequency.value = 587
    o2.frequency.value = 845
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 700
    bp.Q.value = 3
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    o1.connect(bp)
    o2.connect(bp)
    bp.connect(g)
    g.connect(this.output)
    o1.start(t)
    o2.start(t)
    o1.stop(t + 0.25)
    o2.stop(t + 0.25)
  }

  destroy() {}
}
