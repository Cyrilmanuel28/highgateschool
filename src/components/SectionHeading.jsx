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
      {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
      <h2 className={cn('font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-semibold leading-tight tracking-tight', light ? 'text-white' : 'text-navy-900')}>
        {title}
      </h2>
      <div className={cn('mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-sm', align === 'center' && 'mx-auto')} />
      {subtitle && (
        <p className={cn('mt-5 text-base sm:text-lg leading-relaxed font-normal', light ? 'text-slate-200' : 'text-charcoal/80')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
