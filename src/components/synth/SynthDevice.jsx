import { useState, useRef, useCallback, useEffect } from 'react'
import { getAudioContext, getSynthBus } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { SynthEngine } from '../../audio/synthEngine'
import Knob from './Knob'
import MiniKeys from './MiniKeys'

export default function SynthDevice() {
  const engineRef = useRef(null)
  const [cutoff, setCutoff] = useState(2000)
  const [resonance, setResonance] = useState(1)
  const [attack, setAttack] = useState(0.05)
  const [release, setRelease] = useState(0.3)

  function ensureEngine() {
    if (!engineRef.current) {
      const ctx = getAudioContext()
      const bus = getSynthBus()
      engineRef.current = new SynthEngine(ctx, bus)
    }
    return engineRef.current
  }

  useEffect(() => {
    const offOn = on('synth:noteOn', ({ freq, time }) => {
      const engine = ensureEngine()
      engine.noteOn(freq, time)
    })
    const offOff = on('synth:noteOff', ({ time }) => {
      if (engineRef.current) engineRef.current.noteOff(time)
    })
    return () => { offOn(); offOff(); if (engineRef.current) engineRef.current.destroy() }
  }, [])

  const onNoteOn = useCallback((freq) => {
    ensureEngine().noteOn(freq)
  }, [])

  const onNoteOff = useCallback(() => {
    if (engineRef.current) engineRef.current.noteOff()
  }, [])

  const onCutoff = useCallback((v) => { setCutoff(v); if (engineRef.current) engineRef.current.setCutoff(v) }, [])
  const onResonance = useCallback((v) => { setResonance(v); if (engineRef.current) engineRef.current.setResonance(v) }, [])
  const onAttack = useCallback((v) => { setAttack(v); if (engineRef.current) engineRef.current.setAttack(v) }, [])
  const onRelease = useCallback((v) => { setRelease(v); if (engineRef.current) engineRef.current.setRelease(v) }, [])

  return (
    <div className="synth-device" data-fabric-exclude data-beam-block data-cable-port="synth">
      <div className="synth-knobs">
        <Knob label="CUT" min={200} max={8000} value={cutoff} onChange={onCutoff} />
        <Knob label="RES" min={0} max={20} value={resonance} onChange={onResonance} />
        <Knob label="ATK" min={0.01} max={2} value={attack} onChange={onAttack} />
        <Knob label="REL" min={0.01} max={3} value={release} onChange={onRelease} />
      </div>
      <div className="synth-keys-wrapper">
        <MiniKeys onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      </div>
    </div>
  )
}
