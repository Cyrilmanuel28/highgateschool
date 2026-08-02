import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AssistantWidget from './AssistantWidget.jsx'
import A11yPanel from './A11yPanel.jsx'

export default function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main key={location.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
      <A11yPanel />
    </div>
  )
}
