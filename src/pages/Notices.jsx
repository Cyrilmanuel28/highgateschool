import { useMemo, useState } from 'react'
import { Megaphone, Pin, Search, Archive, ChevronDown } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { formatDate, cn } from '../lib/utils.js'

const CATEGORIES = ['All', 'General', 'Admissions', 'Examinations', 'PTA', 'Emergency']
const PRIORITY_TONE = {
  normal: 'bg-sky-100 text-sky-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700'
}
const PRIORITY_DOT = { normal: 'bg-sky-500', high: 'bg-amber-500', urgent: 'bg-red-500' }

export default function Notices() {
  const { db, loading } = useData()
  const info = db.schoolInfo
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [showArchive, setShowArchive] = useState(false)
  const now = Date.now()

  const all = useMemo(
    () =>
      (db.notices || [])
        .filter((n) => (n.status === undefined || n.status === 'published' || n.status === 'scheduled' || n.status === 'unpublished') && n.isVisible !== false && n.status !== 'archived')
        .map((n) => ({ ...n, active: !n.expireDate || new Date(n.expireDate).getTime() > now })),
    [db.notices, now]
  )

  const active = all.filter((n) => n.active)
  const archived = all.filter((n) => !n.active)

  const filtered = useMemo(() => {
    let rows = active
    if (category !== 'All') rows = rows.filter((n) => n.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter((n) => `${n.title} ${n.body} ${n.category}`.toLowerCase().includes(q))
    }
    return rows.sort((a, b) => Number(b.pinned || 0) - Number(a.pinned || 0) || new Date(b.publishDate) - new Date(a.publishDate))
  }, [active, category, query])

  return (
    <>
      <SeoHead
        title={info?.noticesPageTitle || 'Notice Board'}
        description={info?.noticesPageDescription || `Live notices, announcements, and updates from ${info?.name || 'Highgate School'}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Notice Board' }]} />
          <p className="eyebrow">Live Updates</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">Notice Board</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Announcements, holidays, examinations, and community updates — refreshed the moment they are published.
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold transition',
                    category === c ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 shadow-card hover:text-navy-900'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notices…"
                className="input pl-10"
                aria-label="Search notices"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState icon={Megaphone} title="No notices found" text="Try a different filter or search term." />
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {filtered.map((n, i) => (
                <Reveal key={n.id} delay={i * 50}>
                  <div
                    className={cn(
                      'card-hover relative flex gap-5 border-l-4 p-6',
                      n.pinned ? 'border-gold-500' : 'border-transparent'
                    )}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                      {n.pinned ? <Pin size={20} /> : <Megaphone size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-700">
                          {n.category}
                        </span>
                        <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', PRIORITY_TONE[n.priority] || PRIORITY_TONE.normal)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_DOT[n.priority] || PRIORITY_DOT.normal)} />
                          {n.priority || 'normal'}
                        </span>
                        {n.pinned && <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-700">Pinned</span>}
                        <span className="ml-auto text-xs text-slate-400">
                          {formatDate(n.publishDate)}
                          {n.expireDate && <span className="hidden sm:inline"> · until {formatDate(n.expireDate)}</span>}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif text-xl font-semibold text-navy-900">{n.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{n.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {archived.length > 0 && (
            <div className="mt-12">
              <button
                onClick={() => setShowArchive((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 text-left transition hover:border-navy-900"
              >
                <span className="flex items-center gap-2.5 font-serif text-lg font-semibold text-navy-900">
                  <Archive size={18} className="text-gold-600" /> Archive ({archived.length} expired)
                </span>
                <ChevronDown size={18} className={cn('text-slate-400 transition-transform', showArchive && 'rotate-180')} />
              </button>
              {showArchive && (
                <div className="mt-3 space-y-3">
                  {archived.map((n) => (
                    <div key={n.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white/60 p-5 opacity-70">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif text-base font-semibold text-navy-900">{n.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{n.body}</p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">Expired {formatDate(n.expireDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
