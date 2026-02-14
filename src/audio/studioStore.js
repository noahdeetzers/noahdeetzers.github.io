// In-memory store — survives component unmount/remount (panel close/open)
// but resets on full page reload

const store = {
  // Transport
  tempo: 120,

  // Synth sequencer
  synthSteps: 8,
  synthRateIdx: 3,
  synthGrid: null,

  // Drum sequencer
  drumSteps: 8,
  drumRateIdx: 3,
  drumGrid: null,

  // Synth device
  cutoff: 2000,
  resonance: 1,
  attack: 0.05,
  release: 0.3,

  // FX — synth chain
  synthDrive: 0,
  synthDelayTime: 0,
  synthFeedback: 0,
  synthReverbMix: 0,

  // FX — drum chain
  drumDrive: 0,
  drumDelayTime: 0,
  drumFeedback: 0,
  drumReverbMix: 0,

  // Mixer
  synthVol: 0.7,
  drumVol: 0.7,
  synthMute: false,
  drumMute: false,
}

export default store
