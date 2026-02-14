import { useState, useRef, useEffect } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { getSequencer, SYNTH_NOTES } from '../../audio/sequencerEngine'

// Display highest note at top
const DISPLAY_ORDER = [...SYNTH_NOTES].reverse()

export default function SynthSeqDevice() {
  const seqRef = useRef(null)
  const [grid, setGrid] = useState(() => SYNTH_NOTES.map(() => new Array(8).fill(false)))
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

  function toggleCell(noteIdx, stepIdx) {
    const next = grid.map((row) => [...row])
    next[noteIdx][stepIdx] = !next[noteIdx][stepIdx]
    setGrid(next)
    const seq = ensureSeq()
    seq.synthGrid = next
  }

  return (
    <div className="seq-device synth-seq" data-fabric-exclude data-beam-block data-cable-port="synth-seq">
      <div className="seq-rows">
        {DISPLAY_ORDER.map((note, displayIdx) => {
          const noteIdx = SYNTH_NOTES.length - 1 - displayIdx
          const isSharp = note.label.includes('#')
          return (
            <div className="seq-row" key={note.label}>
              <span className={`seq-ch-label ${isSharp ? 'seq-ch-label--sharp' : ''}`}>{note.label}</span>
              {grid[noteIdx].map((isOn, sIdx) => (
                <button
                  key={sIdx}
                  className={`seq-step ${isOn ? 'seq-step--on' : ''} ${activeStep === sIdx ? 'seq-step--active' : ''}`}
                  onClick={() => toggleCell(noteIdx, sIdx)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
