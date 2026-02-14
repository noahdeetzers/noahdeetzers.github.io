import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { emit } from '../../audio/audioBus'
import { DrumSequencer, DRUM_TYPES } from '../../audio/drumSequencer'
import Knob from '../synth/Knob'

const DRUM_LABELS = ['KK', 'SN', 'HH', 'CP', 'TM', 'RM', 'PC', 'CB']

export default function DrumSeqDevice() {
  const seqRef = useRef(null)
  const [grid, setGrid] = useState(() => DRUM_TYPES.map(() => new Array(8).fill(false)))
  const [playing, setPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [tempo, setTempo] = useState(120)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      const seq = new DrumSequencer(ctx)
      seq.onTrigger = (type, time) => {
        emit('drum:trigger', { type, time })
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
      seq.grid = grid
      seq.setTempo(tempo)
      seq.start()
      setPlaying(true)
    }
  }, [playing, grid, tempo])

  function toggleCell(drumIdx, stepIdx) {
    const next = grid.map((row) => [...row])
    next[drumIdx][stepIdx] = !next[drumIdx][stepIdx]
    setGrid(next)
    if (seqRef.current) seqRef.current.grid = next
  }

  const onTempo = useCallback((v) => {
    setTempo(v)
    if (seqRef.current) seqRef.current.setTempo(v)
  }, [])

  return (
    <div className="seq-device drum-seq" data-fabric-exclude data-beam-block data-cable-port="drum-seq">
      <div className="seq-controls">
        <button className="seq-play" onClick={togglePlay}>
          {playing ? '\u25A0' : '\u25B6'}
        </button>
        <Knob label="BPM" min={60} max={200} value={tempo} onChange={onTempo} size={36} />
      </div>
      <div className="seq-rows">
        {DRUM_TYPES.map((type, dIdx) => (
          <div className="seq-row" key={type}>
            <span className="seq-ch-label">{DRUM_LABELS[dIdx]}</span>
            {grid[dIdx].map((on, sIdx) => (
              <button
                key={sIdx}
                className={`seq-step ${on ? 'seq-step--on' : ''} ${activeStep === sIdx ? 'seq-step--active' : ''}`}
                onClick={() => toggleCell(dIdx, sIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
