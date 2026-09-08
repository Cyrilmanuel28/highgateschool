import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Search, FileText, Newspaper, CalendarDays, Users, Download, HelpCircle, Images, BookOpen, Briefcase, Sparkles, Megaphone } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { buildSearchIndex, searchIndex, filterType, SEARCH_TYPES } from '../lib/searchIndex.js'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import GlobalSearch from '../components/GlobalSearch.jsx'
import { cn } from '../lib/utils.js'

const FILTERS = ['All', 'Pages', 'News & Events', 'Downloads', 'People', 'FAQ', 'Resources']

const TYPE_ICONS = {
  Page: FileText,
  News: Newspaper,
  Event: CalendarDays,
  Notice: Megaphone,
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

export default function SearchResults() {
  const { db } = useData()
  const info = db.schoolInfo
  const [params] = useSearchParams()
  const query = (params.get('q') || '').trim()
  const [filter, setFilter] = useState('All')

  const index = useMemo(() => buildSearchIndex(db), [db])
  const results = useMemo(() => {
    if (!query) return []
    return searchIndex(index, query, filter === 'All' ? filterType('All') : filterType(filter))
  }, [index, query, filter])

  return (
    <>
      <SeoHead title={query ? `Search: ${query}` : 'Search'} description={info?.searchPageDescription || `Search ${info?.name || 'Highgate School'} — pages, news, events, downloads, FAQs and more.`} />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Search' }]} />
          <p className="eyebrow">Find Anything</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">Search Results</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {query ? `Results for “${query}” — ${results.length} found.` : 'Type a query to search the whole site.'}
          </p>
          <div className="mt-8 max-w-2xl">
            <GlobalSearch standalone initialQuery={query} />
          </div>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold transition',
                  filter === f ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 shadow-card hover:text-navy-900'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {query && results.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {results.map((r, i) => {
                const Icon = TYPE_ICONS[r.type] || FileText
                return (
                  <Reveal key={r.id} delay={(i % 4) * 40}>
                    <Link to={r.url} className="card-hover group flex items-start gap-4 p-5">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                        <Icon size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-serif text-lg font-semibold text-navy-900 group-hover:text-gold-700">
                            <Highlight text={r.title} q={query} />
                          </span>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{r.type}</span>
                        </span>
                        {r.snippet && <span className="mt-1 line-clamp-2 block text-sm text-slate-500"><Highlight text={r.snippet} q={query} /></span>}
                        {r.sub && <span className="mt-1 block text-xs text-slate-400">{r.sub}</span>}
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          ) : query ? (
            <div className="mt-10 flex flex-col items-center text-center">
              <Search size={36} className="text-slate-300" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-navy-900">No results for “{query}”</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Try a different keyword, or browse a category above.</p>
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center text-center">
              <Search size={36} className="text-slate-300" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-navy-900">Start a search above</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Search across {SEARCH_TYPES.length} content types including pages, news, staff, and downloads.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
