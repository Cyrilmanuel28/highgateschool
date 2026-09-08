import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'
import SeoHead from '../components/SeoHead.jsx'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-navy-950 py-20 sm:py-32">
      <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-navy-400/20 blur-3xl" />
      <div className="container-x relative text-center">
        <SeoHead title="Page Not Found" description="The page you were looking for could not be found." />
        <p className="font-serif text-[5rem] sm:text-[9rem] lg:text-[12rem] font-bold leading-none text-gold-500/90">404</p>
        <div className="mx-auto -mt-6 sm:-mt-8 lg:-mt-12 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-gold-400 shadow-gold">
          <Compass size={30} />
        </div>
        <h1 className="mt-6 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">This Path Leads Nowhere… Yet</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-100">
          The page you're looking for may have moved, been renamed, or never existed. Let's get you back on track.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="btn-royal">
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/contact" className="btn-outline-light">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
