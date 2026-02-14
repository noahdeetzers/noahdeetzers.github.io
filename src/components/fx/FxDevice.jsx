import { useState, useRef, useEffect } from 'react'
import { getAudioContext, insertFxChain, removeFxChain } from '../../audio/audioEngine'
import { FxEngine } from '../../audio/fxEngine'
import Pedal from './Pedal'

export default function FxDevice({ chain = 'synth', portPrefix = 'synth' }) {
  const fxRef = useRef(null)
  const [drive, setDrive] = useState(2)
  const [delayTime, setDelayTime] = useState(0.3)
  const [feedback, setFeedback] = useState(0.3)
  const [reverbMix, setReverbMix] = useState(0.25)

  useEffect(() => {
    const ctx = getAudioContext()
    const fx = new FxEngine(ctx)
    fxRef.current = fx

    // Preset values
    fx.setDrive(2)
    fx.setDelayTime(0.3)
    fx.setDelayFeedback(0.3)
    fx.setReverbMix(0.25)

    insertFxChain(chain, fx.input, fx.output)

    return () => {
      fx.destroy()
      removeFxChain(chain)
    }
  }, [chain])

  function onDrive(v) { setDrive(v); fxRef.current?.setDrive(v) }
  function onDelayTime(v) { setDelayTime(v); fxRef.current?.setDelayTime(v) }
  function onFeedback(v) { setFeedback(v); fxRef.current?.setDelayFeedback(v) }
  function onReverbMix(v) { setReverbMix(v); fxRef.current?.setReverbMix(v) }

  return (
    <div className="fx-device" data-fabric-exclude data-beam-block>
      <Pedal label="DIST" portName={`${portPrefix}-dist`} knobs={[{ label: 'DRV', min: 0, max: 50, value: drive, onChange: onDrive }]} />
      <Pedal label="DELAY" portName={`${portPrefix}-delay`} knobs={[
        { label: 'TIME', min: 0.05, max: 1, value: delayTime, onChange: onDelayTime },
        { label: 'FDBK', min: 0, max: 0.85, value: feedback, onChange: onFeedback },
      ]} />
      <Pedal label="REVERB" portName={`${portPrefix}-reverb`} knobs={[{ label: 'MIX', min: 0, max: 1, value: reverbMix, onChange: onReverbMix }]} />
    </div>
  )
}
