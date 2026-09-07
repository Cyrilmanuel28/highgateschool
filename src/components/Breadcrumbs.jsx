import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function Breadcrumbs({ items, light = true }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
        <li>
          <Link to="/" className={cn('transition', light ? 'text-navy-200/80 hover:text-gold-300' : 'text-charcoal/60 hover:text-royal')}>
            Home
          </Link>
        </li>
        {items?.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className={light ? 'text-white/40' : 'text-slate-300'} />
            {item.to ? (
              <Link to={item.to} className={cn('transition', light ? 'text-navy-200/80 hover:text-gold-300' : 'text-charcoal/60 hover:text-royal')}>
                {item.label}
              </Link>
            ) : (
              <span className={cn('font-semibold', light ? 'text-white' : 'text-navy-900')}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
