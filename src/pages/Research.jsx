import FadeIn from '../components/FadeIn'

const papers = [
  {
    title: 'Algorithmic Methods for Calibrating Material Absorption Within Geometric Acoustic Modeling',
    authors: 'Noah Deetz, Braxton Boren',
    venue: 'AES Convention 153, 2022',
    url: 'https://scholar.google.com/scholar?q=Algorithmic+Methods+for+Calibrating+Material+Absorption+Within+Geometric+Acoustic+Modeling',
  },
  {
    title: 'Improving auto-calibration of GA-based simulations through a statistical absorption database',
    authors: 'Noah Deetz, Braxton Boren',
    venue: 'Forum Acusticum, 2023',
    url: 'https://scholar.google.com/scholar?q=Improving+auto-calibration+of+GA-based+simulations+through+a+statistical+absorption+database',
  },
]

export default function Research() {
  return (
    <section className="page-section">
      <FadeIn>
        <h1 className="page-title">Research</h1>
        <p className="page-subtitle">Published work in acoustics and audio simulation.</p>
      </FadeIn>

      <div className="research-list">
        {papers.map((paper, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="research-card"
            >
              <h3>{paper.title}</h3>
              <p className="research-authors">{paper.authors}</p>
              <p className="research-venue">{paper.venue}</p>
              <span className="research-link">View on Google Scholar &rarr;</span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
