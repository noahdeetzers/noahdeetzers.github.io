import { emit } from './audioBus'

export const SYNTH_NOTES = [
  { freq: 261.63, label: 'C' },
  { freq: 277.18, label: 'C#' },
  { freq: 293.66, label: 'D' },
  { freq: 311.13, label: 'D#' },
  { freq: 329.63, label: 'E' },
  { freq: 349.23, label: 'F' },
  { freq: 369.99, label: 'F#' },
  { freq: 392.0,  label: 'G' },
  { freq: 415.30, label: 'G#' },
  { freq: 440.0,  label: 'A' },
  { freq: 466.16, label: 'A#' },
  { freq: 493.88, label: 'B' },
]

export const DRUM_TYPES = ['kick', 'snare', 'hat', 'clap', 'tom', 'rim', 'perc', 'cowbell']

export const RATES = [0.25, 1 / 3, 0.5, 1, 2, 3, 4]
export const RATE_LABELS = ['\u00F74', '\u00F73', '\u00F72', '1\u00D7', '2\u00D7', '3\u00D7', '4\u00D7']

let instance = null

export function getSequencer(ctx) {
  if (!instance) {
    instance = new SequencerEngine(ctx)
  }
  return instance
}

class SequencerEngine {
  constructor(ctx) {
    this.ctx = ctx
    this.tempo = 120
    this.isPlaying = false
    this.timerID = null

    // Synth track
    this.synthSteps = 8
    this.synthRate = 1
    this.synthStep = 0
    this.synthNextTime = 0
    this.synthGrid = SYNTH_NOTES.map(() => new Array(8).fill(false))

    // Drum track
    this.drumSteps = 8
    this.drumRate = 1
    this.drumStep = 0
    this.drumNextTime = 0
    this.drumGrid = DRUM_TYPES.map(() => new Array(8).fill(false))
  }

  start() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.synthStep = 0
    this.drumStep = 0
    const now = this.ctx.currentTime
    this.synthNextTime = now
    this.drumNextTime = now
    this._schedule()
  }

  stop() {
    this.isPlaying = false
    if (this.timerID) clearTimeout(this.timerID)
    this.timerID = null
    this.synthStep = 0
    this.drumStep = 0
    emit('transport:synthStep', { step: -1 })
    emit('transport:drumStep', { step: -1 })
  }

  setTempo(bpm) { this.tempo = bpm }
  setSynthRate(r) { this.synthRate = r }
  setDrumRate(r) { this.drumRate = r }
  setSynthSteps(n) { this.synthSteps = n }
  setDrumSteps(n) { this.drumSteps = n }

  _schedule() {
    if (!this.isPlaying) return
    const lookAhead = 0.1
    const baseStepDur = 60 / this.tempo / 4

    // -- Synth track --
    const synthDur = baseStepDur / this.synthRate
    while (this.synthNextTime < this.ctx.currentTime + lookAhead) {
      const step = this.synthStep
      for (let n = 0; n < SYNTH_NOTES.length; n++) {
        if (this.synthGrid[n] && this.synthGrid[n][step]) {
          const freq = SYNTH_NOTES[n].freq
          emit('synth:noteOn', { freq, time: this.synthNextTime })
          emit('synth:noteOff', { freq, time: this.synthNextTime + synthDur * 0.8 })
        }
      }
      emit('transport:synthStep', { step })
      this.synthNextTime += synthDur
      this.synthStep = (this.synthStep + 1) % this.synthSteps
    }

    // -- Drum track --
    const drumDur = baseStepDur / this.drumRate
    while (this.drumNextTime < this.ctx.currentTime + lookAhead) {
      const step = this.drumStep
      for (let d = 0; d < DRUM_TYPES.length; d++) {
        if (this.drumGrid[d] && this.drumGrid[d][step]) {
          emit('drum:trigger', { type: DRUM_TYPES[d], time: this.drumNextTime })
        }
      }
      emit('transport:drumStep', { step })
      this.drumNextTime += drumDur
      this.drumStep = (this.drumStep + 1) % this.drumSteps
    }

    this.timerID = setTimeout(() => this._schedule(), 25)
  }
}
