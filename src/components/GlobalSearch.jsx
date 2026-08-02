import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, FileText, Newspaper, CalendarDays, Users, Download, HelpCircle, Images, BookOpen, Briefcase, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { buildSearchIndex, searchIndex, filterType } from '../lib/searchIndex.js'
import { cn } from '../lib/utils.js'

const FILTERS = ['All', 'Pages', 'News & Events', 'Downloads', 'People', 'FAQ', 'Resources']

const TYPE_ICONS = {
  Page: FileText,
  News: Newspaper,
  Event: CalendarDays,
  Notice: Newspaper,
  Magazine: Newspaper,
  Staff: Users,
  Department: Users,
  Testimonial: Users,
  Clubs: Users,
  Sport: Users,
  Download: Download,
  Library: BookOpen,
  FAQ: HelpCircle,
  Gallery: Images,
  Programme: Sparkles,
  Careers: Briefcase
}

function Highlight({ text, q }) {
  if (!q) return text
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-gold-100 px-0.5 text-gold-800">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

function SearchResults({ index, query, filter, onNavigate }) {
  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchIndex(index, query, filter === 'All' ? filterType('All') : filterType(filter)).slice(0, 10)
  }, [index, query, filter])

  if (!query.trim()) return <p className="px-5 py-8 text-center text-sm text-slate-400">Start typing to search the whole site — pages, news, events, downloads, FAQs and more.</p>
  if (results.length === 0) return <p className="px-5 py-8 text-center text-sm text-slate-400">No results for “{query}”. Try a different word.</p>

  return (
    <ul className="max-h-[46vh] divide-y divide-slate-100 overflow-y-auto">
      {results.map((r) => {
        const Icon = TYPE_ICONS[r.type] || FileText
        return (
          <li key={r.id}>
            <Link to={r.url} onClick={() => onNavigate?.()} className="group flex items-start gap-3.5 px-5 py-3.5 transition hover:bg-navy-50">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy-900">
                  <Highlight text={r.title} q={query} />
                </span>
                {r.snippet && <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500"><Highlight text={r.snippet} q={query} /></span>}
              </span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{r.type}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function SearchShell({ standalone, onNavigate, initialQuery = '' }) {
  const { db } = useData()
  const index = useMemo(() => buildSearchIndex(db), [db])
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState('All')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!standalone) inputRef.current?.focus()
  }, [standalone])

  const submit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const input = (
    <form onSubmit={submit} className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <Search size={18} className="shrink-0 text-slate-400" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages, news, events, documents, FAQs…"
        className="w-full border-0 bg-transparent text-sm text-navy-900 placeholder-slate-400 outline-none"
        aria-label="Search the site"
      />
      {query && (
        <button type="button" onClick={() => setQuery('')} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900" aria-label="Clear search">
          <X size={15} />
        </button>
      )}
    </form>
  )

  const filters = (
    <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-5 py-3 no-scrollbar">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={cn(
            'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
            filter === f ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      {input}
      {filters}
      <SearchResults index={index} query={query} filter={filter} onNavigate={onNavigate} />
    </div>
  )
}

export default function GlobalSearch({ open, onClose, standalone = false, initialQuery = '' }) {
  useEffect(() => {
    if (!standalone && open) {
      const onKey = (e) => e.key === 'Escape' && onClose()
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [standalone, open, onClose])

  if (standalone) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <SearchShell standalone initialQuery={initialQuery} />
      </div>
    )
  }
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-navy-950/60 p-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <SearchShell onNavigate={onClose} />
      </div>
    </div>
  )
}
