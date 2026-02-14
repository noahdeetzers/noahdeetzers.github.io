import { useState, useRef, useCallback, useEffect } from 'react'
import { getAudioContext, getSynthBus } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { SynthEngine } from '../../audio/synthEngine'
import store from '../../audio/studioStore'
import Knob from './Knob'
import MiniKeys from './MiniKeys'

export default function SynthDevice() {
  const engineRef = useRef(null)
  const [cutoff, setCutoff] = useState(() => store.cutoff)
  const [resonance, setResonance] = useState(() => store.resonance)
  const [attack, setAttack] = useState(() => store.attack)
  const [release, setRelease] = useState(() => store.release)

  function ensureEngine() {
    if (!engineRef.current) {
      const ctx = getAudioContext()
      const bus = getSynthBus()
      engineRef.current = new SynthEngine(ctx, bus)
      engineRef.current.setCutoff(store.cutoff)
      engineRef.current.setResonance(store.resonance)
      engineRef.current.setAttack(store.attack)
      engineRef.current.setRelease(store.release)
    }
    return engineRef.current
  }

  useEffect(() => {
    const offOn = on('synth:noteOn', ({ freq, time }) => {
      const engine = ensureEngine()
      engine.noteOn(freq, time)
    })
    const offOff = on('synth:noteOff', ({ freq, time }) => {
      if (engineRef.current) engineRef.current.noteOff(freq, time)
    })
    return () => { offOn(); offOff(); if (engineRef.current) engineRef.current.destroy() }
  }, [])

  const onNoteOn = useCallback((freq) => {
    ensureEngine().noteOn(freq)
  }, [])

  const onNoteOff = useCallback(() => {
    if (engineRef.current) engineRef.current.noteOff()
  }, [])

  const onCutoff = useCallback((v) => { setCutoff(v); store.cutoff = v; if (engineRef.current) engineRef.current.setCutoff(v) }, [])
  const onResonance = useCallback((v) => { setResonance(v); store.resonance = v; if (engineRef.current) engineRef.current.setResonance(v) }, [])
  const onAttack = useCallback((v) => { setAttack(v); store.attack = v; if (engineRef.current) engineRef.current.setAttack(v) }, [])
  const onRelease = useCallback((v) => { setRelease(v); store.release = v; if (engineRef.current) engineRef.current.setRelease(v) }, [])

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
