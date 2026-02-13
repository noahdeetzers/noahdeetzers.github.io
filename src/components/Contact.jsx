import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Get in Touch</h2>
        <p className="contact-heading">
          I'm always open to collaborations, music products, plugin ideas, sound
          design, and anything in between. If you'd like to build something together,
          don't hesitate to reach out.
        </p>
        <div className="contact-links">
          <a href="https://www.linkedin.com/in/noahdeetz" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://fineclassicsplugins.com" target="_blank" rel="noopener noreferrer">
            Fine Classics Plugins
          </a>
          <a href="mailto:deetznoah@gmail.com">
            Email
          </a>
        </div>
        <p className="footer-tagline">We're all capable of extraordinary creativity when we let ourselves play</p>
      </motion.div>
    </footer>
  )
}
