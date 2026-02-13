import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'

const categories = [
  { label: 'Software', path: '/software', desc: 'Audio plugins & tools' },
  { label: 'Music', path: '/music', desc: 'Songs & productions' },
  { label: 'Art', path: '/art', desc: '3D renders & environments' },
  { label: 'Research', path: '/research', desc: 'Published papers' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="hero-photo">
            <img src="/media/bio-photo.jpg" alt="Noah Deetz" />
          </div>
          <h1 className="hero-name">Noah Deetz</h1>
          <p className="hero-subtitle">Plugin Designer · Creative Technologist · Musician</p>
        </motion.div>
      </section>

      <section className="home-about">
        <FadeIn>
          <p>
            I'm a plugin designer and creative technologist based in
            Los Angeles. I build audio plugins that sound great and feel intuitive,
            drawing from a background in music production, software design, and visual
            work across 3D art and creative tools.
          </p>
        </FadeIn>
      </section>

      <section className="home-categories">
        {categories.map((cat, i) => (
          <FadeIn key={cat.path} delay={i * 0.1}>
            <Link to={cat.path} className="category-card">
              <h3>{cat.label}</h3>
              <p>{cat.desc}</p>
              <span className="category-arrow">&rarr;</span>
            </Link>
          </FadeIn>
        ))}
      </section>
    </>
  )
}
