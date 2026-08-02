import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DownloadCloud, Search } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { DownloadRow } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Downloads() {
  const { db } = useData()
  const info = db.schoolInfo
  const [query, setQuery] = useState('')
  const downloads = (db.downloads || [])
    .filter((d) => (d.status === undefined || d.status === 'published') && d.isVisible !== false)
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return downloads
    return downloads.filter((d) => `${d.title} ${d.description} ${d.category}`.toLowerCase().includes(q))
  }, [downloads, query])

  const categories = useMemo(() => {
    const map = new Map()
    filtered.forEach((d) => {
      if (!map.has(d.category)) map.set(d.category, [])
      map.get(d.category).push(d)
    })
    return [...map.entries()]
  }, [filtered])

  return (
    <>
      <SeoHead
        title={info?.downloadsPageTitle || 'Downloads'}
        description={info?.downloadsPageDescription || `Prospectuses, fee brochures, term dates, policies and resources to download from ${info?.name || 'Highgate School'}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: info?.downloadsBreadcrumbLabel || 'Downloads' }]} />
          <p className="eyebrow">{info?.downloadsEyebrow || 'Resources'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.downloadsHeading || 'Downloads'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.downloadsSubheading || 'Prospectuses, brochures, forms, and policies — everything in one place.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {filtered.length} document{filtered.length === 1 ? '' : 's'}
              {query.trim() && ` matching “${query.trim()}”`}
            </p>
            <label className="relative block w-full sm:w-80">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents…"
                className="input pl-11"
                aria-label="Search documents"
              />
            </label>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={DownloadCloud} title="No documents found" text={query ? 'Try a different search term.' : 'Documents will appear here soon.'} />
          ) : (
            categories.map(([cat, items], ci) => (
              <section key={cat} className={ci > 0 ? 'mt-14' : ''}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif text-3xl font-semibold text-navy-900">{cat}</h2>
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-navy-800 shadow-card">
                    {items.length} document{items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-4">
                  {items.map((d, i) => (
                    <Reveal key={d.id} delay={i * 60}>
                      <DownloadRow item={d} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">{info?.downloadsCtaTitle || "Can't find what you need?"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-100">
              {info?.downloadsCtaText || 'Our office will happily send printed copies or answer any questions.'}
            </p>
            <Link to="/contact" className="btn-gold mt-6">
              {info?.downloadsCtaButton || 'Contact the Office'}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
