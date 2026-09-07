import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { StaffCard } from '../components/Cards.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Users } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function StaffDirectory() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [department, setDepartment] = useState('All')

  const staff = useMemo(() => publishedOnly('staff', 'order'), [publishedOnly])
  const departments = useMemo(() => {
    const set = new Set(staff.map((s) => s.department).filter(Boolean))
    return [...set]
  }, [staff])

  const filtered = department === 'All' ? staff : staff.filter((s) => s.department === department)
  const deptNames = (db.departments || []).reduce((acc, d) => ({ ...acc, [d.name]: d.name }), {})

  return (
    <>
      <SeoHead
        title={info?.staffDirectoryPageTitle || 'Staff Directory'}
        description={info?.staffDirectoryPageDescription || `Meet the teachers and leaders of ${info?.name || 'Highgate School'} — filter by department to find your team.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Staff Directory' }]} />
          <p className="eyebrow">{info?.staffDirectoryEyebrow || 'Our People'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.staffDirectoryHeading || 'Staff Directory'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.staffDirectorySubheading || `The teachers, leaders, and coaches who make ${info?.shortName || 'Highgate'} what it is.`}
          </p>
        </div>
      </div>

      <div className="bg-surface py-16">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setDepartment('All')}
              className={cn(
                'rounded-lg px-4 py-2 text-xs font-semibold transition',
                department === 'All' ? 'bg-royal text-white shadow-royal' : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
              )}
            >
              All Departments
            </button>
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDepartment(d)}
                className={cn(
                  'rounded-lg px-4 py-2 text-xs font-semibold transition',
                  department === d ? 'bg-royal text-white shadow-royal' : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
                )}
              >
                {deptNames[d] || d}
              </button>
            ))}
          </div>

          {loading ? (
            <GridSkeleton count={8} cols="sm:grid-cols-2 lg:grid-cols-4" aspect="aspect-[4/5]" />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No staff found" text="Try another department." />
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((s, i) => (
                <Reveal key={s.id} delay={i * 50} className="h-full">
                  <StaffCard staff={s} departmentName={deptNames[s.department]} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
