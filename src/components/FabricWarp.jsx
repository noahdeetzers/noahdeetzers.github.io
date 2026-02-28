import { useEffect, useRef } from 'react'

const RADIUS = 250
const EASE = 0.07

export default function FabricWarp({ children, intensity = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const maxShift = 6 * intensity
    const maxRotate = 0.8 * intensity
    const maxSkew = 0.4 * intensity

    let mouse = { x: -9999, y: -9999 }
    let current = { x: 0, y: 0, rotate: 0, skewX: 0 }
    let raf

    function update() {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx = mouse.x - cx
      const dy = mouse.y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      let tx = 0
      let ty = 0
      let tr = 0
      let ts = 0

      if (dist < RADIUS) {
        const force = 1 - dist / RADIUS
        const angle = Math.atan2(dy, dx)
        tx = -Math.cos(angle) * force * maxShift
        ty = -Math.sin(angle) * force * maxRotate
        tr = -(dx / RADIUS) * force * maxRotate
        ts = (dx / RADIUS) * force * maxSkew
      }

      current.x += (tx - current.x) * EASE
      current.y += (ty - current.y) * EASE
      current.rotate += (tr - current.rotate) * EASE
      current.skewX += (ts - current.skewX) * EASE

      el.style.transform =
        `translate(${current.x}px, ${current.y}px) ` +
        `rotate(${current.rotate}deg) ` +
        `skewX(${current.skewX}deg)`

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
      el.style.transform = ''
    }
  }, [intensity])

  return <div ref={ref} style={{ willChange: 'transform' }}>{children}</div>
}
