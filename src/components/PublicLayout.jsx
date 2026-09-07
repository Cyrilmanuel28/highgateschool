import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AssistantWidget from './AssistantWidget.jsx'
import A11yPanel from './A11yPanel.jsx'
import { PageProgressBar } from './PageLoader.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

export default function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Route-level progress bar */}
      <PageProgressBar />
      <Navbar />
      <main key={location.pathname} className="flex-1 animate-fade-in">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <AssistantWidget />
      <A11yPanel />
    </div>
  )
}
