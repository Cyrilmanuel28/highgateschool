import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Phone, Mail, Search as SearchIcon } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { seedMenus } from '../data/seed.js'
import { cn } from '../lib/utils.js'
import GlobalSearch from './GlobalSearch.jsx'

function buildTree(items) {
  const top = items
    .filter((i) => !i.parentId)
    .sort((a, b) => a.order - b.order)
  const childrenByParent = {}
  items
    .filter((i) => i.parentId)
    .sort((a, b) => a.order - b.order)
    .forEach((i) => {
      ;(childrenByParent[i.parentId] = childrenByParent[i.parentId] || []).push(i)
    })
  return { top, childrenByParent }
}

function Logo({ light, logo, name, shortName }) {
  const displayName = name || 'Highgate School'
  const subName = shortName || displayName
  const initials = displayName.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Link to="/" className="group flex items-center gap-3.5">
      {logo ? (
        <img src={logo} alt={displayName} className="h-11 w-11 rounded-lg object-contain shadow-subtle transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-royal font-serif text-xl font-bold text-white border border-gold-500/30 shadow-subtle transition-transform duration-300 group-hover:scale-105">
          <span className="text-gold-300">{initials}</span>
        </div>
      )}
      <div className="leading-tight">
        <p className="font-serif text-lg font-semibold tracking-wide text-white">
          {displayName}
        </p>
        {subName !== displayName && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            {subName}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function Navbar() {
  const { db } = useData()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const isHome = location.pathname === '/'
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenAccordion(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const menus = useMemo(() => {
    const list = (db.menus || []).filter((m) => m.isVisible)
    return list.length > 0 ? list : seedMenus().filter((m) => m.isVisible)
  }, [db.menus])
  const { top, childrenByParent } = useMemo(() => buildTree(menus), [menus])
  const schoolInfo = db.schoolInfo

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          solid
            ? 'border-b border-white/10 bg-navy-950/95 shadow-lg backdrop-blur-md'
            : 'border-b border-white/10 bg-navy-950/90 shadow-md backdrop-blur-md'
        )}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-6">
          <Logo logo={schoolInfo?.logo} name={schoolInfo?.name} shortName={schoolInfo?.shortName} />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {top.map((item) => {
              const kids = childrenByParent[item.id]
              if (kids?.length) {
                const isCurrentActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url)) ||
                  kids.some((k) => location.pathname === k.url || (k.url !== '/' && location.pathname.startsWith(k.url)))

                return (
                  <div key={item.id} className="group relative">
                    <Link
                      to={item.url}
                      className={cn(
                        'relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition',
                        isCurrentActive
                          ? 'text-white font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-gold-500'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {item.label}
                      <ChevronDown size={14} className={cn('transition-transform duration-200 group-hover:rotate-180', isCurrentActive ? 'text-gold-300' : 'text-white/60')} />
                    </Link>
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="w-64 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-2 shadow-dropdown">
                        {kids.map((k) => {
                          const isKidActive = location.pathname === k.url || (k.url !== '/' && location.pathname.startsWith(k.url))
                          return (
                            <Link
                              key={k.id}
                              to={k.url}
                              className={cn(
                                'flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition',
                                isKidActive
                                  ? 'bg-royal/10 text-royal font-semibold'
                                  : 'text-charcoal hover:bg-surface hover:text-royal'
                              )}
                            >
                              {k.label}
                              <ChevronDown size={12} className={cn('-rotate-90', isKidActive ? 'text-royal' : 'text-gold-500/70')} />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.id}
                  to={item.url}
                  end
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-lg px-3.5 py-2 text-sm font-medium transition',
                      isActive
                        ? 'text-white font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-gold-500'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Search the site"
              title="Search"
            >
              <SearchIcon size={18} />
            </button>
            <Link
              to="/contact"
              className="ml-2 inline-flex items-center justify-center rounded-lg bg-royal px-5 py-2.5 text-sm font-semibold text-white shadow-royal border border-white/15 transition hover:-translate-y-0.5 hover:bg-royal-hover active:scale-[0.98]"
            >
              {schoolInfo?.contactButtonLabel || 'Contact Us'}
            </Link>
          </nav>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 xl:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-navy-950 transition-all duration-400 xl:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div className="container-x flex-1 overflow-y-auto pb-16 pt-24">
          <div className="space-y-1">
            {top.map((item) => {
              const kids = childrenByParent[item.id]
              if (kids?.length) {
                const isCurrentActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url)) ||
                  kids.some((k) => location.pathname === k.url || (k.url !== '/' && location.pathname.startsWith(k.url)))
                const isOpen = openAccordion === item.id || (openAccordion === null && isCurrentActive)
                return (
                  <div key={item.id} className="border-b border-white/10 pb-1">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        to={item.url}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'text-lg font-medium transition',
                          isCurrentActive ? 'text-gold-300 font-semibold' : 'text-white hover:text-gold-300'
                        )}
                      >
                        {item.label}
                      </Link>
                      <button
                        className="p-2 text-gold-400"
                        onClick={() => setOpenAccordion(openAccordion === item.id ? false : item.id)}
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        <ChevronDown size={18} className={cn('transition-transform', isOpen && 'rotate-180')} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="space-y-1 pl-4 pb-2">
                        {kids.map((k) => {
                          const isKidActive = location.pathname === k.url || (k.url !== '/' && location.pathname.startsWith(k.url))
                          return (
                            <Link
                              key={k.id}
                              to={k.url}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'block rounded-lg px-4 py-2 text-[15px] font-medium transition',
                                isKidActive
                                  ? 'bg-royal/20 text-gold-300 font-semibold border-l-2 border-gold-400'
                                  : 'text-navy-100 hover:bg-white/5 hover:text-gold-300'
                              )}
                            >
                              {k.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }
              const isActive = location.pathname === item.url
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block border-b border-white/10 py-3.5 text-lg font-medium transition',
                    isActive ? 'text-gold-300 font-semibold' : 'text-white hover:text-gold-300'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                setMobileOpen(false)
                setSearchOpen(true)
              }}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/10 px-4 py-3.5 text-left text-sm font-medium text-navy-100 transition hover:bg-white/5"
            >
              <SearchIcon size={16} className="text-gold-400" /> {schoolInfo?.searchPlaceholder || 'Search the site…'}
            </button>
            <Link to="/contact" className="btn-royal w-full">
              {schoolInfo?.contactButtonLabel || 'Contact Us'}
            </Link>
            <a
              href={`tel:${schoolInfo?.phone?.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-2.5 text-sm text-navy-100"
            >
              <Phone size={15} className="text-gold-400" /> {schoolInfo?.phone}
            </a>
            <a href={`mailto:${schoolInfo?.email}`} className="flex items-center gap-2.5 text-sm text-navy-100">
              <Mail size={15} className="text-gold-400" /> {schoolInfo?.email}
            </a>
          </div>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
