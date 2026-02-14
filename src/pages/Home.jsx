import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import DotField from '../components/DotField'
import FabricWarp from '../components/FabricWarp'
import FabricText from '../components/FabricText'
import SynthDevice from '../components/synth/SynthDevice'
import DrumDevice from '../components/drum/DrumDevice'
import SeqDevice from '../components/sequencer/SeqDevice'
import FxDevice from '../components/fx/FxDevice'
import Speakers from '../components/Speakers'

const categories = [
  { label: 'Software', path: '/software', desc: 'Audio plugins & tools' },
  { label: 'Music', path: '/music', desc: 'Songs & productions' },
  { label: 'Art', path: '/art', desc: '3D renders & environments' },
  { label: 'Research', path: '/research', desc: 'Published papers' },
]

function handleCardMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
}

export default function Home() {
  return (
    <div className="home-studio">
      <DotField />

      <FabricWarp intensity={0.6}>
        <SynthDevice />
      </FabricWarp>

      <FabricWarp intensity={0.6}>
        <DrumDevice />
      </FabricWarp>

      <FabricWarp intensity={0.5}>
        <SeqDevice />
      </FabricWarp>

      <FabricWarp intensity={0.5}>
        <FxDevice />
      </FabricWarp>

      <FabricWarp intensity={0.4}>
        <Speakers />
      </FabricWarp>

      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <FabricWarp intensity={1.4}>
            <div className="hero-photo" data-fabric-exclude>
              <img src="/media/bio-photo.jpg" alt="Noah Deetz" />
            </div>
          </FabricWarp>
          <FabricText as="h1" className="hero-name" intensity={1.2}>
            Noah Deetz
          </FabricText>
          <FabricText as="p" className="hero-subtitle" intensity={0.8}>
            Plugin Designer · Creative Technologist · Musician
          </FabricText>
        </motion.div>
      </section>

      <section className="home-about">
        <FadeIn>
          <FabricText as="p" className="home-about-text" intensity={0.7}>
            I'm a plugin designer and creative technologist based in Los Angeles. I build audio plugins that sound great and feel intuitive, drawing from a background in music production, software design, and visual work across 3D art and creative tools.
          </FabricText>
        </FadeIn>
      </section>

      <section className="home-categories">
        {categories.map((cat, i) => (
          <FadeIn key={cat.path} delay={i * 0.1}>
            <FabricWarp intensity={1}>
              <Link
                to={cat.path}
                className="category-card"
                data-fabric-exclude
                data-beam-block
                onMouseMove={handleCardMove}
              >
                <h3>{cat.label}</h3>
                <p>{cat.desc}</p>
                <span className="category-arrow">&rarr;</span>
              </Link>
            </FabricWarp>
          </FadeIn>
        ))}
      </section>
    </div>
  )
}
