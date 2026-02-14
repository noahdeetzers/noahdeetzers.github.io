import Nav from './Nav'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
