import { useState, useRef, useEffect } from 'react'
import { getAudioContext, insertFxChain, removeFxChain } from '../../audio/audioEngine'
import { FxEngine } from '../../audio/fxEngine'
import store from '../../audio/studioStore'
import Pedal from './Pedal'

export default function FxDevice({ chain = 'synth', portPrefix = 'synth' }) {
  const fxRef = useRef(null)
  const [drive, setDrive] = useState(() => store[`${chain}Drive`])
  const [delayTime, setDelayTime] = useState(() => store[`${chain}DelayTime`])
  const [feedback, setFeedback] = useState(() => store[`${chain}Feedback`])
  const [reverbMix, setReverbMix] = useState(() => store[`${chain}ReverbMix`])

  useEffect(() => {
    const ctx = getAudioContext()
    const fx = new FxEngine(ctx)
    fxRef.current = fx

    fx.setDrive(store[`${chain}Drive`])
    fx.setDelayTime(store[`${chain}DelayTime`])
    fx.setDelayFeedback(store[`${chain}Feedback`])
    fx.setReverbMix(store[`${chain}ReverbMix`])

    insertFxChain(chain, fx.input, fx.output)

    return () => {
      fx.destroy()
      removeFxChain(chain)
    }
  }, [chain])

  function onDrive(v) { setDrive(v); store[`${chain}Drive`] = v; fxRef.current?.setDrive(v) }
  function onDelayTime(v) { setDelayTime(v); store[`${chain}DelayTime`] = v; fxRef.current?.setDelayTime(v) }
  function onFeedback(v) { setFeedback(v); store[`${chain}Feedback`] = v; fxRef.current?.setDelayFeedback(v) }
  function onReverbMix(v) { setReverbMix(v); store[`${chain}ReverbMix`] = v; fxRef.current?.setReverbMix(v) }

  return (
    <div className="fx-device" data-fabric-exclude data-beam-block>
      <Pedal label="DIST" portName={`${portPrefix}-dist`} knobs={[{ label: 'DRV', min: 0, max: 50, value: drive, onChange: onDrive }]} />
      <Pedal label="DELAY" portName={`${portPrefix}-delay`} knobs={[
        { label: 'TIME', min: 0, max: 1, value: delayTime, onChange: onDelayTime },
        { label: 'FDBK', min: 0, max: 0.85, value: feedback, onChange: onFeedback },
      ]} />
      <Pedal label="REVERB" portName={`${portPrefix}-reverb`} knobs={[{ label: 'MIX', min: 0, max: 1, value: reverbMix, onChange: onReverbMix }]} />
    </div>
  )
}
