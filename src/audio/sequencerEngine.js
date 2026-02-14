const CH1_NOTES = [
  261.63, 311.13, 349.23, 392.0, 311.13, 440.0, 392.0, 349.23,
  523.25, 440.0, 392.0, 349.23, 311.13, 392.0, 349.23, 261.63,
]

const CH2_DRUMS = [
  'kick', 'hat', 'hat', 'hat', 'snare', 'hat', 'hat', 'hat',
  'kick', 'hat', 'rim', 'hat', 'snare', 'hat', 'kick', 'hat',
]

export { CH1_NOTES, CH2_DRUMS }

export class SequencerEngine {
  constructor(ctx) {
    this.ctx = ctx
    this.tempo = 120
    this.steps = 16
    this.currentStep = 0
    this.isPlaying = false
    this.nextStepTime = 0
    this.timerID = null

    this.ch1Pattern = new Array(16).fill(false)
    this.ch2Pattern = new Array(16).fill(false)

    this.onSynthNote = null   // (freq, time, offTime) => {}
    this.onDrumTrigger = null // (type, time) => {}
    this.onStepChange = null  // (step) => {}
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
    if (this.onStepChange) this.onStepChange(-1)
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

      if (this.ch1Pattern[step] && this.onSynthNote) {
        this.onSynthNote(CH1_NOTES[step], this.nextStepTime, this.nextStepTime + stepDur * 0.8)
      }

      if (this.ch2Pattern[step] && this.onDrumTrigger) {
        this.onDrumTrigger(CH2_DRUMS[step], this.nextStepTime)
      }

      if (this.onStepChange) this.onStepChange(step)

      this.nextStepTime += stepDur
      this.currentStep = (this.currentStep + 1) % this.steps
    }

    this.timerID = setTimeout(() => this._schedule(), 25)
  }
}
