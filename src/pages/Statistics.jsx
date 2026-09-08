import { useMemo } from 'react'
import { Users, Globe2, GraduationCap, Heart, Trophy, Target, Puzzle, CalendarDays, Award, PersonStanding } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import StatCounter from '../components/StatCounter.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { cn } from '../lib/utils.js'

const ICONS = {
  users: Users,
  globe: Globe2,
  graduation: GraduationCap,
  heart: Heart,
  teacher: PersonStanding,
  trophy: Trophy,
  target: Target,
  puzzle: Puzzle,
  calendar: CalendarDays,
  award: Award
}

export default function Statistics() {
  const { db, loading } = useData()
  const info = db.schoolInfo
  const stats = useMemo(() => (db.stats || []).filter((s) => (s.status === undefined || s.status === 'published') && s.isVisible !== false).slice().sort((a, b) => (a.order || 0) - (b.order || 0)), [db.stats])

  if (loading) {
    return (
      <>
        <SeoHead title={info?.statisticsPageTitle || 'School Statistics'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.statisticsEyebrow || 'By the Numbers'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.statisticsHeading || 'School Statistics'}</h1>
          </div>
        </div>
        <div className="bg-cream py-16"><div className="container-x"><GridSkeleton count={10} columns={5} /></div></div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={info?.statisticsPageTitle || 'School Statistics'}
        description={info?.statisticsPageDescription || `The numbers behind ${info?.name || 'Highgate School'} — students, results, nationalities, and more.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'School Statistics' }]} />
          <p className="eyebrow">{info?.statisticsEyebrow || 'By the Numbers'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.statisticsHeading || 'School Statistics'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            The numbers behind a school that has grown from one classroom to forty-two nations.
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          {stats.length === 0 ? (
            <EmptyState icon={Target} title="No statistics yet" text="Statistics will appear here." />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((s, i) => {
                const Icon = ICONS[s.icon] || Target
                return (
                  <Reveal key={s.id} delay={(i % 5) * 60}>
                    <div className="card-hover group relative overflow-hidden p-6 text-center">
                      <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold-500/10 transition group-hover:scale-125" />
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                        <Icon size={22} />
                      </span>
                      <p className="mt-4 font-serif text-4xl font-bold text-navy-900">
                        <StatCounter value={s.value} suffix={s.suffix || ''} />
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy-800">{s.label}</p>
                      {s.description && <p className="mt-1 text-xs text-slate-500">{s.description}</p>}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            <div className={cn('rounded-2xl bg-navy-900 p-8')}>
              <GraduationCap size={28} className="text-gold-400" />
              <h3 className="mt-4 font-serif text-2xl font-semibold text-white">Academic performance</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-100">
                96% IB pass rate with an average of 36 points, and IGCSE results consistently above the global average.
                Our university counselling team supports every Diploma student from Year 10.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Users size={28} className="text-gold-600" />
              <h3 className="mt-4 font-serif text-2xl font-semibold text-navy-900">A global community</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Forty-two nationalities learning together, with more than twenty languages spoken in the corridors and
                celebrated in the classroom. Around a third of new joiners develop their English with us.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Heart size={28} className="text-gold-600" />
              <h3 className="mt-4 font-serif text-2xl font-semibold text-navy-900">Pastoral care</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A 1:8 student–teacher ratio, a dedicated counselling team, and a four-house system where every child is
                known by name from the day they arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
