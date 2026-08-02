import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DownloadCloud, ArrowLeft } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { DownloadRow } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import NotFound from './NotFound.jsx'

export default function DownloadsByCategory() {
  const { category } = useParams()
  const { db } = useData()
  const info = db.schoolInfo
  const downloads = (db.downloads || [])
    .filter((d) => (d.status === undefined || d.status === 'published') && d.isVisible !== false)
    .filter((d) => d.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const allCategories = useMemo(() => {
    const set = new Set((db.downloads || []).map((d) => d.category))
    return [...set]
  }, [db.downloads])

  if (downloads.length === 0) return <NotFound />

  const catLabel = downloads[0].category

  return (
    <>
      <SeoHead title={catLabel} description={`Download ${catLabel} documents from ${info?.name || 'Highgate School'}.`} />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Downloads', to: '/downloads' }, { label: catLabel }]} />
          <Link to="/downloads" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition hover:gap-3">
            <ArrowLeft size={16} /> All Downloads
          </Link>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">{catLabel}</h1>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <Link
                key={c}
                to={`/downloads/${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-800 shadow-card transition hover:bg-gold-50"
              >
                {c}
              </Link>
            ))}
          </div>

          {downloads.length === 0 ? (
            <EmptyState icon={DownloadCloud} title="No documents in this category" />
          ) : (
            <div className="space-y-4">
              {downloads.map((d, i) => (
                <Reveal key={d.id} delay={i * 60}>
                  <DownloadRow item={d} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
