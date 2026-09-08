import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { SportCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'

export default function Sports() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const sports = useMemo(() => publishedOnly('sports', 'order'), [publishedOnly])

  if (loading) {
    return (
      <>
        <SeoHead title={info?.sportsPageTitle || 'Sports'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.sportsEyebrow || 'Play & Compete'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.sportsHeading || 'Sports'}</h1>
          </div>
        </div>
        <div className="bg-cream py-8 sm:py-16"><div className="container-x"><GridSkeleton count={6} /></div></div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={info?.sportsPageTitle || 'Sports'}
        description={info?.sportsPageDescription || `Sports at ${info?.name || 'Highgate School'} — football, swimming, athletics, netball, rugby and outdoor education.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Sports' }]} />
          <p className="eyebrow">{info?.sportsEyebrow || 'Play & Compete'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.sportsHeading || `Sports at ${info?.shortName || 'Highgate'}`}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Twenty-five teams across twelve disciplines — from first steps to national finals.
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          {sports.length === 0 ? (
            <EmptyState icon={Dumbbell} title="No sports listed yet" />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {sports.map((s, i) => (
                <Reveal key={s.id} delay={i * 60} className="h-full">
                  <SportCard sport={s} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Come and Play</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-100">
              Trials for competitive squads run at the start of every term — everyone is welcome.
            </p>
            <Link to="/calendar" className="btn-royal mt-6">
              See the Calendar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
