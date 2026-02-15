import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import projects from '../data/projects'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <section className="page-section">
        <p>Project not found.</p>
        <Link to="/software" className="back-link">&larr; Back to Software</Link>
      </section>
    )
  }

  const allImages = project.images || [project.image]

  return (
    <section className="page-section">
      <FadeIn>
        <Link to="/software" className="back-link">&larr; Software</Link>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="project-detail-hero">
          <img src={project.image} alt={project.title} />
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="project-detail-body">
          <h1 className="project-detail-title">{project.title}</h1>
          <div className="project-tags">
            {project.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <p className="project-detail-desc">{project.description}</p>
        </div>
      </FadeIn>

      {allImages.length > 1 && (
        <FadeIn delay={0.3}>
          <div className="project-detail-gallery">
            {allImages.slice(1).map((src, i) => (
              <img key={i} src={src} alt={`${project.title} ${i + 2}`} />
            ))}
          </div>
        </FadeIn>
      )}
    </section>
  )
}
