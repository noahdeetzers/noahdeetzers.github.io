import { useEffect, useRef, useState } from 'react'
import { getAnalyser } from '../audio/audioEngine'

export default function Speakers() {
  const rafRef = useRef(null)
  const [level, setLevel] = useState(0)

  useEffect(() => {
    let running = true

    function tick() {
      if (!running) return
      const analyser = getAnalyser()
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i]
        const avg = sum / data.length / 255
        setLevel(avg)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const pulse = 1 + level * 0.08
  const wobble = level * 1.5

  return (
    <div className="speakers" data-fabric-exclude>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="speaker"
          data-cable-port={i === 0 ? 'spk-left' : 'spk-right'}
          style={{
            transform: `scale(${pulse}) translateY(${i === 0 ? -wobble : wobble}px)`,
          }}
        >
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <rect x="1" y="1" width="30" height="38" rx="4" stroke="var(--divider)" strokeWidth="1.5" fill="var(--card-bg)" />
            <circle cx="16" cy="15" r="7" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="15" r="2.5" fill="var(--text-secondary)" />
            <circle cx="16" cy="31" r="4" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="31" r="1.5" fill="var(--text-secondary)" />
          </svg>
        </div>
      ))}
    </div>
  )
}
