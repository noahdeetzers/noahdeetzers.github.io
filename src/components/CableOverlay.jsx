import { useState, useEffect, useCallback, useRef } from 'react'

const CABLE_DEFS = [
  // Synth chain
  { from: 'synth', fromSide: 'bottom', to: 'synth-seq', toSide: 'top', color: 'var(--text-secondary)' },
  { from: 'synth-seq', fromSide: 'bottom', to: 'synth-dist', toSide: 'top', color: 'var(--text-secondary)' },
  { from: 'synth-dist', fromSide: 'right', to: 'synth-delay', toSide: 'left', color: 'var(--accent)' },
  { from: 'synth-delay', fromSide: 'right', to: 'synth-reverb', toSide: 'left', color: 'var(--accent)' },
  // Drum chain
  { from: 'drum', fromSide: 'bottom', to: 'drum-seq', toSide: 'top', color: 'var(--text-secondary)' },
  { from: 'drum-seq', fromSide: 'bottom', to: 'drum-dist', toSide: 'top', color: 'var(--text-secondary)' },
  { from: 'drum-dist', fromSide: 'right', to: 'drum-delay', toSide: 'left', color: 'var(--accent)' },
  { from: 'drum-delay', fromSide: 'right', to: 'drum-reverb', toSide: 'left', color: 'var(--accent)' },
  // Merge to mixer
  { from: 'synth-reverb', fromSide: 'bottom', to: 'mixer', toSide: 'top', color: 'var(--text-secondary)' },
  { from: 'drum-reverb', fromSide: 'bottom', to: 'mixer', toSide: 'top', color: 'var(--text-secondary)' },
  // Output
  { from: 'mixer', fromSide: 'right', to: 'spk-left', toSide: 'left', color: 'var(--text-secondary)' },
  { from: 'mixer', fromSide: 'right', to: 'spk-right', toSide: 'left', color: 'var(--text-secondary)' },
]

function getPortPoint(el, side) {
  const rect = el.getBoundingClientRect()
  switch (side) {
    case 'top': return { x: rect.left + rect.width / 2, y: rect.top }
    case 'bottom': return { x: rect.left + rect.width / 2, y: rect.bottom }
    case 'left': return { x: rect.left, y: rect.top + rect.height / 2 }
    case 'right': return { x: rect.right, y: rect.top + rect.height / 2 }
    default: return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
}

function buildPath(from, to, fromSide, toSide) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const isHorizontal = fromSide === 'right' || fromSide === 'left'

  if (isHorizontal) {
    // Horizontal patch cable — droop down
    const sag = Math.max(20, Math.abs(dx) * 0.3)
    const c1x = from.x + dx * 0.3
    const c1y = from.y + sag
    const c2x = from.x + dx * 0.7
    const c2y = to.y + sag
    return `M${from.x},${from.y} C${c1x},${c1y} ${c2x},${c2y} ${to.x},${to.y}`
  } else {
    // Vertical cable — sag laterally
    const sag = Math.min(30, Math.abs(dy) * 0.15) * (dx > 0 ? 1 : -1)
    const c1x = from.x + sag
    const c1y = from.y + dy * 0.4
    const c2x = to.x + sag
    const c2y = from.y + dy * 0.6
    return `M${from.x},${from.y} C${c1x},${c1y} ${c2x},${c2y} ${to.x},${to.y}`
  }
}

export default function CableOverlay({ panelRef, visible }) {
  const [cables, setCables] = useState([])
  const [hovered, setHovered] = useState(-1)
  const svgRef = useRef(null)

  const computeCables = useCallback(() => {
    if (!panelRef?.current) return
    const panel = panelRef.current
    const panelRect = panel.getBoundingClientRect()

    const results = CABLE_DEFS.map((def) => {
      const fromEl = panel.querySelector(`[data-cable-port="${def.from}"]`)
      const toEl = panel.querySelector(`[data-cable-port="${def.to}"]`)
      if (!fromEl || !toEl) return null

      const fromPt = getPortPoint(fromEl, def.fromSide)
      const toPt = getPortPoint(toEl, def.toSide)

      // Make relative to panel
      const from = { x: fromPt.x - panelRect.left, y: fromPt.y - panelRect.top }
      const to = { x: toPt.x - panelRect.left, y: toPt.y - panelRect.top }

      const path = buildPath(from, to, def.fromSide, def.toSide)
      return { path, color: def.color }
    }).filter(Boolean)

    setCables(results)
  }, [panelRef])

  useEffect(() => {
    if (!visible) {
      setCables([])
      return
    }
    // Small delay to let devices finish rendering
    const timer = setTimeout(computeCables, 50)
    return () => clearTimeout(timer)
  }, [visible, computeCables])

  useEffect(() => {
    if (!visible) return
    const handleResize = () => computeCables()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [visible, computeCables])

  if (!visible || cables.length === 0) return null

  return (
    <svg ref={svgRef} className="cable-overlay">
      {cables.map((cable, i) => {
        const isHov = hovered === i
        return (
          <g key={i}>
            {/* Shadow */}
            <path
              d={cable.path}
              className="cable-shadow"
              style={{
                stroke: cable.color,
                animationDelay: `${i * 80}ms`,
              }}
            />
            {/* Main stroke */}
            <path
              d={cable.path}
              className={`cable ${isHov ? 'cable--hovered' : ''}`}
              style={{
                stroke: cable.color,
                animationDelay: `${i * 80}ms`,
              }}
            />
            {/* Hit area */}
            <path
              d={cable.path}
              className="cable-hitarea"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
            />
          </g>
        )
      })}
    </svg>
  )
}
