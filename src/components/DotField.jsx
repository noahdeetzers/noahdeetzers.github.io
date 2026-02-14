import { useEffect, useRef } from 'react'

const DOT_SPACING = 32
const DOT_BASE_RADIUS = 1.5
const MOUSE_RADIUS = 120
const MAX_DISPLACEMENT = 14
const EASE = 0.08
const BEAM_RADIUS = 220

function getDotColor() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--dot-color')
    .trim()
  const parts = raw.split(',').map(Number)
  return parts.length === 3 ? parts : [180, 180, 180]
}

function getBeamColor() {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(0, 0, 0, 0.03)'
}

export default function DotField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let mouse = { x: -9999, y: -9999 }
    let smoothMouse = { x: -9999, y: -9999 }
    let dots = []
    let raf
    let dotColor = getDotColor()
    let beamColor = getBeamColor()

    const observer = new MutationObserver(() => {
      dotColor = getDotColor()
      beamColor = getBeamColor()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid()
    }

    function buildGrid() {
      dots = []
      const cols = Math.ceil(window.innerWidth / DOT_SPACING) + 1
      const rows = Math.ceil(window.innerHeight / DOT_SPACING) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            ox: c * DOT_SPACING,
            oy: r * DOT_SPACING,
            x: c * DOT_SPACING,
            y: r * DOT_SPACING,
          })
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Ease the beam position for a smooth trailing feel
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12

      // Draw beam glow
      if (mouse.x > -9000) {
        const grad = ctx.createRadialGradient(
          smoothMouse.x, smoothMouse.y, 0,
          smoothMouse.x, smoothMouse.y, BEAM_RADIUS,
        )
        grad.addColorStop(0, beamColor)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(
          smoothMouse.x - BEAM_RADIUS,
          smoothMouse.y - BEAM_RADIUS,
          BEAM_RADIUS * 2,
          BEAM_RADIUS * 2,
        )
      }

      for (const dot of dots) {
        const dx = mouse.x - dot.ox
        const dy = mouse.y - dot.oy
        const dist = Math.sqrt(dx * dx + dy * dy)

        let tx = dot.ox
        let ty = dot.oy

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * MAX_DISPLACEMENT
          const angle = Math.atan2(dy, dx)
          tx = dot.ox - Math.cos(angle) * force
          ty = dot.oy - Math.sin(angle) * force
        }

        dot.x += (tx - dot.x) * EASE
        dot.y += (ty - dot.y) * EASE

        const offsetDist = Math.sqrt(
          (dot.x - dot.ox) ** 2 + (dot.y - dot.oy) ** 2,
        )
        const alpha = 0.3 + Math.min(offsetDist / MAX_DISPLACEMENT, 1) * 0.45

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, DOT_BASE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="dot-field" />
}
