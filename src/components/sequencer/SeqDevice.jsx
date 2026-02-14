import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudioContext } from '../../audio/audioEngine'
import { emit } from '../../audio/audioBus'
import { SequencerEngine } from '../../audio/sequencerEngine'
import Knob from '../synth/Knob'

export default function SeqDevice() {
  const seqRef = useRef(null)
  const [ch1, setCh1] = useState(new Array(16).fill(false))
  const [ch2, setCh2] = useState(new Array(16).fill(false))
  const [playing, setPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [tempo, setTempo] = useState(120)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      const seq = new SequencerEngine(ctx)
      seq.onSynthNote = (freq, time, offTime) => {
        emit('synth:noteOn', { freq, time })
        emit('synth:noteOff', { time: offTime })
      }
      seq.onDrumTrigger = (type, time) => {
        emit('drum:trigger', { type, time })
      }
      seq.onStepChange = (step) => setActiveStep(step)
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
      seq.ch1Pattern = ch1
      seq.ch2Pattern = ch2
      seq.setTempo(tempo)
      seq.start()
      setPlaying(true)
    }
  }, [playing, ch1, ch2, tempo])

  function toggleStep(ch, idx) {
    if (ch === 1) {
      const next = [...ch1]
      next[idx] = !next[idx]
      setCh1(next)
      if (seqRef.current) seqRef.current.ch1Pattern = next
    } else {
      const next = [...ch2]
      next[idx] = !next[idx]
      setCh2(next)
      if (seqRef.current) seqRef.current.ch2Pattern = next
    }
  }

  const onTempo = useCallback((v) => {
    setTempo(v)
    if (seqRef.current) seqRef.current.setTempo(v)
  }, [])

  return (
    <div className="seq-device" data-fabric-exclude data-beam-block>
      <div className="seq-controls">
        <button className="seq-play" onClick={togglePlay}>
          {playing ? '\u25A0' : '\u25B6'}
        </button>
        <Knob label="BPM" min={60} max={200} value={tempo} onChange={onTempo} size={36} />
      </div>
      <div className="seq-rows">
        <div className="seq-row">
          <span className="seq-ch-label">SYN</span>
          {ch1.map((on, i) => (
            <button
              key={i}
              className={`seq-step ${on ? 'seq-step--on' : ''} ${activeStep === i ? 'seq-step--active' : ''} ${i % 4 === 0 ? 'seq-step--beat' : ''}`}
              onClick={() => toggleStep(1, i)}
            />
          ))}
        </div>
        <div className="seq-row">
          <span className="seq-ch-label">DRM</span>
          {ch2.map((on, i) => (
            <button
              key={i}
              className={`seq-step seq-step--ch2 ${on ? 'seq-step--on' : ''} ${activeStep === i ? 'seq-step--active' : ''} ${i % 4 === 0 ? 'seq-step--beat' : ''}`}
              onClick={() => toggleStep(2, i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
