import Nav from './Nav'
import Contact from './Contact'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Contact />
    </div>
  )
}
