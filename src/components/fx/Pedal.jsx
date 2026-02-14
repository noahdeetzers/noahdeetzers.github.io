import Knob from '../synth/Knob'

export default function Pedal({ label, knobs }) {
  return (
    <div className="pedal" data-cable-port={label.toLowerCase()}>
      <div className="pedal-label">{label}</div>
      <div className="pedal-knobs">
        {knobs.map((k) => (
          <Knob key={k.label} label={k.label} min={k.min} max={k.max} value={k.value} onChange={k.onChange} size={34} />
        ))}
      </div>
    </div>
  )
}
