export const DRUM_TYPES = ['kick', 'snare', 'hat', 'clap', 'tom', 'rim', 'perc', 'cowbell']

export class DrumSequencer {
  constructor(ctx) {
    this.ctx = ctx
    this.tempo = 120
    this.steps = 8
    this.currentStep = 0
    this.isPlaying = false
    this.nextStepTime = 0
    this.timerID = null

    // 8 drum types x 8 steps
    this.grid = DRUM_TYPES.map(() => new Array(8).fill(false))

    this.onTrigger = null  // (type, time) => {}
    this.onStep = null     // (step) => {}
  }

  start() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.currentStep = 0
    this.nextStepTime = this.ctx.currentTime
    this._schedule()
  }

  stop() {
    this.isPlaying = false
    if (this.timerID) clearTimeout(this.timerID)
    this.timerID = null
    this.currentStep = 0
    if (this.onStep) this.onStep(-1)
  }

  setTempo(bpm) {
    this.tempo = bpm
  }

  _schedule() {
    if (!this.isPlaying) return
    const lookAhead = 0.1
    const stepDur = 60 / this.tempo / 4

    while (this.nextStepTime < this.ctx.currentTime + lookAhead) {
      const step = this.currentStep

      for (let d = 0; d < DRUM_TYPES.length; d++) {
        if (this.grid[d][step] && this.onTrigger) {
          this.onTrigger(DRUM_TYPES[d], this.nextStepTime)
        }
      }

      if (this.onStep) this.onStep(step)

      this.nextStepTime += stepDur
      this.currentStep = (this.currentStep + 1) % this.steps
    }

    this.timerID = setTimeout(() => this._schedule(), 25)
  }
}
