import { useEffect, useRef, useState } from 'react'

const FRAME_PATH = '/media/frames'
const TOTAL_FRAMES = 120
const SCROLL_RANGE = 3000

export default function ScrollVideo() {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const progressRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let cancelled = false

    async function loadFrames() {
      const loads = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        const img = new Image()
        img.src = `${FRAME_PATH}/${i}.webp`
        return img.decode().then(() => img)
      })

      const images = await Promise.all(loads)
      if (cancelled) return

      // Size canvas to match frames
      canvas.width = images[0].naturalWidth
      canvas.height = images[0].naturalHeight

      // Convert to ImageBitmaps for faster drawImage
      const bitmaps = await Promise.all(images.map((img) => createImageBitmap(img)))
      if (cancelled) return

      framesRef.current = bitmaps
      ctx.drawImage(bitmaps[0], 0, 0)
      setReady(true)
    }

    loadFrames()

    return () => {
      cancelled = true
      framesRef.current.forEach((b) => b.close())
      framesRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const frames = framesRef.current

    document.body.style.overflow = 'hidden'

    function onWheel(e) {
      e.preventDefault()
      let p = progressRef.current + e.deltaY / SCROLL_RANGE
      p = ((p % 1) + 1) % 1
      progressRef.current = p
      const idx = Math.round(p * (frames.length - 1))
      ctx.drawImage(frames[idx], 0, 0)
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      document.body.style.overflow = ''
    }
  }, [ready])

  return (
    <canvas
      ref={canvasRef}
      className="scroll-video"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s' }}
    />
  )
}
