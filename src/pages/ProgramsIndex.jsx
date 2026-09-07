import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, BookOpen, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ProgramCard } from '../components/Cards.jsx'
import { cn } from '../lib/utils.js'

export default function ProgramsIndex() {
  const { publishedOnly, loading, db } = useData()
  const info = db.schoolInfo
  const [filter, setFilter] = useState('all')

  const programs = publishedOnly('programs', 'order')

  const levels = useMemo(() => {
    const list = Array.from(new Set(programs.map((p) => p.level).filter(Boolean)))
    return ['all', ...list]
  }, [programs])

  const filtered = useMemo(() => {
    if (filter === 'all') return programs
    return programs.filter((p) => p.level === filter)
  }, [programs, filter])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-navy-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="text-sm text-navy-300">Loading Academic Programmes...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SeoHead
        title="Academic Programmes"
        description={`Explore the academic pathways at ${info?.name || 'Highgate School'} — from Early Years foundation to Cambridge IGCSE and the IB Diploma.`}
      />

      <div className="relative overflow-hidden bg-navy-950 pb-20 pt-36">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-royal/25 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Academics', to: '/academics' }, { label: 'Programmes' }]} />
          <div className="mt-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-navy-900/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
              <Sparkles size={13} className="text-gold-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">Curriculum & Pathways</p>
            </div>
            <h1 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              Academic Programmes
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-200">
              A cohesive, globally accredited educational journey from age 3 to 18. Each stage combines intellectual rigour with personalised care to prepare students for top global universities.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface py-16">
        <div className="container-x">
          {levels.length > 2 && (
            <div className="mb-10 flex flex-wrap items-center gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition',
                    filter === lvl
                      ? 'bg-royal text-white shadow-royal'
                      : 'bg-white text-charcoal/80 border border-slate-200/80 hover:bg-slate-50 hover:text-navy-900'
                  )}
                >
                  {lvl === 'all' ? 'All Stages' : lvl}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Programmes Found"
              text="No academic programmes match the selected filter. Please check back soon."
              action={
                <button onClick={() => setFilter('all')} className="btn-royal">
                  View All Programmes
                </button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((program, idx) => (
                <Reveal key={program.id} delay={idx * 70} className="h-full">
                  <ProgramCard program={program} index={idx} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-16 rounded-2xl bg-navy-900 p-8 sm:p-12 shadow-xl border border-white/10">
            <div className="grid items-center gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
                  <GraduationCap size={15} /> Admissions & Entry Requirements
                </div>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-white sm:text-3xl">
                  Ready to Start Your Child’s Journey?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-100">
                  We welcome applications year-round for all year groups. Learn about age criteria, assessment dates, and schedule a tour of our campus.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <Link to="/apply" className="btn-royal">
                  Apply Online <ArrowRight size={16} />
                </Link>
                <Link to="/fees" className="btn-outline-light">
                  Tuition & Fees
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
