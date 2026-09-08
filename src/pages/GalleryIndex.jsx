import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { AlbumCard } from '../components/Cards.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Images, Search } from 'lucide-react'

export default function GalleryIndex() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [query, setQuery] = useState('')
  const albums = useMemo(() => publishedOnly('albums', 'order'), [publishedOnly])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return albums
    return albums.filter((a) => `${a.title} ${a.description}`.toLowerCase().includes(q))
  }, [albums, query])

  return (
    <>
      <SeoHead
        title={info?.galleryPageTitle || 'Gallery'}
        description={info?.galleryPageDescription || `Photo albums from ${info?.name || 'Highgate School'} — campus life, events, sport, and the arts in pictures.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Gallery' }]} />
          <p className="eyebrow">In Pictures</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">The Gallery</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Moments from campus life — browse an album and step inside our world.
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {filtered.length} album{filtered.length === 1 ? '' : 's'}
              {query.trim() && ` matching “${query.trim()}”`}
            </p>
            <label className="relative block w-full sm:w-80">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search albums…"
                className="input pl-11"
                aria-label="Search albums"
              />
            </label>
          </div>
          {loading ? (
            <GridSkeleton count={6} cols="sm:grid-cols-2 lg:grid-cols-3" aspect="aspect-[16/10]" />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Images} title="No albums found" text={query ? 'Try a different search term.' : 'Albums will appear here as soon as they are published.'} />
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a, i) => (
                <Reveal key={a.id} delay={i * 70} className="h-full">
                  <AlbumCard album={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
