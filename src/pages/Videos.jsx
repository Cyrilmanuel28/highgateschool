import { useEffect, useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { VideoCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { Clapperboard, Search } from 'lucide-react'

export default function Videos() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)

  const videos = useMemo(() => publishedOnly('videos', 'publishedAt', true), [publishedOnly])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return videos
    return videos.filter((v) => `${v.title} ${v.description}`.toLowerCase().includes(q))
  }, [videos, query])

  const active = filtered.find((v) => v.id === activeId) || filtered[0] || null

  useEffect(() => {
    if (activeId && !filtered.find((v) => v.id === activeId)) setActiveId(null)
  }, [filtered, activeId])

  return (
    <>
      <SeoHead
        title={info?.videosPageTitle || 'Videos'}
        description={info?.videosPageDescription || `Watch films from ${info?.name || 'Highgate School'} — campus tours, concerts, and event highlights.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Videos' }]} />
          <p className="eyebrow">{info?.videosEyebrow || 'On Screen'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.videosHeading || 'Videos'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">Films from campus — tours, performances, and the life of the school.</p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {filtered.length} film{filtered.length === 1 ? '' : 's'}
              {query.trim() && ` matching “${query.trim()}”`}
            </p>
            <label className="relative block w-full sm:w-80">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search videos…"
                className="input pl-11"
                aria-label="Search videos"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Clapperboard} title="No videos found" text={query ? 'Try a different search term.' : 'New films are published here throughout the year.'} />
          ) : (
            <>
              {active && (
                <Reveal>
                  <div className="card overflow-hidden">
                    <div className="aspect-video w-full bg-navy-950">
                      <iframe
                        src={active.embedUrl}
                        title={active.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex flex-wrap items-start justify-between gap-3 p-6">
                      <div>
                        <h2 className="font-serif text-2xl font-semibold text-navy-900">{active.title}</h2>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">{active.description}</p>
                      </div>
                      <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700">
                        Now playing
                      </span>
                    </div>
                  </div>
                </Reveal>
              )}

              <div className="mt-10 grid gap-7 md:grid-cols-2">
                {filtered.map((v, i) => (
                  <Reveal key={v.id} delay={i * 70} className="h-full">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveId(v.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveId(v.id)}
                      className={`cursor-pointer rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-cream ${active && active.id === v.id ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-cream' : 'hover:opacity-90'}`}
                    >
                      <VideoCard video={v} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
