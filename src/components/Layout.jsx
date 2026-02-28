import { useState } from 'react'
import Nav from './Nav'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [studioOpen, setStudioOpen] = useState(false)

  return (
    <div className="app">
      <Nav studioOpen={studioOpen} setStudioOpen={setStudioOpen} />
      <main>
        <Outlet context={{ studioOpen, setStudioOpen }} />
      </main>
    </div>
  )
}
