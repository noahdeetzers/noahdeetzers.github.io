import Nav from './components/Nav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Music from './components/Music'
import About from './components/About'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="app">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Music />
      <Contact />
    </div>
  )
}
