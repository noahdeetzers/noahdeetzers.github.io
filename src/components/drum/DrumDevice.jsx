import { useRef, useEffect, useState, useCallback } from 'react'
import { getAudioContext, getDrumBus } from '../../audio/audioEngine'
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
  const [flashPads, setFlashPads] = useState(new Set())
  const timersRef = useRef(new Map())

  function ensureEngine() {
    if (!engineRef.current) {
      const ctx = getAudioContext()
      const bus = getDrumBus()
      engineRef.current = new DrumEngine(ctx, bus)
    }
    return engineRef.current
  }

  const flashPad = useCallback((type) => {
    setFlashPads(prev => new Set([...prev, type]))
    // Clear previous timer for this type if retriggered quickly
    const prev = timersRef.current.get(type)
    if (prev) clearTimeout(prev)
    timersRef.current.set(type, setTimeout(() => {
      setFlashPads(p => {
        const next = new Set(p)
        next.delete(type)
        return next
      })
      timersRef.current.delete(type)
    }, 100))
  }, [])

  useEffect(() => {
    const off = on('drum:trigger', ({ type, time }) => {
      const engine = ensureEngine()
      engine.trigger(type, time)
      flashPad(type)
    })
    return () => { off() }
  }, [flashPad])

  function handleTrigger(type) {
    const engine = ensureEngine()
    engine.trigger(type)
    flashPad(type)
  }

  return (
    <div className="drum-device" data-fabric-exclude data-beam-block data-cable-port="drum">
      <div className="drum-pads">
        {PADS.map((p) => (
          <DrumPad
            key={p.type}
            label={p.label}
            active={flashPads.has(p.type)}
            onTrigger={() => handleTrigger(p.type)}
          />
        ))}
      </div>
    </div>
  )
}
