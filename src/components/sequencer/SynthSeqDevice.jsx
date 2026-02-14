import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { emit } from '../../audio/audioBus'
import { SynthSequencer, SYNTH_NOTES } from '../../audio/synthSequencer'
import Knob from '../synth/Knob'

export default function SynthSeqDevice() {
  const seqRef = useRef(null)
  const [pattern, setPattern] = useState(new Array(8).fill(-1))
  const [playing, setPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [tempo, setTempo] = useState(120)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      const seq = new SynthSequencer(ctx)
      seq.onNote = (freq, time, offTime) => {
        emit('synth:noteOn', { freq, time })
        emit('synth:noteOff', { time: offTime })
      }
      seq.onStep = (step) => setActiveStep(step)
      seqRef.current = seq
    }
    return seqRef.current
  }

  useEffect(() => {
    return () => {
      if (seqRef.current) seqRef.current.stop()
    }
  }, [])

  const togglePlay = useCallback(() => {
    const seq = ensureSeq()
    if (playing) {
      seq.stop()
      setPlaying(false)
      setActiveStep(-1)
    } else {
      seq.pattern = pattern
      seq.setTempo(tempo)
      seq.start()
      setPlaying(true)
    }
  }, [playing, pattern, tempo])

  function cycleStep(idx) {
    const next = [...pattern]
    next[idx] = next[idx] >= 7 ? -1 : next[idx] + 1
    setPattern(next)
    if (seqRef.current) seqRef.current.pattern = next
  }

  const onTempo = useCallback((v) => {
    setTempo(v)
    if (seqRef.current) seqRef.current.setTempo(v)
  }, [])

  return (
    <div className="seq-device synth-seq" data-fabric-exclude data-beam-block data-cable-port="synth-seq">
      <div className="seq-controls">
        <button className="seq-play" onClick={togglePlay}>
          {playing ? '\u25A0' : '\u25B6'}
        </button>
        <Knob label="BPM" min={60} max={200} value={tempo} onChange={onTempo} size={36} />
      </div>
      <div className="seq-grid--synth">
        {pattern.map((noteIdx, i) => {
          const isOn = noteIdx >= 0
          const label = isOn ? SYNTH_NOTES[noteIdx].label : ''
          return (
            <button
              key={i}
              className={`seq-step-synth ${isOn ? 'seq-step-synth--on' : ''} ${activeStep === i ? 'seq-step-synth--active' : ''}`}
              onClick={() => cycleStep(i)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
