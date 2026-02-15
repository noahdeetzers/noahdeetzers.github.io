import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Software from './pages/Software'
import ProjectDetail from './pages/ProjectDetail'
import MusicPage from './pages/Music'
import Art from './pages/Art'
import Research from './pages/Research'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/software" element={<Software />} />
        <Route path="/software/:id" element={<ProjectDetail />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/art" element={<Art />} />
        <Route path="/research" element={<Research />} />
      </Route>
    </Routes>
  )
}
