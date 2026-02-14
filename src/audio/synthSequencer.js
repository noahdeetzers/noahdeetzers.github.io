export const SYNTH_NOTES = [
  { freq: 261.63, label: 'C4' },
  { freq: 293.66, label: 'D4' },
  { freq: 329.63, label: 'E4' },
  { freq: 349.23, label: 'F4' },
  { freq: 392.0,  label: 'G4' },
  { freq: 440.0,  label: 'A4' },
  { freq: 493.88, label: 'B4' },
  { freq: 523.25, label: 'C5' },
]

export class SynthSequencer {
  constructor(ctx) {
    this.ctx = ctx
    this.tempo = 120
    this.steps = 8
    this.currentStep = 0
    this.isPlaying = false
    this.nextStepTime = 0
    this.timerID = null

    // Each slot: note index (0–7) or -1 for rest
    this.pattern = new Array(8).fill(-1)

    this.onNote = null   // (freq, time, offTime) => {}
    this.onStep = null   // (step) => {}
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
      const noteIdx = this.pattern[step]

      if (noteIdx >= 0 && noteIdx < SYNTH_NOTES.length && this.onNote) {
        this.onNote(SYNTH_NOTES[noteIdx].freq, this.nextStepTime, this.nextStepTime + stepDur * 0.8)
      }

      if (this.onStep) this.onStep(step)

      this.nextStepTime += stepDur
      this.currentStep = (this.currentStep + 1) % this.steps
    }

    this.timerID = setTimeout(() => this._schedule(), 25)
  }
}
