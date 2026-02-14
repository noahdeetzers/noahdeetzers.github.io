import { useState, useRef, useCallback, useEffect } from 'react'
import { getAudioContext } from '../audio/audioEngine'
import { getSequencer } from '../audio/sequencerEngine'
import store from '../audio/studioStore'
import Knob from './synth/Knob'

export default function TransportBar() {
  const seqRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [tempo, setTempo] = useState(() => store.tempo)

  function ensureSeq() {
    if (!seqRef.current) {
      const ctx = getAudioContext()
      seqRef.current = getSequencer(ctx)
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
    } else {
      seq.setTempo(tempo)
      seq.start()
      setPlaying(true)
    }
  }, [playing, tempo])

  const onTempo = useCallback((v) => {
    setTempo(v)
    store.tempo = v
    if (seqRef.current) seqRef.current.setTempo(v)
  }, [])

  return (
    <div className="transport-bar" data-fabric-exclude data-beam-block>
      <button className="seq-play" onClick={togglePlay}>
        {playing ? '\u25A0' : '\u25B6'}
      </button>
      <Knob label="BPM" min={60} max={200} value={tempo} onChange={onTempo} size={36} />
      <span className="transport-bpm">{Math.round(tempo)}</span>
    </div>
  )
}
