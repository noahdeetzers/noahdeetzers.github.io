import { motion } from 'framer-motion'

export default function About() {
  return (
    <section className="about" id="about">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        About
      </motion.h2>
      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p>
          I'm Noah Deetz — a plugin designer and audio developer focused on building
          tools that sound great and feel intuitive. My work spans audio plugin
          development, 3D art, and creative tool design. I care about the details:
          clean interfaces, responsive controls, and the kind of polish that makes
          software feel like an instrument.
        </p>
        <p>
          When I'm not designing plugins, I'm exploring 3D environments, experimenting
          with sound design, or finding new ways to bridge the gap between technical
          engineering and creative expression.
        </p>
      </motion.div>
    </section>
  )
}
