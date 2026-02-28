import { useState, useCallback, useEffect } from 'react'
import { getSynthChannel, getDrumChannel } from '../../audio/audioEngine'
import store from '../../audio/studioStore'
import Knob from '../synth/Knob'

export default function Mixer() {
  const [synthVol, setSynthVol] = useState(() => store.synthVol)
  const [drumVol, setDrumVol] = useState(() => store.drumVol)
  const [synthMute, setSynthMute] = useState(() => store.synthMute)
  const [drumMute, setDrumMute] = useState(() => store.drumMute)

  // Restore mixer state to audio channels on mount
  useEffect(() => {
    const sCh = getSynthChannel()
    sCh.gain.setValueAtTime(store.synthMute ? 0 : store.synthVol, sCh.context.currentTime)
    const dCh = getDrumChannel()
    dCh.gain.setValueAtTime(store.drumMute ? 0 : store.drumVol, dCh.context.currentTime)
  }, [])

  const onSynthVol = useCallback((v) => {
    setSynthVol(v)
    store.synthVol = v
    const ch = getSynthChannel()
    ch.gain.setValueAtTime(synthMute ? 0 : v, ch.context.currentTime)
  }, [synthMute])

  const onDrumVol = useCallback((v) => {
    setDrumVol(v)
    store.drumVol = v
    const ch = getDrumChannel()
    ch.gain.setValueAtTime(drumMute ? 0 : v, ch.context.currentTime)
  }, [drumMute])

  const toggleSynthMute = useCallback(() => {
    const next = !synthMute
    setSynthMute(next)
    store.synthMute = next
    const ch = getSynthChannel()
    ch.gain.setValueAtTime(next ? 0 : synthVol, ch.context.currentTime)
  }, [synthMute, synthVol])

  const toggleDrumMute = useCallback(() => {
    const next = !drumMute
    setDrumMute(next)
    store.drumMute = next
    const ch = getDrumChannel()
    ch.gain.setValueAtTime(next ? 0 : drumVol, ch.context.currentTime)
  }, [drumMute, drumVol])

  return (
    <div className="mixer" data-fabric-exclude data-beam-block data-cable-port="mixer">
      <div className="mixer-channel">
        <span className="mixer-label">SYNTH</span>
        <Knob label="VOL" min={0} max={1} value={synthVol} onChange={onSynthVol} size={34} />
        <button
          className={`mixer-mute ${synthMute ? 'mixer-mute--on' : ''}`}
          onClick={toggleSynthMute}
        >
          {synthMute ? 'M' : 'M'}
        </button>
      </div>
      <div className="mixer-channel">
        <span className="mixer-label">DRUMS</span>
        <Knob label="VOL" min={0} max={1} value={drumVol} onChange={onDrumVol} size={34} />
        <button
          className={`mixer-mute ${drumMute ? 'mixer-mute--on' : ''}`}
          onClick={toggleDrumMute}
        >
          {drumMute ? 'M' : 'M'}
        </button>
      </div>
    </div>
  )
}
