import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function StatCounter({ value, suffix = '', duration = 1600, className }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || typeof requestAnimationFrame === 'undefined') {
      setDisplay(Number(value) || 0)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const target = Number(value) || 0
          const t0 = performance.now()
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration)
            setDisplay(Math.round(easeOutCubic(p) * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, duration])

  const formatted = new Intl.NumberFormat('en-GB').format(display)

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  )
}
