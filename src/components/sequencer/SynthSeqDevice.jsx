import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { getSequencer, SYNTH_NOTES, RATES, RATE_LABELS } from '../../audio/sequencerEngine'

const DISPLAY_ORDER = [...SYNTH_NOTES].reverse()

export default function SynthSeqDevice() {
  const seqRef = useRef(null)
  const [grid, setGrid] = useState(() => SYNTH_NOTES.map(() => new Array(8).fill(false)))
  const [activeStep, setActiveStep] = useState(-1)
  const [steps, setSteps] = useState(8)
  const [rateIdx, setRateIdx] = useState(3)
  const paintRef = useRef(null) // { painting: bool, value: bool }

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      seqRef.current = getSequencer(ctx)
    }
    return seqRef.current
  }

  useEffect(() => {
    const off = on('transport:synthStep', ({ step }) => setActiveStep(step))
    return () => off()
  }, [])

  // Stop painting on mouseup anywhere
  useEffect(() => {
    const up = () => { paintRef.current = null }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  const applyCell = useCallback((noteIdx, stepIdx, forceValue) => {
    setGrid(prev => {
      const next = prev.map(row => [...row])
      next[noteIdx][stepIdx] = forceValue
      const seq = ensureSeq()
      seq.synthGrid = next
      return next
    })
  }, [])

  function onCellDown(noteIdx, stepIdx) {
    const newVal = !grid[noteIdx][stepIdx]
    paintRef.current = { value: newVal }
    applyCell(noteIdx, stepIdx, newVal)
  }

  function onCellEnter(noteIdx, stepIdx) {
    if (!paintRef.current) return
    applyCell(noteIdx, stepIdx, paintRef.current.value)
  }

  function changeSteps(delta) {
    const n = Math.max(1, Math.min(32, steps + delta))
    setSteps(n)
    setGrid(prev => {
      const next = prev.map(row => {
        if (n > row.length) return [...row, ...new Array(n - row.length).fill(false)]
        return row.slice(0, n)
      })
      const seq = ensureSeq()
      seq.synthGrid = next
      seq.setSynthSteps(n)
      return next
    })
  }

  function cycleRate() {
    const next = (rateIdx + 1) % RATES.length
    setRateIdx(next)
    const seq = ensureSeq()
    seq.setSynthRate(RATES[next])
  }

  return (
    <div className="seq-device synth-seq" data-fabric-exclude data-beam-block data-cable-port="synth-seq">
      <div className="seq-params">
        <div className="seq-param">
          <span className="seq-param-label">STEPS</span>
          <button className="seq-param-btn" onClick={() => changeSteps(-1)}>&minus;</button>
          <span className="seq-param-value">{steps}</span>
          <button className="seq-param-btn" onClick={() => changeSteps(1)}>+</button>
        </div>
        <button className="seq-param-rate" onClick={cycleRate}>{RATE_LABELS[rateIdx]}</button>
      </div>
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
                  onMouseDown={(e) => { e.preventDefault(); onCellDown(noteIdx, sIdx) }}
                  onMouseEnter={() => onCellEnter(noteIdx, sIdx)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
