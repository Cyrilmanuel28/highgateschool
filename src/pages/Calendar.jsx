import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { formatDate, cn, slugify, triggerDownload } from '../lib/utils.js'

const TYPE_COLORS = {
  Term: 'bg-navy-800 text-white',
  Holiday: 'bg-gold-100 text-gold-800',
  Assessment: 'bg-red-100 text-red-700',
  Event: 'bg-emerald-100 text-emerald-700',
  Admissions: 'bg-sky-100 text-sky-700'
}

export default function Calendar() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const events = useMemo(() => publishedOnly('calendarEvents').sort((a, b) => new Date(a.date) - new Date(b.date)), [publishedOnly])

  const today = new Date()
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })

  if (loading) {
    return (
      <>
        <SeoHead title={info?.calendarPageTitle || 'Academic Calendar'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.calendarEyebrow || 'Important Dates'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.calendarHeading || 'Academic Calendar'}</h1>
          </div>
        </div>
        <div className="bg-cream py-8 sm:py-16"><div className="container-x"><GridSkeleton count={4} /></div></div>
      </>
    )
  }

  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1)
    const startDay = (first.getDay() + 6) % 7
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [view])

  const eventsByDate = useMemo(() => {
    const map = {}
    events.forEach((e) => {
      const key = new Date(e.date).toDateString()
      map[key] = map[key] || []
      map[key].push(e)
    })
    return map
  }, [events])

  const upcoming = events.filter((e) => new Date(e.date) >= today).slice(0, 8)
  const monthName = new Date(view.y, view.m).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const goToday = () => {
    const t = new Date()
    setView({ y: t.getFullYear(), m: t.getMonth() })
  }

  const addToCalendar = (e) => {
    const pad = (n) => String(n).padStart(2, '0')
    const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
    const start = new Date(e.date)
    const end = new Date(e.endDate && new Date(e.endDate) > start ? e.endDate : start)
    end.setDate(end.getDate() + 1)
    const clean = (s = '') => s.replace(/[\r\n]+/g, ' ').replace(/[;,]/g, ' ')
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//${info?.shortName || info?.name || 'School'}//Academic Calendar//EN`,
      'BEGIN:VEVENT',
      `UID:${e.id}@${info?.calendarDomain || 'highgate.sch.uk'}`,
      `DTSTART;VALUE=DATE:${icsDate(start)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:${clean(e.title)}`,
      `DESCRIPTION:${clean(e.description)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ]
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    triggerDownload(url, `${slugify(e.title)}-${icsDate(start)}.ics`)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <SeoHead
        title={info?.calendarPageTitle || 'Academic Calendar'}
        description={info?.calendarPageDescription || `Term dates, holidays, assessments, and events at ${info?.name || 'the school'}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Academic Calendar' }]} />
          <p className="eyebrow">{info?.calendarEyebrow || 'Dates & Terms'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.calendarHeading || 'Academic Calendar'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.calendarSubheading || 'Terms, holidays, assessments, and events — the whole year at a glance.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <Reveal>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-navy-50 hover:text-navy-900 sm:h-10 sm:w-10"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="min-w-0 truncate font-serif text-lg font-semibold text-navy-900 sm:text-2xl">{monthName}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToday}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-navy-800 transition hover:border-gold-500 hover:text-gold-600 sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-navy-50 hover:text-navy-900"
                    aria-label="Next month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-slate-100 bg-navy-900 text-center text-[10px] font-bold uppercase tracking-normal text-navy-100 sm:text-[11px] sm:tracking-wider">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="py-3">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {grid.map((date, i) => {
                  if (!date) return <div key={i} className="min-h-[64px] overflow-hidden border-b border-r border-slate-50 bg-slate-50/50 sm:min-h-[84px]" />
                  const key = date.toDateString()
                  const dayEvents = eventsByDate[key] || []
                  const isToday = date.toDateString() === today.toDateString()
                  return (
                    <div key={i} className={cn('min-h-[64px] overflow-hidden border-b border-r border-slate-100 p-1 sm:p-1.5 sm:min-h-[84px]', date.getDay() === 0 && 'bg-cream')}>
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                          isToday ? 'bg-gold-500 text-white' : 'text-navy-800'
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <div className="mt-1.5 space-y-1">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            title={e.title}
                            className={cn('truncate rounded px-1.5 py-0.5 text-[9px] font-semibold leading-tight', TYPE_COLORS[e.type] || 'bg-slate-100 text-slate-600')}
                          >
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="px-1 text-[9px] font-semibold text-gold-600">+{dayEvents.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 text-[10px] font-semibold text-slate-500 sm:gap-3 sm:px-6 sm:py-4 sm:text-[11px]">
                {[
                  ['Term', 'bg-navy-800'],
                  ['Holiday', 'bg-gold-300'],
                  ['Assessment', 'bg-red-300'],
                  ['Event', 'bg-emerald-300'],
                  ['Admissions', 'bg-sky-300']
                ].map(([type, cls]) => (
                  <span key={type} className="flex items-center gap-1.5">
                    <span className={cn('h-2.5 w-2.5 rounded-full', cls)} />
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-16">
            <h2 className="mb-7 font-serif text-3xl font-semibold text-navy-900">Upcoming Dates</h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={CalendarDays} title="No upcoming dates" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map((e, i) => (
                  <Reveal key={e.id} delay={i * 50}>
                    <div className="card-hover flex items-start gap-5 p-5">
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-900">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                          {new Date(e.date).toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                        <span className="font-serif text-xl font-bold text-white">{new Date(e.date).getDate()}</span>
                      </div>
                      <div>
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold', TYPE_COLORS[e.type])}>{e.type}</span>
                        <h3 className="mt-1.5 font-serif text-lg font-semibold text-navy-900">{e.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{e.description}</p>
                        {e.endDate && e.endDate !== e.date && (
                          <p className="mt-1 text-xs font-medium text-gold-600">Until {formatDate(e.endDate)}</p>
                        )}
                        <button
                          onClick={() => addToCalendar(e)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 transition hover:text-gold-600"
                        >
                          <CalendarDays size={14} />
                          Add to calendar
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
