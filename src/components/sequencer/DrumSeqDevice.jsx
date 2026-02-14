import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { getSequencer, DRUM_TYPES, RATES, RATE_LABELS } from '../../audio/sequencerEngine'

const DRUM_LABELS = ['KK', 'SN', 'HH', 'CP', 'TM', 'RM', 'PC', 'CB']

export default function DrumSeqDevice() {
  const seqRef = useRef(null)
  const [grid, setGrid] = useState(() => DRUM_TYPES.map(() => new Array(8).fill(false)))
  const [activeStep, setActiveStep] = useState(-1)
  const [steps, setSteps] = useState(8)
  const [rateIdx, setRateIdx] = useState(3)
  const paintRef = useRef(null)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      seqRef.current = getSequencer(ctx)
    }
    return seqRef.current
  }

  useEffect(() => {
    const off = on('transport:drumStep', ({ step }) => setActiveStep(step))
    return () => off()
  }, [])

  useEffect(() => {
    const up = () => { paintRef.current = null }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  const applyCell = useCallback((drumIdx, stepIdx, forceValue) => {
    setGrid(prev => {
      const next = prev.map(row => [...row])
      next[drumIdx][stepIdx] = forceValue
      const seq = ensureSeq()
      seq.drumGrid = next
      return next
    })
  }, [])

  function onCellDown(drumIdx, stepIdx) {
    const newVal = !grid[drumIdx][stepIdx]
    paintRef.current = { value: newVal }
    applyCell(drumIdx, stepIdx, newVal)
  }

  function onCellEnter(drumIdx, stepIdx) {
    if (!paintRef.current) return
    applyCell(drumIdx, stepIdx, paintRef.current.value)
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
      seq.drumGrid = next
      seq.setDrumSteps(n)
      return next
    })
  }

  function cycleRate() {
    const next = (rateIdx + 1) % RATES.length
    setRateIdx(next)
    const seq = ensureSeq()
    seq.setDrumRate(RATES[next])
  }

  return (
    <div className="seq-device drum-seq" data-fabric-exclude data-beam-block data-cable-port="drum-seq">
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
        {DRUM_TYPES.map((type, dIdx) => (
          <div className="seq-row" key={type}>
            <span className="seq-ch-label">{DRUM_LABELS[dIdx]}</span>
            {grid[dIdx].map((isOn, sIdx) => (
              <button
                key={sIdx}
                className={`seq-step ${isOn ? 'seq-step--on' : ''} ${activeStep === sIdx ? 'seq-step--active' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); onCellDown(dIdx, sIdx) }}
                onMouseEnter={() => onCellEnter(dIdx, sIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
