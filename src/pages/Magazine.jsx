import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn, formatDate, truncate, initials } from '../lib/utils.js'

export default function Magazine() {
  const { db } = useData()
  const info = db.schoolInfo
  const [edition, setEdition] = useState('All')

  const articles = useMemo(
    () =>
      (db.magazineArticles || [])
        .filter((a) => a.status === 'published')
        .sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0) || new Date(b.publishedAt) - new Date(a.publishedAt)),
    [db.magazineArticles]
  )

  const editions = useMemo(() => ['All', ...new Set(articles.map((a) => a.edition).filter(Boolean))], [articles])
  const filtered = edition === 'All' ? articles : articles.filter((a) => a.edition === edition)

  return (
    <>
      <SeoHead
        title={info?.magazinePageTitle || 'The Magazine'}
        description={info?.magazinePageDescription || `Features, interviews, and student writing from The ${info?.shortName || 'Highgate'} Magazine.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'The Highgate Magazine' }]} />
          <p className="eyebrow">{info?.magazineEyebrow || 'Publications'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.magazineHeading || 'The Magazine'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Stories, interviews, and creative writing from students and staff — published in editions.
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {editions.map((e) => (
              <button
                key={e}
                onClick={() => setEdition(e)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold transition',
                  edition === e ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 shadow-card hover:text-navy-900'
                )}
              >
                {e}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState icon={Newspaper} title="No articles yet" text="New editions are published each term." />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 60}>
                  <Link to={`/magazine/${a.slug}`} className="card-hover group flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Img src={a.coverImage} alt={a.title} className="transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900 backdrop-blur">
                        {a.edition}
                      </span>
                      <span className="absolute bottom-4 left-4 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900">
                        {a.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-800 font-serif text-sm font-semibold text-gold-400">
                          {initials(a.author)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-navy-900">{a.author}</p>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            {a.contributorType || 'Guest'} · {formatDate(a.publishedAt)}
                          </p>
                        </div>
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-navy-900 transition group-hover:text-gold-700">
                        {a.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{truncate(a.excerpt, 130)}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition group-hover:gap-2.5">
                        Read article <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
