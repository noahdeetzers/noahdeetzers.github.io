import { useRef, useEffect, useState } from 'react'
import { getAudioContext, getDeviceBus } from '../../audio/audioEngine'
import { on } from '../../audio/audioBus'
import { DrumEngine } from '../../audio/drumEngine'
import DrumPad from './DrumPad'

const PADS = [
  { type: 'kick', label: 'KK' },
  { type: 'snare', label: 'SN' },
  { type: 'hat', label: 'HH' },
  { type: 'clap', label: 'CP' },
  { type: 'tom', label: 'TM' },
  { type: 'rim', label: 'RM' },
  { type: 'perc', label: 'PC' },
  { type: 'cowbell', label: 'CB' },
]

export default function DrumDevice() {
  const engineRef = useRef(null)
  const [flashPad, setFlashPad] = useState(null)

  function ensureEngine() {
    if (!engineRef.current) {
      const ctx = getAudioContext()
      const bus = getDeviceBus()
      engineRef.current = new DrumEngine(ctx, bus)
    }
    return engineRef.current
  }

  useEffect(() => {
    const off = on('drum:trigger', ({ type, time }) => {
      const engine = ensureEngine()
      engine.trigger(type, time)
      setFlashPad(type)
      setTimeout(() => setFlashPad(null), 100)
    })
    return () => { off(); }
  }, [])

  function handleTrigger(type) {
    const engine = ensureEngine()
    engine.trigger(type)
    setFlashPad(type)
    setTimeout(() => setFlashPad(null), 100)
  }

  return (
    <div className="drum-device" data-fabric-exclude data-beam-block data-cable-port="drum">
      <div className="drum-pads">
        {PADS.map((p) => (
          <DrumPad
            key={p.type}
            label={p.label}
            active={flashPad === p.type}
            onTrigger={() => handleTrigger(p.type)}
          />
        ))}
      </div>
    </div>
  )
}
