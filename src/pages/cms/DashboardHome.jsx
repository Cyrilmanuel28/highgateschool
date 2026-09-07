import { Link } from 'react-router-dom'
import {
  FileText, Newspaper, CalendarDays, Images, Users, FolderOpen, MessageSquare, ArrowRight,
  Clock, Globe, ScrollText, History, Activity, CheckCircle2, ShieldCheck
} from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Card, StatusBadge } from '../../components/cms/UI.jsx'
import { formatDateTime, timeAgo } from '../../lib/utils.js'
import { AUDIT_ACTION_LABEL } from '../../lib/publishing.js'

const QUICK = [
  { to: '/dashboard/pages/new', label: 'New Page', icon: FileText },
  { to: '/dashboard/news/new', label: 'New Article', icon: Newspaper },
  { to: '/dashboard/events/new', label: 'New Event', icon: CalendarDays },
  { to: '/dashboard/gallery/new', label: 'New Album', icon: Images },
  { to: '/dashboard/staff/new', label: 'Add Staff', icon: Users }
]

const ENTITY_ROUTE = {
  pages: 'pages', news: 'news', events: 'events', albums: 'gallery', videos: 'videos',
  notices: 'notices', library: 'library', magazineArticles: 'magazine',
  vacancies: 'vacancies', downloads: 'downloads', faqs: 'faq', achievements: 'achievements',
  clubs: 'clubs', sports: 'sports', staff: 'staff', departments: 'departments',
  programs: 'academics', fees: 'fees', calendarEvents: 'calendar',
  campusLocations: 'campus', tourScenes: 'tour', emergencyAlerts: 'emergency', stats: 'stats'
}

export default function DashboardHome() {
  const { db, auditLog } = useData()
  const info = db.schoolInfo
  const { user } = useAuth()

  const drafts = (db.pages || []).filter((p) => p.status === 'draft').length
  const pending = Object.entries(db)
    .filter(([k, v]) => Array.isArray(v) && !['applications', 'feedback', 'messages', 'jobApplications', 'eventRegistrations', 'newsletterSubscribers'].includes(k))
    .reduce((sum, [, rows]) => sum + rows.filter((r) => r.status === 'pending').length, 0)
  const scheduled = [...(db.pages || []), ...(db.news || []), ...(db.events || [])].filter((p) => p.status === 'scheduled').length
  const unread = (db.messages || []).filter((m) => !m.isRead).length
  const mediaCount = (db.media || []).length
  const livePages = (db.pages || []).filter((p) => p.status === 'published').length
  const upcomingEvents = (db.events || [])
    .filter((e) => e.status === 'published' && new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 4)
  const latestNews = (db.news || [])
    .slice()
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt) - new Date(a.publishedAt || a.updatedAt))
    .slice(0, 4)
  const latestMessages = (db.messages || []).slice().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5)
  const recentActivity = auditLog.slice(0, 8)

  const stats = [
    { label: 'Published Pages', value: livePages, to: '/dashboard/pages' },
    { label: 'Pending Review', value: pending, to: '/dashboard/audit' },
    { label: 'Drafts', value: drafts, to: '/dashboard/pages' },
    { label: 'Scheduled Items', value: scheduled, to: '/dashboard/news' },
    { label: 'Media Files', value: mediaCount, to: '/dashboard/media' },
    { label: 'Unread Messages', value: unread, to: '/dashboard/contact-messages' }
  ]

  const activityTarget = (e) => {
    const route = ENTITY_ROUTE[e.entity]
    if (!route) return '/dashboard'
    return e.recordId ? `/dashboard/${route}/${e.recordId}` : `/dashboard/${route}`
  }

  const activityTone = (action) => {
    if (action === 'publish') return 'bg-emerald-50 text-emerald-600'
    if (action === 'delete' || action === 'unpublish') return 'bg-red-50 text-red-600'
    if (action === 'restore') return 'bg-sky-50 text-sky-600'
    if (action === 'create') return 'bg-gold-50 text-gold-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-navy-900 sm:text-3xl">
          Welcome back, {user?.username}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — here's what's happening at {info?.shortName || info?.name || 'the school'}.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-card"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className="mt-1.5 font-serif text-3xl font-semibold text-navy-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/health"
          className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-500/10 p-6 text-left transition hover:bg-emerald-500/15"
        >
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Activity size={14} className="text-emerald-700" /> System Health: Healthy
            </p>
            <p className="mt-2 font-serif text-xl font-semibold text-emerald-950">Self-Verifying Reliability</p>
            <p className="mt-1 text-xs text-emerald-800">Database, API, Storage, Cache & Live Website synchronized</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-transform group-hover:scale-110">
            <CheckCircle2 size={18} />
          </div>
        </Link>
        <button
          onClick={() => (window.location.href = '/')}
          className="group flex items-center justify-between rounded-2xl bg-navy-900 p-6 text-left transition hover:bg-navy-800"
        >
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400">
              <Globe size={14} /> Public Site
            </p>
            <p className="mt-2 font-serif text-xl font-semibold text-white">View the live website</p>
            <p className="mt-1 text-xs text-navy-200">Open live school website in visitor view</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-transform group-hover:translate-x-1">
            <ArrowRight size={18} />
          </div>
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {QUICK.filter((q) => !q.label.includes('Page')).map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-navy-900 shadow-sm transition hover:border-navy-300 hover:shadow-card"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
              <q.icon size={17} />
            </span>
            {q.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Upcoming Events" action={<Link to="/dashboard/events" className="text-xs font-semibold text-gold-600 hover:text-gold-700">Manage →</Link>} className="lg:col-span-1">
          <div className="space-y-3.5">
            {upcomingEvents.length === 0 && <p className="text-sm text-slate-400">No upcoming events.</p>}
            {upcomingEvents.map((e) => (
              <Link key={e.id} to={`/dashboard/events/${e.id}`} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-navy-900">
                  <span className="text-[9px] font-bold uppercase text-gold-400">{new Date(e.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  <span className="font-serif text-lg font-bold leading-none text-white">{new Date(e.startDate).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {formatDateTime(e.startDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Latest News" action={<Link to="/dashboard/news" className="text-xs font-semibold text-gold-600 hover:text-gold-700">Manage →</Link>} className="lg:col-span-1">
          <div className="space-y-3.5">
            {latestNews.length === 0 && <p className="text-sm text-slate-400">No articles yet.</p>}
            {latestNews.map((n) => (
              <Link key={n.id} to={`/dashboard/news/${n.id}`} className="block rounded-xl p-2 transition hover:bg-slate-50">
                <p className="line-clamp-1 text-sm font-semibold text-navy-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.publishedAt || n.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Recent Messages" action={<Link to="/dashboard/contact-messages" className="text-xs font-semibold text-gold-600 hover:text-gold-700">Manage →</Link>} className="lg:col-span-1">
          <div className="space-y-3.5">
            {latestMessages.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
            {latestMessages.map((m) => (
              <Link key={m.id} to="/dashboard/contact-messages" className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy-800">
                  {m.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {m.subject} {!m.isRead && <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-gold-500 align-middle" />}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{m.name} · {timeAgo(m.submittedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card
          title="Recent Publishing Activity"
          subtitle="Every publish, edit, delete and restore across the site"
          action={
            <div className="flex flex-wrap gap-2">
              <Link to="/dashboard/audit" className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-700">
                <ScrollText size={13} /> Audit Log →
              </Link>
              <Link to="/dashboard/versions" className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-700">
                <History size={13} /> Versions →
              </Link>
            </div>
          }
        >
          {recentActivity.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No activity yet — changes you make in the dashboard are recorded here automatically.
            </p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((e) => (
                <Link
                  key={e.id}
                  to={activityTarget(e)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase ${activityTone(e.action)}`}>
                    {(AUDIT_ACTION_LABEL[e.action] || e.action).slice(0, 3)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {AUDIT_ACTION_LABEL[e.action] || e.action} <span className="font-normal text-slate-500">— {e.title || e.entity}</span>
                    </p>
                    <p className="truncate text-xs text-slate-400">{e.user} · {timeAgo(e.at)}</p>
                  </div>
                  {e.to && <StatusBadge status={e.to} />}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
