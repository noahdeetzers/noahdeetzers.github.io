import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const springConfig = { damping: 30, stiffness: 100, mass: 2 }

export default function TiltedCard({
  children,
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)
  const scale = useSpring(1, springConfig)
  const [lastY, setLastY] = useState(0)

  function handleMouse(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
  }

  function handleMouseLeave() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: 800, ...style }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          width: '100%',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
