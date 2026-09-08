import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Img from '../components/Img.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { EventCard } from '../components/Cards.jsx'
import { formatDate, stripHtml, truncate } from '../lib/utils.js'
import { DetailSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

export default function EventDetail() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { getBySlug, getRecord, publishedOnly, now, db, loading } = useData()
  const info = db.schoolInfo
  const event = useMemo(() => getBySlug('events', slug) || getRecord('events', slug), [getBySlug, getRecord, slug, db.events])

  if (loading) return <DetailSkeleton />
  if (!event || (!searchParams.get('preview') && event.status !== 'published')) return <NotFound />

  const start = new Date(event.startDate)
  const others = publishedOnly('events')
    .filter((e) => e.id !== event.id && new Date(e.endDate || e.startDate).getTime() >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <SeoHead
        title={event.title}
        description={truncate(stripHtml(event.description), 160)}
        ogImage={event.featuredImage}
        canonical={origin ? `${origin}/events/${event.slug}` : `/events/${event.slug}`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Events', to: '/events' }, { label: event.title }]} />
          <div className="max-w-3xl">
            <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-300">
              {start.getFullYear() === new Date().getFullYear() ? 'This Year' : 'Upcoming'}
            </span>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl shadow-cardHover">
                <Img src={event.featuredImage} alt={event.title} className="aspect-[16/9]" />
              </div>
              <div className="mt-8">
                <h2 className="font-serif text-3xl font-semibold text-navy-900">About This Event</h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-5 text-lg leading-relaxed text-slate-700">{event.description}</p>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="card p-7">
                <h3 className="font-serif text-xl font-semibold text-navy-900">Event Details</h3>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex gap-3.5">
                    <Calendar size={18} className="mt-0.5 shrink-0 text-gold-600" />
                    <div>
                      <p className="font-semibold text-navy-900">Date</p>
                      <p className="text-slate-600">{formatDate(event.startDate)}</p>
                      {event.endDate && event.endDate !== event.startDate && (
                        <p className="text-slate-600">to {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <Clock size={18} className="mt-0.5 shrink-0 text-gold-600" />
                    <div>
                      <p className="font-semibold text-navy-900">Time</p>
                      <p className="text-slate-600">
                        {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-gold-600" />
                    <div>
                      <p className="font-semibold text-navy-900">Location</p>
                      <p className="text-slate-600">{event.location}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-navy-900 p-7 text-center">
                <h3 className="font-serif text-xl font-semibold text-white">Questions?</h3>
                <p className="mt-2 text-sm text-navy-100">Our team is happy to help you plan your visit.</p>
                <Link to="/contact" className="btn-royal mt-5 w-full">
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-20">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="font-serif text-3xl font-semibold text-navy-900">More Events</h2>
                <Link to="/events" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                  View all →
                </Link>
              </div>
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {others.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 transition hover:gap-3">
              <ArrowLeft size={16} /> Back to all events
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
