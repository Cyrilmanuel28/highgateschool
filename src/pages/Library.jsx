import { useMemo, useState } from 'react'
import { BookOpen, Search, Download, Star, Headphones, Clapperboard, FileText, Newspaper, FolderOpen } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn, formatDate, truncate } from '../lib/utils.js'

const TYPE_META = {
  eBook: { icon: BookOpen, cls: 'bg-sky-100 text-sky-700' },
  'Past Paper': { icon: FileText, cls: 'bg-red-100 text-red-700' },
  Notes: { icon: FileText, cls: 'bg-amber-100 text-amber-700' },
  Magazine: { icon: Newspaper, cls: 'bg-gold-100 text-gold-700' },
  Audio: { icon: Headphones, cls: 'bg-violet-100 text-violet-700' },
  Video: { icon: Clapperboard, cls: 'bg-emerald-100 text-emerald-700' }
}

export default function Library() {
  const { db, incrementCount } = useData()
  const info = db.schoolInfo
  const [category, setCategory] = useState('All')
  const [type, setType] = useState('All')
  const [query, setQuery] = useState('')

  const items = useMemo(
    () =>
      (db.library || [])
        .filter((l) => l.status !== 'archived')
        .sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0) || new Date(b.publishedAt) - new Date(a.publishedAt)),
    [db.library]
  )

  const categories = useMemo(() => ['All', ...new Set(items.map((i) => i.category).filter(Boolean))], [items])
  const types = useMemo(() => ['All', ...new Set(items.map((i) => i.type).filter(Boolean))], [items])

  const filtered = useMemo(() => {
    let rows = items
    if (category !== 'All') rows = rows.filter((i) => i.category === category)
    if (type !== 'All') rows = rows.filter((i) => i.type === type)
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter((i) => `${i.title} ${i.author} ${i.description}`.toLowerCase().includes(q))
    }
    return rows
  }, [items, category, type, query])

  const download = (item) => {
    if (!item.fileUrl) return
    incrementCount('library', item.id, 'downloadCount')
  }

  return (
    <>
      <SeoHead
        title={info?.libraryPageTitle || 'Digital Library'}
        description={info?.libraryPageDescription || `E-books, past papers, study notes, magazines, and audio/video lessons from the ${info?.shortName || 'Highgate'} Digital Library.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Digital Library' }]} />
          <p className="eyebrow">{info?.libraryEyebrow || 'Learn & Explore'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.libraryHeading || 'Digital Library'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.librarySubheading || 'E-books, past papers, study notes, magazines, and audio/video lessons — free for our community.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
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
            <div className="relative w-full lg:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the library…"
                className="input pl-10"
                aria-label="Search the library"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition',
                  type === t ? 'bg-gold-500 text-navy-900' : 'bg-white text-slate-500 shadow-card hover:text-navy-900'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState icon={BookOpen} title="Nothing in the library yet" text="Try a different category, type, or search term." />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => {
                const meta = TYPE_META[item.type] || TYPE_META.eBook
                const Icon = meta.icon
                return (
                  <Reveal key={item.id} delay={(i % 3) * 60}>
                    <div className="card-hover group flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Img src={item.coverImage} alt={item.title} className="transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                        <span className={cn('absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide', meta.cls)}>
                          <Icon size={11} /> {item.type}
                        </span>
                        {item.featured && (
                          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900">
                            <Star size={10} className="fill-navy-900" /> Featured
                          </span>
                        )}
                        <span className="absolute bottom-3 left-4 text-xs font-semibold text-navy-100">{item.category}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-serif text-lg font-semibold leading-snug text-navy-900">{item.title}</h3>
                        <p className="mt-1 text-xs font-medium text-gold-600">{item.author}</p>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{truncate(item.description, 110)}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs text-slate-400">
                            {formatDate(item.publishedAt)} · {item.downloadCount || 0} downloads
                          </span>
                          {item.fileUrl ? (
                            <a
                              href={item.fileUrl}
                              onClick={() => download(item)}
                              target={item.fileUrl.startsWith('data:') || item.fileUrl.startsWith('/') ? '_self' : '_blank'}
                              rel="noreferrer"
                              className="flex items-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-800"
                            >
                              <Download size={13} /> Open
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-500">
                              <FolderOpen size={13} /> At the school library
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
