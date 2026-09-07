import { useState } from 'react'
import { cn } from '../lib/utils.js'

// Highgate School branded SVG fallback with Deep Navy & Royal Blue gradient + Champagne Gold monogram
const BRAND_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B1F3A"/>
          <stop offset="60%" stop-color="#102F5A"/>
          <stop offset="100%" stop-color="#174A8B"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="400" cy="220" r="70" fill="none" stroke="#C9A227" stroke-width="2" stroke-opacity="0.4"/>
      <path d="M365 250 L365 190 M435 250 L435 190 M365 220 L435 220" stroke="#C9A227" stroke-width="6" stroke-linecap="round"/>
      <text x="400" y="340" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">HIGHGATE SCHOOL</text>
      <text x="400" y="370" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#C9A227" text-anchor="middle" letter-spacing="4">EXCELLENCE IN EDUCATION</text>
    </svg>`
  )

export default function Img({
  src,
  alt = '',
  className,
  imgClassName,
  fallbackSrc,
  eager = false,
  lazy = true,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const effectiveSrc = errored ? (fallbackSrc || BRAND_FALLBACK) : (src || BRAND_FALLBACK)

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-navy-950/10', className)}>
      {/* Subtle skeleton placeholder visible until image loads */}
      {!loaded && !errored && (
        <div className="skeleton-shimmer absolute inset-0 h-full w-full" aria-hidden="true" />
      )}

      {/* Image with smooth fade-in */}
      <img
        src={effectiveSrc}
        alt={alt}
        loading={lazy && !eager ? 'lazy' : 'eager'}
        decoding={lazy && !eager ? 'async' : 'sync'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErrored(true)
          setLoaded(true)
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName
        )}
        {...rest}
      />
    </div>
  )
}
