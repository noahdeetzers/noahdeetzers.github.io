export default function DrumPad({ label, active, onTrigger }) {
  return (
    <button
      className={`drum-pad ${active ? 'drum-pad--active' : ''}`}
      onPointerDown={(e) => {
        e.preventDefault()
        onTrigger()
      }}
    >
      <span className="drum-pad-label">{label}</span>
    </button>
  )
}
