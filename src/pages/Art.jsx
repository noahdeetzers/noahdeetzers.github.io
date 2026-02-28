import FadeIn from '../components/FadeIn'
import projects from '../data/projects'

const artProjects = projects.filter(p => p.tags.includes('3D Art'))

export default function Art() {
  return (
    <section className="page-section">
      <FadeIn>
        <h1 className="page-title">Art</h1>
        <p className="page-subtitle">3D renders, environments, and explorations in light and space.</p>
      </FadeIn>

      <div className="art-gallery">
        {artProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.15}>
            <div className="art-card">
              <img src={project.image} alt={project.title} />
              <div className="art-card-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
