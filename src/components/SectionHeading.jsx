import Reveal from './Reveal.jsx'
import { cn } from '../lib/utils.js'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false, className }) {
  return (
    <Reveal
      className={cn(
        'mb-12 max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={cn('font-serif text-4xl font-semibold leading-tight sm:text-[2.6rem]', light ? 'text-white' : 'text-navy-900')}>
        {title}
      </h2>
      <div className={cn('mt-4 h-1 w-16 rounded-full bg-gold-500', align === 'center' && 'mx-auto')} />
      {subtitle && (
        <p className={cn('mt-5 text-lg leading-relaxed', light ? 'text-navy-100' : 'text-slate-600')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
