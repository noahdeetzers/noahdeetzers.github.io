import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="hero-name">Noah Deetz</h1>
        <p className="hero-subtitle">Plugin Designer · Audio Developer</p>
      </motion.div>
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="scroll-arrow">↓</span>
      </motion.div>
    </section>
  )
}
