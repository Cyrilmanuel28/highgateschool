import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-20 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg transition-all duration-300 hover:bg-gold-600 hover:text-navy-950 sm:right-6',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      )}
    >
      <ArrowUp size={20} />
    </button>
  )
}
