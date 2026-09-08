import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  GraduationCap, ArrowLeft, ArrowRight, BookOpen, Clock, Calendar, CheckCircle2,
  FileText, Sparkles, HelpCircle, Phone, Mail
} from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import NotFound from './NotFound.jsx'
import { slugify } from '../lib/utils.js'

export default function ProgramDetail() {
  const { id } = useParams()
  const { publishedOnly, loading, db } = useData()
  const info = db.schoolInfo

  const programs = publishedOnly('programs', 'order')

  const program = useMemo(() => {
    if (!id) return null
    return programs.find((p) => p.id === id || p.slug === id || slugify(p.name) === id)
  }, [programs, id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-navy-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="text-sm text-navy-300">Loading programme details...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return <NotFound />
  }

  const otherPrograms = programs.filter((p) => p.id !== program.id).slice(0, 3)

  return (
    <>
      <SeoHead
        title={`${program.name} (${program.level})`}
        description={program.description || `${program.name} curriculum at ${info?.name || 'Highgate School'}.`}
      />

      <div className="relative overflow-hidden bg-navy-950 pb-20 pt-36">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-royal/25 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs
            items={[
              { label: 'Academics', to: '/academics' },
              { label: 'Programmes', to: '/programs' },
              { label: program.name }
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-navy-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-200 backdrop-blur-md shadow-sm">
              <GraduationCap size={15} /> {program.level}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {program.curriculum}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            {program.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200">
            {program.description}
          </p>
        </div>
      </div>

      <div className="bg-surface py-8 sm:py-16">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div className="card p-8 sm:p-10">
                <h2 className="font-serif text-2xl font-semibold text-navy-900 sm:text-3xl">
                  Curriculum Overview & Educational Philosophy
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-6 text-base leading-relaxed text-charcoal/85">
                  The {program.name} curriculum represents our commitment to academic excellence, inquiry-driven learning, and holistic character development. Delivered within a supportive, bilingual, and internationally minded environment, students are challenged to think critically, collaborate across cultures, and discover their individual intellectual passions.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/80 bg-surface p-5">
                    <div className="flex items-center gap-3 font-serif text-lg font-semibold text-navy-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal">
                        <CheckCircle2 size={18} />
                      </span>
                      Inquiry-Based Learning
                    </div>
                    <p className="mt-2 text-sm text-charcoal/80">
                      Students investigate real-world questions, formulate hypotheses, and present evidence-based solutions.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-surface p-5">
                    <div className="flex items-center gap-3 font-serif text-lg font-semibold text-navy-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal">
                        <Sparkles size={18} />
                      </span>
                      Global Accreditation
                    </div>
                    <p className="mt-2 text-sm text-charcoal/80">
                      Accredited curriculum aligned with international standards: {program.curriculum}.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-surface p-5">
                    <div className="flex items-center gap-3 font-serif text-lg font-semibold text-navy-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal">
                        <BookOpen size={18} />
                      </span>
                      Individual Mentorship
                    </div>
                    <p className="mt-2 text-sm text-charcoal/80">
                      Small seminar cohorts guarantee personalized attention and continuous academic progress tracking.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-surface p-5">
                    <div className="flex items-center gap-3 font-serif text-lg font-semibold text-navy-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal/10 text-royal">
                        <GraduationCap size={18} />
                      </span>
                      Higher Pathway Ready
                    </div>
                    <p className="mt-2 text-sm text-charcoal/80">
                      Seamless transition to the subsequent academic stage and world-leading university admissions.
                    </p>
                  </div>
                </div>

                <div className="mt-10 rounded-xl bg-navy-900 p-6 sm:p-8 text-white">
                  <h3 className="font-serif text-xl font-semibold">Join the {program.name} Cohort</h3>
                  <p className="mt-2 text-sm text-navy-100">
                    Admissions are open for upcoming term starts. Early registration is encouraged to secure your place.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link to="/apply" className="btn-royal">
                      Start Application <ArrowRight size={16} />
                    </Link>
                    <Link to="/fees" className="btn-outline-light">
                      View Tuition & Fees
                    </Link>
                  </div>
                </div>
              </div>

              {otherPrograms.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-navy-900">
                    Other Academic Programmes
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {otherPrograms.map((op) => (
                      <Link
                        key={op.id}
                        to={`/programs/${op.slug || op.id}`}
                        className="card-hover group flex flex-col justify-between p-5"
                      >
                        <div>
                          <span className="inline-block rounded bg-royal/10 px-2.5 py-1 text-[11px] font-semibold text-royal">
                            {op.level}
                          </span>
                          <h4 className="mt-3 font-serif text-lg font-semibold text-navy-900 group-hover:text-royal transition-colors">
                            {op.name}
                          </h4>
                          <p className="mt-2 line-clamp-2 text-xs text-charcoal/70">{op.description}</p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-royal">
                          Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="card p-7">
                <h3 className="font-serif text-xl font-semibold text-navy-900">Programme Details</h3>
                <div className="mt-5 divide-y divide-slate-100 text-sm">
                  <div className="flex justify-between py-3">
                    <span className="text-charcoal/70">Stage / Level</span>
                    <span className="font-semibold text-navy-900">{program.level}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-charcoal/70">Curriculum</span>
                    <span className="font-semibold text-navy-900 text-right">{program.curriculum}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-charcoal/70">Class Size</span>
                    <span className="font-semibold text-navy-900">1:8 Ratio</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-charcoal/70">Language</span>
                    <span className="font-semibold text-navy-900">English + Mother Tongue</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-charcoal/70">Admissions</span>
                    <span className="font-semibold text-emerald-600">Open Year-Round</span>
                  </div>
                </div>

                <Link to="/apply" className="btn-royal mt-6 w-full">
                  Apply for {program.name}
                </Link>
                <Link to="/contact" className="btn-outline mt-3 w-full">
                  Book a Campus Visit
                </Link>
              </div>

              <div className="rounded-2xl bg-navy-900 p-7 text-white shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400">
                  <HelpCircle size={22} />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">Need Guidance?</h3>
                <p className="mt-2 text-sm text-navy-100">
                  Our academic admissions advisors are here to help you select the ideal programme and placement level.
                </p>
                <div className="mt-5 space-y-2.5 text-xs text-navy-200">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gold-400" /> {info?.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-gold-400" /> {info?.email}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
