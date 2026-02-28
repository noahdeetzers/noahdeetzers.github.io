import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import DotField from '../components/DotField'
import FabricWarp from '../components/FabricWarp'
import FabricText from '../components/FabricText'
import StudioPanel from '../components/StudioPanel'

// Stagger children in the hero
const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.1 },
  },
}

const heroPhoto = {
  hidden: { opacity: 0, scale: 0.6, filter: 'blur(18px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const heroName = {
  hidden: { opacity: 0, y: 35, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

const heroSub = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function Home() {
  const { studioOpen } = useOutletContext()

  return (
    <div className="home-studio">
      <DotField />

      <StudioPanel open={studioOpen} />

      <div className={`home-content ${studioOpen ? 'home-content--shifted' : ''}`}>
        <section className="hero">
          <motion.div
            className="hero-content"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={heroPhoto}>
              <FabricWarp intensity={1.4}>
                <div className="hero-photo" data-fabric-exclude>
                  <img src="/media/bio-photo.jpg" alt="Noah Deetz" />
                </div>
              </FabricWarp>
            </motion.div>
            <motion.div variants={heroName}>
              <FabricText as="h1" className="hero-name" intensity={1.2}>
                Noah Deetz
              </FabricText>
            </motion.div>
            <motion.div variants={heroSub}>
              <FabricText as="p" className="hero-subtitle" intensity={0.8}>
                Plugin Designer · Creative Technologist · Musician
              </FabricText>
            </motion.div>
          </motion.div>
        </section>

        <section className="home-about">
          <FadeIn>
            <FabricText as="p" className="home-about-text" intensity={0.7}>
              I'm a plugin designer and creative technologist based in Los Angeles. I build audio plugins that sound great and feel intuitive, drawing from a background in music production, software design, and visual work across 3D art and creative tools.
            </FabricText>
          </FadeIn>
        </section>

      </div>
    </div>
  )
}
