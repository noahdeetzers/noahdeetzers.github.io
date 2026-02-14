import { useState, useRef, useEffect } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { getSequencer, DRUM_TYPES } from '../../audio/sequencerEngine'

const DRUM_LABELS = ['KK', 'SN', 'HH', 'CP', 'TM', 'RM', 'PC', 'CB']

export default function DrumSeqDevice() {
  const seqRef = useRef(null)
  const [grid, setGrid] = useState(() => DRUM_TYPES.map(() => new Array(8).fill(false)))
  const [activeStep, setActiveStep] = useState(-1)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      seqRef.current = getSequencer(ctx)
    }
    return seqRef.current
  }

  useEffect(() => {
    const off = on('transport:step', ({ step }) => setActiveStep(step))
    return () => off()
  }, [])

  function toggleCell(drumIdx, stepIdx) {
    const next = grid.map((row) => [...row])
    next[drumIdx][stepIdx] = !next[drumIdx][stepIdx]
    setGrid(next)
    const seq = ensureSeq()
    seq.drumGrid = next
  }

  return (
    <div className="seq-device drum-seq" data-fabric-exclude data-beam-block data-cable-port="drum-seq">
      <div className="seq-rows">
        {DRUM_TYPES.map((type, dIdx) => (
          <div className="seq-row" key={type}>
            <span className="seq-ch-label">{DRUM_LABELS[dIdx]}</span>
            {grid[dIdx].map((isOn, sIdx) => (
              <button
                key={sIdx}
                className={`seq-step ${isOn ? 'seq-step--on' : ''} ${activeStep === sIdx ? 'seq-step--active' : ''}`}
                onClick={() => toggleCell(dIdx, sIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
