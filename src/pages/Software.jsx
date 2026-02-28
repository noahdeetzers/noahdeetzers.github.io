import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import projects from '../data/projects'

const softwareProjects = projects.filter(p => p.tags.includes('Audio Plugin') || p.tags.includes('Audio Tool'))

export default function Software() {
  return (
    <section className="page-section">
      <FadeIn>
        <h1 className="page-title">Software</h1>
        <p className="page-subtitle">Audio plugins and tools I've designed and built.</p>
      </FadeIn>

      <div className="project-grid">
        {softwareProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.1}>
            <Link to={`/software/${project.id}`} className="project-card">
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
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
