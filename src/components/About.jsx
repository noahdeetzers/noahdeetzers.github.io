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
      <div className="about-inner">
        <motion.div
          className="about-photo"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img src="/media/bio-photo.jpg" alt="Noah Deetz" />
        </motion.div>
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p>
            I'm Noah Deetz — a plugin designer and creative technologist based in
            Los Angeles. I build audio plugins that sound great and feel intuitive,
            drawing from a background in music production, software design, and visual
            work across 3D art and creative tools. I got my start recording local bands
            in high school and later found my way into programming and product
            development in college.
          </p>
          <p>
            Today, I'm still making music alongside my plugin work, and I contribute
            to both open- and closed-source projects. When I'm not designing plugins,
            I'm exploring 3D environments, experimenting with sound design, and looking
            for new ways to connect technical engineering with creative expression.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
