import { useMemo, useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Img from '../components/Img.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import EmptyState from '../components/EmptyState.jsx'
import NotFound from './NotFound.jsx'

export default function GalleryAlbumPage() {
  const { album } = useParams()
  const [searchParams] = useSearchParams()
  const { getBySlug, getRecord, db } = useData()
  const record = useMemo(() => getBySlug('albums', album) || getRecord('albums', album), [getBySlug, getRecord, album, db.albums])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!record || lightbox === null) return
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === 0 ? record.photos.length - 1 : i - 1))
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % record.photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, record])

  if (!record || (!searchParams.get('preview') && record.status !== 'published')) return <NotFound />

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <SeoHead
        title={record.title}
        description={record.description}
        ogImage={record.coverImage}
        canonical={origin ? `${origin}/gallery/${record.slug}` : `/gallery/${record.slug}`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Gallery', to: '/gallery' }, { label: record.title }]} />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{record.photos?.length || 0} Photos</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold text-white">{record.title}</h1>
              <p className="mt-4 max-w-xl text-navy-100">{record.description}</p>
            </div>
            <Link to="/gallery" className="btn-outline-light">
              <ArrowLeft size={16} /> All Albums
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          {!record.photos?.length ? (
            <EmptyState icon={Images} title="This album is empty" text="Photos will be added here soon." />
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {record.photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="group relative block w-full overflow-hidden rounded-xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
                >
                  <Img src={src} alt={`${record.title} — photo ${i + 1}`} className="aspect-[4/3]" />
                  <div className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/25" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/95 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <button
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) => (i === 0 ? record.photos.length - 1 : i - 1))
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={record.photos[lightbox]}
            alt={`${record.title} — photo ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-cardHover"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) => (i + 1) % record.photos.length)
            }}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
            {lightbox + 1} / {record.photos.length}
          </p>
        </div>
      )}
    </>
  )
}
