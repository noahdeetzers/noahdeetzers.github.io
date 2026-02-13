import { motion } from 'framer-motion'

export default function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(project)}
    >
      <div className="project-card-image">
        <img src={project.image} alt={project.title} loading="lazy" />
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
    </motion.div>
  )
}
