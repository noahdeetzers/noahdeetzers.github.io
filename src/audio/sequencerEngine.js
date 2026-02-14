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
    this.steps = 8
    this.currentStep = 0
    this.isPlaying = false
    this.nextStepTime = 0
    this.timerID = null

    // 12 notes x 8 steps
    this.synthGrid = SYNTH_NOTES.map(() => new Array(8).fill(false))
    // 8 drum types x 8 steps
    this.drumGrid = DRUM_TYPES.map(() => new Array(8).fill(false))
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
    emit('transport:step', { step: -1 })
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

      // Synth notes (polyphonic — all active notes at this step fire)
      for (let n = 0; n < SYNTH_NOTES.length; n++) {
        if (this.synthGrid[n][step]) {
          const freq = SYNTH_NOTES[n].freq
          emit('synth:noteOn', { freq, time: this.nextStepTime })
          emit('synth:noteOff', { freq, time: this.nextStepTime + stepDur * 0.8 })
        }
      }

      // Drum triggers
      for (let d = 0; d < DRUM_TYPES.length; d++) {
        if (this.drumGrid[d][step]) {
          emit('drum:trigger', { type: DRUM_TYPES[d], time: this.nextStepTime })
        }
      }

      emit('transport:step', { step })

      this.nextStepTime += stepDur
      this.currentStep = (this.currentStep + 1) % this.steps
    }

    this.timerID = setTimeout(() => this._schedule(), 25)
  }
}
