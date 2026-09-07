import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Newspaper, CalendarDays, Menu as MenuIcon, Images, Clapperboard,
  FolderDown, HelpCircle, Trophy, Puzzle, Dumbbell, Users, Library, GraduationCap, Wallet,
  CalendarRange, FolderOpen, Search, Settings as SettingsIcon, MessageSquare, LogOut,
  ExternalLink, PanelLeftClose, PanelLeft, Megaphone, BookOpen, Briefcase, ClipboardList,
  MessageSquareText, Quote, ClipboardCheck, UserPlus, MapPin, Compass, BarChart3, Mail,
  ScrollText, History, LayoutList
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { cn } from '../../lib/utils.js'

const NAV = [
  { section: 'Overview', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/home-sections', label: 'Home Page', icon: LayoutList }
  ] },
  {
    section: 'Content',
    items: [
      { to: '/dashboard/pages', label: 'Pages', icon: FileText },
      { to: '/dashboard/news', label: 'News', icon: Newspaper },
      { to: '/dashboard/notices', label: 'Notices', icon: Megaphone },
      { to: '/dashboard/events', label: 'Events', icon: CalendarDays },
      { to: '/dashboard/menus', label: 'Menus', icon: MenuIcon },
      { to: '/dashboard/gallery', label: 'Gallery', icon: Images },
      { to: '/dashboard/videos', label: 'Videos', icon: Clapperboard },
      { to: '/dashboard/downloads', label: 'Downloads', icon: FolderDown },
      { to: '/dashboard/library', label: 'Library', icon: BookOpen },
      { to: '/dashboard/magazine', label: 'Magazine', icon: FileText },
      { to: '/dashboard/faq', label: 'FAQ', icon: HelpCircle },
      { to: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
      { to: '/dashboard/clubs', label: 'Clubs', icon: Puzzle },
      { to: '/dashboard/sports', label: 'Sports', icon: Dumbbell }
    ]
  },
  {
    section: 'People & School',
    items: [
      { to: '/dashboard/staff', label: 'Staff', icon: Users },
      { to: '/dashboard/departments', label: 'Departments', icon: Library },
      { to: '/dashboard/academics', label: 'Academic Programmes', icon: GraduationCap },
      { to: '/dashboard/fees', label: 'Fee Structures', icon: Wallet },
      { to: '/dashboard/calendar', label: 'Calendar Events', icon: CalendarRange },
      { to: '/dashboard/vacancies', label: 'Careers', icon: Briefcase }
    ]
  },
  {
    section: 'Engagement',
    items: [
      { to: '/dashboard/applications', label: 'Admissions', icon: ClipboardList },
      { to: '/dashboard/feedback', label: 'Feedback', icon: MessageSquareText },
      { to: '/dashboard/testimonials', label: 'Testimonials', icon: Quote },
      { to: '/dashboard/job-applications', label: 'Job Applications', icon: ClipboardCheck },
      { to: '/dashboard/event-registrations', label: 'Event Registrations', icon: UserPlus }
    ]
  },
  {
    section: 'Campus',
    items: [
      { to: '/dashboard/campus', label: 'Campus Locations', icon: MapPin },
      { to: '/dashboard/tour', label: 'Virtual Tour', icon: Compass },
      { to: '/dashboard/emergency', label: 'Emergency Alerts', icon: Megaphone },
      { to: '/dashboard/stats', label: 'Statistics', icon: BarChart3 }
    ]
  },
  {
    section: 'Publishing',
    items: [
      { to: '/dashboard/audit', label: 'Audit Log', icon: ScrollText },
      { to: '/dashboard/versions', label: 'Version History', icon: History }
    ]
  },
  {
    section: 'System',
    items: [
      { to: '/dashboard/media', label: 'Media Library', icon: FolderOpen },
      { to: '/dashboard/seo', label: 'SEO', icon: Search },
      { to: '/dashboard/newsletter-subscribers', label: 'Newsletter', icon: Mail },
      { to: '/dashboard/contact-messages', label: 'Contact Messages', icon: MessageSquare, badgeKey: 'unread' },
      { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon }
    ]
  }
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const { db } = useData()
  const info = db.schoolInfo
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const unread = (db.messages || []).filter((m) => !m.isRead).length

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 font-serif text-xl font-bold text-slate-900">
          A
        </div>
        <div className={cn('min-w-0 transition', collapsed && 'lg:hidden')}>
          <p className="truncate text-sm font-bold text-white">{info?.name || 'Highgate'} CMS</p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">Developer Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className={cn('mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500', collapsed && 'lg:hidden')}>
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const badge = item.badgeKey === 'unread' && unread > 0 ? unread : null
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={item.label}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                        collapsed && 'lg:justify-center'
                      )
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className={cn('flex-1 truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                    {badge && (
                      <span className={cn('flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-slate-900', collapsed && 'lg:hidden')}>
                        {badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-700 font-semibold text-gold-400">
            {(user?.username || 'A')[0].toUpperCase()}
          </div>
          <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
            <p className="truncate text-xs font-bold text-white">{user?.username}</p>
            <p className="truncate text-[10px] text-slate-400">Administrator</p>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/dashboard')
            }}
            className={cn('rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white', collapsed && 'lg:hidden')}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className={cn('hidden shrink-0 bg-slate-900 transition-all duration-300 lg:block', collapsed ? 'lg:w-16' : 'lg:w-64')}>
        {sidebar}
      </aside>

      <div className={cn('fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition lg:hidden', mobileOpen ? 'visible opacity-100' : 'invisible opacity-0')} onClick={() => setMobileOpen(false)}>
        <div className="h-full w-72 bg-slate-900" onClick={(e) => e.stopPropagation()}>
          {sidebar}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}>
            <MenuIcon size={18} />
          </button>
          <button
            className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-navy-900 transition hover:bg-slate-50"
            >
              <ExternalLink size={13} /> View Site
            </Link>
            <Link
              to="/dashboard/contact-messages"
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50',
                unread > 0 && 'border-gold-300 bg-gold-50 text-gold-700'
              )}
              title="Contact messages"
            >
              <MessageSquare size={15} />
              {unread > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
