import { useRef, useCallback } from 'react'

const SWEEP = 270
const START_ANGLE = 135 // degrees clockwise from 12 o'clock

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const s = polarToXY(cx, cy, r, startDeg)
  const e = polarToXY(cx, cy, r, endDeg)
  const sweep = endDeg - startDeg
  const large = sweep > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

export default function Knob({ label, min, max, value, onChange, size = 44 }) {
  const dragRef = useRef(null)

  const normalized = (value - min) / (max - min)
  const endAngle = START_ANGLE + normalized * SWEEP
  const indicator = polarToXY(size / 2, size / 2, size * 0.32, endAngle)

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault()
      const startY = e.clientY
      const startVal = value

      function onMove(ev) {
        const delta = startY - ev.clientY
        const range = max - min
        const newVal = Math.min(max, Math.max(min, startVal + (delta / 200) * range))
        onChange(newVal)
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [value, min, max, onChange],
  )

  const r = size * 0.36
  const trackR = size * 0.38
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="synth-knob" style={{ width: size, textAlign: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerDown={onPointerDown}
        style={{ cursor: 'ns-resize', touchAction: 'none' }}
      >
        {/* Track (background arc) */}
        <path
          d={describeArc(cx, cy, trackR, START_ANGLE, START_ANGLE + SWEEP)}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Value arc */}
        {normalized > 0.005 && (
          <path
            d={describeArc(cx, cy, trackR, START_ANGLE, endAngle)}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
        {/* Knob body */}
        <circle cx={cx} cy={cy} r={r} fill="var(--card-bg)" stroke="var(--divider)" strokeWidth={1} />
        {/* Indicator dot */}
        <circle cx={indicator.x} cy={indicator.y} r={2} fill="var(--text)" />
      </svg>
      <div className="synth-knob-label">{label}</div>
    </div>
  )
}
