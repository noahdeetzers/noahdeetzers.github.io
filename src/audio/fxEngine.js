function makeDistortionCurve(amount) {
  const n = 44100
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

function createReverbIR(ctx, duration = 2, decay = 2.5) {
  const len = ctx.sampleRate * duration
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
  }
  return buf
}

export class FxEngine {
  constructor(ctx) {
    this.ctx = ctx

    // Distortion
    this.distortion = ctx.createWaveShaper()
    this.distortion.curve = makeDistortionCurve(0)
    this.distortion.oversample = '4x'
    this.distDrive = 0

    // Delay
    this.delay = ctx.createDelay(2)
    this.delay.delayTime.value = 0.3
    this.delayFeedback = ctx.createGain()
    this.delayFeedback.gain.value = 0.3
    this.delayWet = ctx.createGain()
    this.delayWet.gain.value = 0.3
    this.delayDry = ctx.createGain()
    this.delayDry.gain.value = 1

    // Reverb
    this.reverb = ctx.createConvolver()
    this.reverb.buffer = createReverbIR(ctx)
    this.reverbWet = ctx.createGain()
    this.reverbWet.gain.value = 0.25
    this.reverbDry = ctx.createGain()
    this.reverbDry.gain.value = 1

    // Chain: input → distortion → delay split → reverb split → output
    this.input = ctx.createGain()
    this.output = ctx.createGain()

    // Distortion stage
    this.input.connect(this.distortion)

    // Delay stage (wet/dry)
    this.distortion.connect(this.delayDry)
    this.distortion.connect(this.delay)
    this.delay.connect(this.delayFeedback)
    this.delayFeedback.connect(this.delay)
    this.delay.connect(this.delayWet)

    // Reverb stage (wet/dry)
    const postDelay = ctx.createGain()
    this.delayDry.connect(postDelay)
    this.delayWet.connect(postDelay)

    postDelay.connect(this.reverbDry)
    postDelay.connect(this.reverb)
    this.reverb.connect(this.reverbWet)

    this.reverbDry.connect(this.output)
    this.reverbWet.connect(this.output)
  }

  setDrive(v) {
    this.distDrive = v
    this.distortion.curve = makeDistortionCurve(v)
  }

  setDelayTime(v) {
    this.delay.delayTime.setValueAtTime(v, this.ctx.currentTime)
  }

  setDelayFeedback(v) {
    this.delayFeedback.gain.setValueAtTime(v, this.ctx.currentTime)
  }

  setReverbMix(v) {
    this.reverbWet.gain.setValueAtTime(v, this.ctx.currentTime)
    this.reverbDry.gain.setValueAtTime(1 - v, this.ctx.currentTime)
  }

  destroy() {
    this.input.disconnect()
    this.output.disconnect()
  }
}
