import { useMemo } from 'react'
import { Siren, Phone, ShieldAlert, CloudRain, HeartPulse, DoorClosed, AlertTriangle, Info, MapPin } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn, formatDate } from '../lib/utils.js'

const TYPE_META = {
  Alert: { icon: Siren, cls: 'border-red-200 bg-red-50', chip: 'bg-red-100 text-red-700' },
  Advisory: { icon: Info, cls: 'border-sky-200 bg-sky-50', chip: 'bg-sky-100 text-sky-700' },
  Closure: { icon: DoorClosed, cls: 'border-red-200 bg-red-50', chip: 'bg-red-100 text-red-700' },
  Weather: { icon: CloudRain, cls: 'border-sky-200 bg-sky-50', chip: 'bg-sky-100 text-sky-700' },
  Security: { icon: ShieldAlert, cls: 'border-red-200 bg-red-50', chip: 'bg-red-100 text-red-700' },
  Health: { icon: HeartPulse, cls: 'border-emerald-200 bg-emerald-50', chip: 'bg-emerald-100 text-emerald-700' }
}

const SEVERITY_DOT = { info: 'bg-sky-500', warning: 'bg-amber-500', critical: 'bg-red-600' }

export default function Emergency() {
  const { db } = useData()
  const now = Date.now()

  const active = useMemo(
    () =>
      (db.emergencyAlerts || [])
        .filter((a) => a.isVisible !== false && a.status === 'published')
        .filter((a) => !a.expireDate || new Date(a.expireDate).getTime() > now)
        .sort((a, b) => new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt)),
    [db.emergencyAlerts, now]
  )

  const info = db.schoolInfo

  return (
    <>
      <SeoHead
        title={info?.emergencyPageTitle || 'Emergency Information'}
        description={info?.emergencyPageDescription || `Emergency contacts, health advisories, closure notices, and safety alerts from ${info?.name || 'Highgate School'}.`}
      />
      <div className="relative overflow-hidden bg-red-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Emergency Information' }]} />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
            <Siren size={14} className="animate-pulse" /> {info?.emergencyEyebrow || 'For urgent matters'}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.emergencyHeading || 'Emergency Information Centre'}</h1>
          <p className="mt-4 max-w-xl text-red-100">
            {info?.emergencySubheading || 'Closures, weather advisories, security alerts, and health notices — published here the moment they are issued.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-semibold text-navy-900">Active alerts</h2>
              {active.length === 0 ? (
                <div className="mt-5">
                  <EmptyState icon={Siren} title="No active alerts" text="There are currently no emergency alerts or advisories in force." />
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {active.map((a, i) => {
                    const meta = TYPE_META[a.type] || TYPE_META.Alert
                    const Icon = meta.icon
                    return (
                      <Reveal key={a.id} delay={i * 60}>
                        <div className={cn('rounded-2xl border-2 p-6', meta.cls)}>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide', meta.chip)}>
                              <Icon size={11} /> {a.type}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                              <span className={cn('h-1.5 w-1.5 rounded-full', SEVERITY_DOT[a.severity] || SEVERITY_DOT.info)} />
                              {a.severity}
                            </span>
                          </div>
                          <h3 className="mt-3 font-serif text-xl font-semibold text-navy-900">{a.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{a.message}</p>
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Published {formatDate(a.publishDate || a.createdAt)}
                            {a.expireDate && <span> · valid until {formatDate(a.expireDate)}</span>}
                          </p>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              )}

              <div className="mt-10 rounded-2xl bg-navy-900 p-6">
                <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-white">
                  <AlertTriangle size={18} className="text-gold-400" /> How families are notified
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-100">
                  In an emergency, {info?.shortName || info?.name || 'the school'} contacts every family by email, text, and the parent app. This page is updated
                  instantly as the first point of reference — always follow official instructions from the school.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-navy-900">
                  <Phone size={16} className="text-gold-600" /> Emergency contacts
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-2.5 text-slate-600">
                    <Phone size={14} className="mt-0.5 shrink-0 text-gold-600" />
                    <span><strong className="text-navy-900">School:</strong> {info?.phone}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-600">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-gold-600" />
                    <span><strong className="text-navy-900">Address:</strong> {info?.address}</span>
                  </li>
                  <li className="border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <strong className="text-navy-800">UK emergency services:</strong> 999 · Police non-emergency: 101 ·
                    NHS helpline: 111
                  </li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-serif text-lg font-semibold text-navy-900">In an emergency</h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-600">
                  {[
                    'Call 999 for medical, fire, or police emergencies',
                    'If on campus, notify a member of staff immediately',
                    'Follow staff instructions and posted safety routes',
                    'Parents — wait for official school communications'
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy-900">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <AlertTriangle size={14} /> School closure process
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-900">
                  If weather or an incident requires a closure, families are notified by 06:30 where possible, and the
                  decision is posted here immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
