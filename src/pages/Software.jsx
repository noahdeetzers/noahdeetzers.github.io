import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import projects from '../data/projects'

const softwareProjects = projects.filter(p => p.tags.includes('Audio Plugin') || p.tags.includes('Audio Tool'))

function SpotifyEmbed({ trackId, type = 'track' }) {
  return (
    <iframe
      key={trackId}
      src={`https://open.spotify.com/embed/${type}/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify player"
      className="spotify-embed"
    />
  )
}

export default function Software() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="page-section">
      <FadeIn>
        <h1 className="page-title">Software</h1>
        <p className="page-subtitle">Audio plugins and tools I've designed and built.</p>
      </FadeIn>

      <div className="project-grid">
        {softwareProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.1}>
            <div className="project-card" onClick={() => setSelected(project)}>
              <div className="project-card-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-card-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelected(null)}>
                &times;
              </button>
              <div className="modal-images">
                {(selected.images || [selected.image]).map((src, i) => (
                  <img key={i} src={src} alt={`${selected.title} ${i + 1}`} />
                ))}
              </div>
              <div className="modal-info">
                <h3>{selected.title}</h3>
                <p>{selected.description}</p>
                <div className="project-tags">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
