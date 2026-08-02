import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Puzzle } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { ClubCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Clubs() {
  const { publishedOnly, db } = useData()
  const info = db.schoolInfo
  const clubs = useMemo(() => publishedOnly('clubs', 'order'), [publishedOnly])

  return (
    <>
      <SeoHead
        title={info?.clubsPageTitle || 'Clubs & Societies'}
        description={info?.clubsPageDescription || `Over forty clubs and societies at ${info?.name || 'the school'} — robotics, music, debating, sport, and more.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Clubs & Societies' }]} />
          <p className="eyebrow">{info?.clubsEyebrow || 'Beyond the Classroom'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.clubsHeading || 'Clubs & Societies'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.clubsSubheading || 'Forty clubs, one promise: there is a place for every interest — and every student.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          {clubs.length === 0 ? (
            <EmptyState icon={Puzzle} title="No clubs listed yet" />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c, i) => (
                <Reveal key={c.id} delay={i * 60} className="h-full">
                  <ClubCard club={c} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Want to start a new club?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-100">
              Every year, students pitch new societies to the Activities Council. Talk to your form tutor to get started.
            </p>
            <Link to="/student-life" className="btn-gold mt-6">
              Explore Student Life
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
