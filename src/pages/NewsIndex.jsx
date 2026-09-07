import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Newspaper, ChevronRight, Search } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { NewsCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn } from '../lib/utils.js'

const PER_PAGE = 6

export default function NewsIndex() {
  const { publishedOnly, db } = useData()
  const info = db.schoolInfo
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const tag = searchParams.get('tag')

  const allNews = useMemo(
    () => publishedOnly('news', 'publishedAt', true),
    [publishedOnly]
  )

  const tags = useMemo(() => {
    const set = new Set()
    allNews.forEach((n) => (n.tags || []).forEach((t) => set.add(t)))
    return [...set].sort()
  }, [allNews])

  const filtered = useMemo(() => {
    let list = allNews
    if (tag) list = list.filter((n) => n.tags?.includes(tag))
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.body || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [allNews, tag, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <>
      <SeoHead
        title={info?.newsPageTitle || 'News'}
        description={info?.newsPageDescription || `Latest news and announcements from ${info?.name || 'Highgate School'} — achievements, events, and community stories.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'News' }]} />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Newsroom</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">News & Announcements</h1>
              <p className="mt-4 max-w-xl text-navy-100">
                Stories from our classrooms, pitches, and stages — and everything families need to know.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search articles…"
                className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder-navy-200 outline-none backdrop-blur transition focus:border-gold-400 focus:bg-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                searchParams.delete('tag')
                setSearchParams(searchParams)
              }}
              className={cn(
                'rounded-lg px-4 py-2 text-xs font-semibold transition',
                !tag ? 'bg-royal text-white shadow-royal' : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
              )}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setPage(1)
                  if (tag === t) searchParams.delete('tag')
                  else searchParams.set('tag', t)
                  setSearchParams(searchParams)
                }}
                className={cn(
                  'rounded-lg px-4 py-2 text-xs font-semibold transition',
                  tag === t ? 'bg-royal text-white shadow-royal' : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {paged.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No articles found"
              text="Try a different search term or category."
            />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {paged.map((n, i) => (
                <Reveal key={n.id} delay={i * 60} className="h-full">
                  <NewsCard article={n} />
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p)
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className={cn(
                    'h-10 w-10 rounded-xl text-sm font-semibold transition',
                    p === currentPage ? 'bg-gold-500 text-white shadow-gold' : 'bg-white text-navy-800 shadow-card hover:bg-navy-50'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
