import { useMemo, useState } from 'react'
import { MapPin, Search, Plus, Minus, DoorOpen, FlaskConical, BookOpen, Pencil, Leaf, GraduationCap, Trophy, Waves, TreePine, Coffee, Briefcase, Music } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { cn } from '../lib/utils.js'

const CATEGORIES = ['All', 'Academic', 'Sports', 'Community', 'Arts & Community', 'Administration', 'Services']

const ICONS = {
  door: DoorOpen,
  flask: FlaskConical,
  book: BookOpen,
  pencil: Pencil,
  leaf: Leaf,
  graduation: GraduationCap,
  trophy: Trophy,
  waves: Waves,
  tree: TreePine,
  coffee: Coffee,
  briefcase: Briefcase,
  music: Music
}

const CAT_COLORS = {
  Academic: 'bg-navy-900 text-gold-300',
  Sports: 'bg-emerald-600 text-white',
  Community: 'bg-gold-500 text-navy-900',
  'Arts & Community': 'bg-pink-600 text-white',
  Administration: 'bg-sky-600 text-white',
  Services: 'bg-purple-600 text-white'
}

export default function CampusMap() {
  const { db, loading } = useData()
  const info = db.schoolInfo
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [zoom, setZoom] = useState(1)

  const locations = useMemo(
    () =>
      (db.campusLocations || []).filter((l) => {
        if ((l.status !== undefined && l.status !== 'published') || l.isVisible === false) return false
        if (category !== 'All' && l.category !== category) return false
        if (query.trim() && !`${l.name} ${l.description} ${l.category}`.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [db.campusLocations, category, query]
  )

  return (
    <>
      <SeoHead
        title={info?.campusMapPageTitle || 'Campus Map'}
        description={info?.campusMapPageDescription || `Explore the ${info?.name || 'school'} campus — classrooms, labs, library, sports, and more.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Campus Map' }]} />
          <p className="eyebrow">{info?.campusMapEyebrow || 'Explore the Campus'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.campusMapHeading || 'Campus Map'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.campusMapSubheading || `Click a marker to explore the buildings and spaces of ${info?.shortName || info?.name || 'the school'}. Zoom, search, and filter by category.`}
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold transition',
                    category === c ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 shadow-card hover:text-navy-900'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search locations…"
                className="input pl-10"
                aria-label="Search campus locations"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#eef2e6] shadow-card">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                  {/* stylized grounds */}
                  <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <rect width="100" height="62.5" fill="#eef2e6" />
                    <rect x="0" y="0" width="100" height="10" fill="#d8e3c8" />
                    <rect x="0" y="52" width="100" height="10.5" fill="#d8e3c8" />
                    <rect x="0" y="24" width="100" height="2" fill="#cfd8c0" />
                    <circle cx="88" cy="50" r="8" fill="#9cc0e5" opacity="0.6" />
                    <rect x="0" y="14" width="46" height="4" rx="1" fill="#c9d6f0" />
                    <rect x="4" y="2" width="52" height="6" rx="1" fill="#c9d6f0" />
                    <rect x="60" y="8" width="36" height="6" rx="1" fill="#c9d6f0" />
                  </svg>

                  {/* markers */}
                  {locations.map((l) => {
                    const Icon = ICONS[l.icon] || MapPin
                    const active = selected?.id === l.id
                    return (
                      <button
                        key={l.id}
                        onClick={() => setSelected(l)}
                        style={{ left: `${l.x}%`, top: `${l.y}%`, transform: `translate(-50%, -50%) scale(${zoom})` }}
                        className={cn(
                          'absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-cardHover transition-all hover:scale-110',
                          CAT_COLORS[l.category] || 'bg-navy-900 text-white',
                          active && 'ring-4 ring-gold-500/60 scale-110'
                        )}
                        aria-label={l.name}
                        title={l.name}
                      >
                        <Icon size={15} />
                      </button>
                    )
                  })}

                  {/* zoom controls */}
                  <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                    <button onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-900 shadow-card transition hover:bg-navy-900 hover:text-white" aria-label="Zoom in">
                      <Plus size={16} />
                    </button>
                    <button onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-900 shadow-card transition hover:bg-navy-900 hover:text-white" aria-label="Zoom out">
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">Illustrative plan · not to scale. Tap a marker to see details.</p>
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                <div className="card sticky top-28 overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
                    <img src={selected.featuredImage} alt={selected.name} className="h-full w-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                    <span className={cn('absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide', CAT_COLORS[selected.category])}>
                      {selected.category}
                    </span>
                    <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl font-semibold text-white">{selected.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-relaxed text-slate-600">{selected.description}</p>
                    {selected.floor && <p className="mt-3 text-xs font-medium text-gold-600">Floor: {selected.floor}</p>}
                    <button onClick={() => setSelected(null)} className="btn-outline mt-5 w-full">Close</button>
                  </div>
                </div>
              ) : (
                <div className="card p-6">
                  <h3 className="font-serif text-lg font-semibold text-navy-900">Campus locations</h3>
                  <ul className="mt-4 max-h-[420px] space-y-1 overflow-y-auto pr-1">
                    {locations.map((l) => {
                      const Icon = ICONS[l.icon] || MapPin
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() => setSelected(l)}
                            className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-navy-50"
                          >
                            <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', CAT_COLORS[l.category])}>
                              <Icon size={14} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-navy-900">{l.name}</span>
                              <span className="block truncate text-xs text-slate-500">{l.description}</span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
