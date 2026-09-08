import { useMemo, useState } from 'react'
import { Trophy, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { AchievementCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { cn } from '../lib/utils.js'

export default function Achievements() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [category, setCategory] = useState('All')

  const items = useMemo(
    () => publishedOnly('achievements').sort((a, b) => new Date(b.date) - new Date(a.date)),
    [publishedOnly]
  )
  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))], [items])
  const filtered = category === 'All' ? items : items.filter((i) => i.category === category)

  if (loading) {
    return (
      <>
        <SeoHead title={info?.achievementsPageTitle || 'Achievements'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.achievementsEyebrow || 'We Are Proud Of'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.achievementsHeading || 'Achievements'}</h1>
          </div>
        </div>
        <div className="bg-cream py-8 sm:py-16"><div className="container-x"><GridSkeleton count={6} /></div></div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={info?.achievementsPageTitle || 'Achievements'}
        description={info?.achievementsPageDescription || `Awards, results and proud moments from ${info?.name || 'Highgate School'} — academic, arts, sport and community.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Achievements' }]} />
          <p className="eyebrow">{info?.achievementsEyebrow || 'We Are Proud Of'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.achievementsHeading || 'Achievements'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Podiums, prizes, and proud moments — celebrated by the whole community.
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('All')}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition',
                category === 'All' ? 'bg-navy-900 text-white' : 'bg-white text-navy-800 shadow-card hover:bg-navy-50'
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold transition',
                  category === c ? 'bg-navy-900 text-white' : 'bg-white text-navy-800 shadow-card hover:bg-navy-50'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Trophy} title="No achievements yet" text="New achievements are added throughout the year." />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a, i) => (
                <Reveal key={a.id} delay={i * 60} className="h-full">
                  <AchievementCard item={a} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Read the Stories Behind the Trophies</h2>
                <p className="mt-2 max-w-lg text-sm text-navy-100">Full articles on our biggest achievements live in the newsroom.</p>
              </div>
              <a href="/news" className="btn-royal">
                Visit the Newsroom <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
