import { useEffect, useRef } from 'react'

const DOT_SPACING = 32
const DOT_BASE_RADIUS = 1.5
const MOUSE_RADIUS = 120
const MAX_DISPLACEMENT = 14
const EASE = 0.08
const BEAM_RADIUS = 220
const EXCLUDE_PAD = 12

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

function getExcludeRects() {
  const els = document.querySelectorAll('[data-fabric-exclude]')
  const rects = []
  for (const el of els) {
    const r = el.getBoundingClientRect()
    rects.push({
      left: r.left - EXCLUDE_PAD,
      top: r.top - EXCLUDE_PAD,
      right: r.right + EXCLUDE_PAD,
      bottom: r.bottom + EXCLUDE_PAD,
    })
  }
  return rects
}

function getBeamBlockRects() {
  const els = document.querySelectorAll('[data-beam-block]')
  const rects = []
  for (const el of els) {
    const r = el.getBoundingClientRect()
    rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })
  }
  return rects
}

function inExcludeZone(x, y, rects) {
  for (const r of rects) {
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      return true
    }
  }
  return false
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
    let excludeRects = []
    let beamBlockRects = []
    let beamOpacity = 1
    let frameCount = 0

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
      excludeRects = getExcludeRects()
      beamBlockRects = getBeamBlockRects()
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
            alpha: 0,
          })
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Refresh rects every 10 frames (elements may animate in)
      if (frameCount % 10 === 0) {
        excludeRects = getExcludeRects()
        beamBlockRects = getBeamBlockRects()
      }
      frameCount++

      // Fade beam when mouse is over a card
      const overCard = inExcludeZone(mouse.x, mouse.y, beamBlockRects)
      const targetBeamOpacity = overCard ? 0 : 1
      beamOpacity += (targetBeamOpacity - beamOpacity) * 0.12

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12

      if (mouse.x > -9000 && beamOpacity > 0.01) {
        ctx.globalAlpha = beamOpacity
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
        ctx.globalAlpha = 1
      }

      for (const dot of dots) {
        const excluded = inExcludeZone(dot.ox, dot.oy, excludeRects)
        const targetAlpha = excluded ? 0 : 1
        dot.alpha += (targetAlpha - dot.alpha) * 0.06

        if (dot.alpha < 0.01) continue

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
        const baseAlpha = 0.3 + Math.min(offsetDist / MAX_DISPLACEMENT, 1) * 0.45
        const alpha = baseAlpha * dot.alpha

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
