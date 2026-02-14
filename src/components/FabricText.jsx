import { useEffect, useRef, Fragment } from 'react'

const RADIUS = 150
const EASE = 0.07

export default function FabricText({
  children,
  as: Tag = 'span',
  className,
  intensity = 1,
}) {
  const lettersRef = useRef([])
  const text = typeof children === 'string' ? children : ''

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean)
    if (!letters.length) return

    const maxShift = 8 * intensity
    const maxRotate = 2 * intensity
    const states = letters.map(() => ({ x: 0, y: 0, r: 0 }))

    let mouse = { x: -9999, y: -9999 }
    let raf

    function update() {
      for (let i = 0; i < letters.length; i++) {
        const el = letters[i]
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const dx = mouse.x - cx
        const dy = mouse.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        let tx = 0
        let ty = 0
        let tr = 0

        if (dist < RADIUS) {
          const force = 1 - dist / RADIUS
          const angle = Math.atan2(dy, dx)
          tx = -Math.cos(angle) * force * maxShift
          ty = -Math.sin(angle) * force * maxShift
          tr = -(dx / RADIUS) * force * maxRotate
        }

        const s = states[i]
        s.x += (tx - s.x) * EASE
        s.y += (ty - s.y) * EASE
        s.r += (tr - s.r) * EASE

        el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.r}deg)`
      }

      raf = requestAnimationFrame(update)
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [intensity, text])

  const words = text.split(' ')
  let charIndex = 0

  return (
    <Tag className={className} data-fabric-exclude>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && ' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((char) => {
              const idx = charIndex++
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    lettersRef.current[idx] = el
                  }}
                  style={{ display: 'inline-block', willChange: 'transform' }}
                >
                  {char}
                </span>
              )
            })}
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
