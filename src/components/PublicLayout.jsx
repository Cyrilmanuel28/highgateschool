import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AssistantWidget from './AssistantWidget.jsx'
import ScrollToTopBtn from './ScrollToTopBtn.jsx'
import A11yPanel from './A11yPanel.jsx'
import { PageProgressBar } from './PageLoader.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { useData } from '../context/DataContext.jsx'

export default function PublicLayout() {
  const location = useLocation()
  const { db } = useData()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    const t = db.theme
    if (!t) return
    const root = document.documentElement
    if (t.primaryColor) root.style.setProperty('--color-primary', t.primaryColor)
    if (t.accentColor) root.style.setProperty('--color-accent', t.accentColor)
    if (t.backgroundColor) root.style.setProperty('--color-background', t.backgroundColor)
  }, [db.theme])

  return (
    <div className="flex min-h-screen flex-col bg-cream overflow-x-hidden">
      {/* Route-level progress bar */}
      <PageProgressBar />
      <Navbar />
      <main key={location.pathname} className="flex-1 animate-fade-in overflow-x-hidden">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <AssistantWidget />
      <ScrollToTopBtn />
      <A11yPanel />
    </div>
  )
}
