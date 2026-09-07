import { useMemo, useRef, useState } from 'react'
import { Briefcase, MapPin, Clock, ChevronDown, Upload, CheckCircle2, FileText, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn, uid, formatDate } from '../lib/utils.js'
import { humanFileSize } from '../lib/media.js'

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const inputCls = 'input'
const labelCls = 'label'

export default function Careers() {
  const { db, create } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' })
  const [cv, setCv] = useState(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef(null)

  const vacancies = useMemo(
    () =>
      (db.vacancies || [])
        .filter((v) => v.isOpen !== false && v.status === 'published')
        .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)),
    [db.vacancies]
  )

  const closed = useMemo(() => (db.vacancies || []).filter((v) => v.isOpen === false), [db.vacancies])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const pickCv = async (file) => {
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      toast('The CV is larger than 3MB and was not uploaded', 'error')
      return
    }
    setCv({ name: file.name, size: file.size, url: await readFileAsDataURL(file) })
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !selected) return
    setSubmitting(true)
    setTimeout(() => {
      create('jobApplications', {
        vacancyId: selected.id,
        vacancyTitle: selected.title,
        ...form,
        cvUrl: cv?.url || '',
        status: 'received',
        appliedAt: new Date().toISOString()
      })
      setSubmitting(false)
      setDone(true)
      setForm({ name: '', email: '', phone: '', coverLetter: '' })
      setCv(null)
      setSelected(null)
    }, 500)
  }

  return (
    <>
      <SeoHead
        title={info?.careersPageTitle || `Careers at ${info?.shortName || info?.name || 'the school'}`}
        description={info?.careersPageDescription || `Join the team at ${info?.name || 'our school'} — current teaching, administrative, and support vacancies.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Careers' }]} />
          <p className="eyebrow">{info?.careersEyebrow || 'Work With Us'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.careersHeading || `Careers at ${info?.shortName || info?.name || 'the school'}`}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.careersSubheading || 'Join a team of exceptional educators and professionals from six continents.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
              <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Why teach at {info?.shortName || info?.name || 'our school'}?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-navy-100">
                Professional development budgets for every teacher, small classes, outstanding facilities, and a community
                that treats staff as family. We are an equal-opportunity employer committed to safeguarding.
              </p>
            </div>

            {done && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 size={30} className="mx-auto text-emerald-600" />
                <h3 className="mt-2 font-serif text-xl font-semibold text-navy-900">Application received</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Thank you — our recruitment team will review your application and be in touch about next steps.
                </p>
              </div>
            )}

            <div className="mt-12">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">Open vacancies</h2>
              {vacancies.length === 0 ? (
                <div className="mt-6">
                  <EmptyState icon={Briefcase} title="No open vacancies" text={`We are always interested in hearing from exceptional teachers — email ${info?.careersEmail || `hr${info?.emailDomain || '@highgate.sch.uk'}`} with your CV.`} />
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {vacancies.map((v, i) => (
                    <Reveal key={v.id} delay={i * 60}>
                      <div className="card overflow-hidden">
                        <button
                          className="flex w-full flex-col gap-3 p-6 text-left transition hover:bg-navy-50 sm:flex-row sm:items-center sm:justify-between"
                          onClick={() => setSelected(selected?.id === v.id ? null : v)}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-gold-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-700">{v.type}</span>
                              <span className="rounded-full bg-navy-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-700">{v.department}</span>
                            </div>
                            <h3 className="mt-2.5 font-serif text-xl font-semibold text-navy-900">{v.title}</h3>
                            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gold-600" /> {v.location}</span>
                              <span className="flex items-center gap-1.5"><Clock size={13} className="text-gold-600" /> {v.contract}</span>
                              <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-gold-600" /> {v.salary}</span>
                            </div>
                          </div>
                          <span className={cn('flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition', selected?.id === v.id ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600')}>
                            {selected?.id === v.id ? 'Close' : 'Apply'} <ChevronDown size={14} className={cn('transition-transform', selected?.id === v.id && 'rotate-180')} />
                          </span>
                        </button>

                        {selected?.id === v.id && (
                          <div className="border-t border-slate-100 p-6">
                            <p className="text-sm leading-relaxed text-slate-600">{v.summary}</p>
                            <div className="mt-5 grid gap-6 sm:grid-cols-2">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Responsibilities</p>
                                <ul className="mt-2 space-y-1.5">
                                  {(v.responsibilities || []).map((r, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" /> {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Requirements</p>
                                <ul className="mt-2 space-y-1.5">
                                  {(v.qualifications || []).map((r, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" /> {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400">Closing date: {formatDate(v.closingDate)}</p>
                          </div>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-14" id="apply">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">Apply for a role</h2>
              {!selected && vacancies.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">Select a vacancy above to reveal the application form.</p>
              )}
              {selected && (
                <form onSubmit={submit} className="card mt-6 p-8">
                  <p className="mb-6 rounded-xl bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
                    Applying for: <strong>{selected.title}</strong>
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full name *</label>
                      <input className={inputCls} value={form.name} onChange={set('name')} required />
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input type="email" className={inputCls} value={form.email} onChange={set('email')} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Phone</label>
                      <input className={inputCls} value={form.phone} onChange={set('phone')} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Cover letter</label>
                      <textarea rows={4} className={inputCls} value={form.coverLetter} onChange={set('coverLetter')} placeholder="Why are you a good fit for this role?" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>CV (max 3MB)</label>
                      {cv && (
                        <span className="mb-2 flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-xs font-medium text-navy-800">
                          <FileText size={13} className="text-gold-600" /> {cv.name} ({humanFileSize(cv.size)})
                          <button type="button" onClick={() => setCv(null)} className="ml-auto text-slate-400 hover:text-red-500" aria-label="Remove CV">
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                      <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline">
                        <Upload size={16} /> {cv ? 'Replace CV' : 'Upload CV'}
                      </button>
                      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => pickCv(e.target.files?.[0])} />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-royal mt-6 w-full">
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </button>
                </form>
              )}

              {closed.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-serif text-xl font-semibold text-navy-900">Recently closed</h3>
                  <div className="mt-3 space-y-2">
                    {closed.map((v) => (
                      <div key={v.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/60 px-5 py-3.5 opacity-70">
                        <span className="text-sm font-medium text-navy-900">{v.title}</span>
                        <span className="text-xs text-slate-400">{v.department} · closed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
