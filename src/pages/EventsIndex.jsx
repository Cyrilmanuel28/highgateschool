import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { EventCard } from '../components/Cards.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn } from '../lib/utils.js'

export default function EventsIndex() {
  const { publishedOnly, now, db, loading } = useData()
  const info = db.schoolInfo
  const [filter, setFilter] = useState('upcoming')

  const events = useMemo(
    () =>
      publishedOnly('events')
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    [publishedOnly]
  )

  const upcoming = events.filter((e) => new Date(e.endDate || e.startDate).getTime() >= now)
  const past = events.filter((e) => new Date(e.endDate || e.startDate).getTime() < now).reverse()
  const shown = filter === 'upcoming' ? upcoming : past

  return (
    <>
      <SeoHead
        title={info?.eventsPageTitle || 'Events'}
        description={info?.eventsPageDescription || `Upcoming events at ${info?.name || 'Highgate School'} — open mornings, festivals, and community gatherings.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Events' }]} />
          <p className="eyebrow">What's On</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">Events & Open Mornings</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Festivals, information evenings, and open mornings — everyone is welcome at {info?.shortName || info?.name || 'the school'}.
          </p>
        </div>
      </div>

      <div className="bg-surface py-16">
        <div className="container-x">
          <div className="mb-10 flex gap-2">
            {['upcoming', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-5 py-2.5 text-xs font-semibold capitalize transition',
                  filter === f
                    ? 'bg-royal text-white shadow-royal'
                    : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
                )}
              >
                {f === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </button>
            ))}
          </div>

          {loading ? (
            <GridSkeleton count={6} cols="md:grid-cols-2 lg:grid-cols-3" aspect="aspect-[16/10]" />
          ) : shown.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events here yet"
              text={filter === 'upcoming' ? 'New events are scheduled regularly — check the calendar or come back soon.' : 'No past events to show.'}
              action={
                <Link to="/calendar" className="btn-royal">
                  <CalendarDays size={16} /> View term calendar
                </Link>
              }
            />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((e, i) => (
                <Reveal key={e.id} delay={i * 60} className="h-full">
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Prefer the full picture?</h2>
                <p className="mt-2 max-w-lg text-sm text-navy-100">
                  Term dates, holidays, assessments, and events all live on the academic calendar.
                </p>
              </div>
              <Link to="/calendar" className="btn-royal">
                Academic Calendar <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
