import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <li>
          <Link to="/" className="transition hover:text-gold-600">
            Home
          </Link>
        </li>
        {items?.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-slate-300" />
            {item.to ? (
              <Link to={item.to} className="transition hover:text-gold-600">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-navy-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
