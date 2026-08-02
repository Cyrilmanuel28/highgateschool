import { useState } from 'react'
import { cn } from '../lib/utils.js'

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2A4A"/><stop offset="1" stop-color="#2A3D68"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="340" font-family="Georgia, serif" font-size="140" fill="#C8982A" text-anchor="middle" opacity="0.9">A</text></svg>`
  )

export default function Img({ src, alt = '', className, imgClassName, fallbackSrc, eager = false, lazy = false, ...rest }) {
  const [errored, setErrored] = useState(false)
  return (
    <img
      src={errored ? fallbackSrc || FALLBACK : src || FALLBACK}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      decoding={lazy ? 'async' : 'sync'}
      onError={() => setErrored(true)}
      className={cn('h-full w-full object-cover', imgClassName)}
      {...rest}
    />
  )
}
