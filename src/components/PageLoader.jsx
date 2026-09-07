import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { cn } from '../lib/utils.js'

/**
 * High-performance top progress bar that animates across route changes.
 * Provides instantaneous visual feedback when navigating without freezing UI.
 */
export function PageProgressBar() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // On route change, start progress
    setVisible(true)
    setProgress(25)

    const timer1 = setTimeout(() => {
      setProgress(75)
    }, 80)

    const timer2 = setTimeout(() => {
      setProgress(100)
    }, 220)

    const timer3 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 420)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [location.pathname, location.search])

  if (!visible && progress === 0) return null

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] overflow-hidden bg-transparent"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page navigation progress"
    >
      <div
        className="progress-line h-full shadow-[0_0_10px_rgba(201,162,39,0.5)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: progress === 100 ? 'width 150ms ease-out, opacity 200ms ease-in' : 'width 200ms ease-out'
        }}
      />
    </div>
  )
}

/**
 * Concentric animated school ring loader with Royal Blue and Champagne Gold accents.
 */
export function BrandSpinner({ size = 'md', className }) {
  const dimensions = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[2.5px]',
    lg: 'h-16 w-16 border-3'
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Outer subtle track */}
      <div
        className={cn(
          'rounded-full border-royal/20',
          dimensions[size] || dimensions.md
        )}
      />
      {/* Spinning royal blue segment */}
      <div
        className={cn(
          'absolute animate-spin rounded-full border-transparent border-t-royal',
          dimensions[size] || dimensions.md
        )}
        style={{ animationDuration: '0.85s' }}
      />
      {/* Accent gold dot */}
      <div
        className={cn(
          'absolute animate-spin-reverse rounded-full border-transparent border-b-gold-500',
          dimensions[size] || dimensions.md
        )}
        style={{ animationDuration: '1.2s' }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full Page Loading Overlay:
 * [ SCHOOL LOGO ]
 *       ◌
 *   Loading...
 *
 * Guaranteed timeout to strictly prevent infinite loading state.
 */
export function FullPageLoader({
  message = 'Loading...',
  subtext,
  minHeight = 'min-h-[60vh]',
  fullScreen = false,
  timeoutMs = 6000,
  onTimeout
}) {
  const { db } = useData() || {}
  const info = db?.schoolInfo
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true)
      if (onTimeout) onTimeout()
    }, timeoutMs)
    return () => clearTimeout(timer)
  }, [timeoutMs, onTimeout])

  if (timedOut) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 text-center', minHeight)}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 text-royal">
          <GraduationCap size={28} />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-navy-900">Content is taking a moment to load</h3>
        <p className="mt-1 max-w-sm text-sm text-charcoal/70">
          The requested information could not be retrieved immediately. Please refresh or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-royal mt-5 px-5 py-2 text-xs"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  const displayName = info?.name || 'Highgate School'
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const content = (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      {/* School Logo */}
      <div className="mb-6 transition-transform duration-300">
        {info?.logo ? (
          <img
            src={info.logo}
            alt={displayName}
            className="h-16 w-16 rounded-xl object-contain drop-shadow-md"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/40 bg-navy-950 font-serif text-2xl font-bold text-white shadow-royal">
            <span className="text-gold-400">{initials}</span>
          </div>
        )}
      </div>

      {/* School Name */}
      <p className="font-serif text-lg font-semibold tracking-wide text-navy-900 dark:text-white">
        {displayName}
      </p>

      {/* Subtle Animated Ring ◌ */}
      <div className="my-5">
        <BrandSpinner size="md" />
      </div>

      {/* Loading message */}
      <p className="text-sm font-medium tracking-wide text-charcoal/75 dark:text-navy-200">
        {message}
      </p>

      {subtext && (
        <p className="mt-1 text-xs text-charcoal/50 dark:text-navy-400">
          {subtext}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm dark:bg-navy-950/95"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center py-16', minHeight)} role="status" aria-live="polite">
      {content}
    </div>
  )
}

/**
 * Initial Website Loader:
 * Displayed when the website is opened for the first time while application state initializes.
 * Automatically fades out smoothly and cleans up.
 */
export function InitialSiteLoader({ onFinish }) {
  const { db } = useData() || {}
  const info = db?.schoolInfo
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Only run on browser client
    const holdTimer = setTimeout(() => {
      setFading(true)
    }, 450)

    const endTimer = setTimeout(() => {
      setDone(true)
      if (onFinish) onFinish()
    }, 750)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(endTimer)
    }
  }, [onFinish])

  if (done || typeof window === 'undefined') return null

  const displayName = info?.name || 'Highgate School'
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy-950 text-white transition-opacity duration-300 ease-out',
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading Highgate School"
    >
      <div className="flex flex-col items-center justify-center px-6 text-center animate-scale-in">
        {/* Logo / Crest */}
        <div className="mb-5">
          {info?.logo ? (
            <img
              src={info.logo}
              alt={displayName}
              className="h-20 w-20 rounded-2xl object-contain drop-shadow-xl"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/40 bg-royal shadow-royal">
              <span className="font-serif text-3xl font-bold text-gold-300">{initials}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl font-semibold tracking-wide text-white sm:text-3xl">
          {displayName}
        </h1>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
          Excellence in Education
        </p>

        {/* Animated Ring ◌ */}
        <div className="mt-7">
          <div className="relative inline-flex h-10 w-10 items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-white/15" />
            <div
              className="absolute h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-gold-400"
              style={{ animationDuration: '0.9s' }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs tracking-wider text-navy-300">
          Loading...
        </p>
      </div>
    </div>
  )
}
