import { useMemo, useRef, useState } from 'react'
import { GraduationCap, Upload, Search, CheckCircle2, XCircle, FileText, PartyPopper, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { uid, cn } from '../lib/utils.js'
import { humanFileSize } from '../lib/media.js'

const STATUS_FLOW = [
  { key: 'received', label: 'Application received', color: 'text-sky-600' },
  { key: 'under_review', label: 'Under review', color: 'text-amber-600' },
  { key: 'assessment', label: 'Assessment & interview', color: 'text-gold-600' },
  { key: 'offered', label: 'Offer made', color: 'text-emerald-600' },
  { key: 'accepted', label: 'Enrolment confirmed', color: 'text-emerald-700' }
]

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

export default function Apply() {
  const { create, db } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const [tab, setTab] = useState('apply')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  const [form, setForm] = useState({
    studentFirstName: '',
    studentLastName: '',
    dob: '',
    gender: '',
    applyingForYear: '',
    currentSchool: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    country: '',
    statement: ''
  })
  const [documents, setDocuments] = useState([])
  const fileRef = useRef(null)

  const [statusRef, setStatusRef] = useState('')
  const [tracking, setTracking] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const years = useMemo(() => {
    const fromPrograms = (db.programs || []).map((p) => p.name).filter(Boolean)
    return [...new Set(['Early Years', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', ...fromPrograms])]
  }, [db.programs])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const addFiles = async (files) => {
    const list = Array.from(files || [])
    for (const file of list) {
      if (file.size > 3 * 1024 * 1024) {
        toast(`${file.name} is larger than 3MB and was skipped`, 'error')
        continue
      }
      const url = await readFileAsDataURL(file)
      setDocuments((d) => [...d, { id: uid('doc'), name: file.name, size: file.size, url }])
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.studentFirstName || !form.studentLastName || !form.parentEmail || !form.applyingForYear) return
    setSubmitting(true)
    const count = (db.applications || []).length + 1
    const year = new Date().getFullYear()
    const ref = `APP-${year}-${String(count).padStart(3, '0')}`
    setTimeout(() => {
      create('applications', {
        ref,
        ...form,
        documents,
        status: 'received',
        submittedAt: new Date().toISOString(),
        decisionNotes: ''
      })
      setSubmitting(false)
      setDone({ ref, email: form.parentEmail })
      setForm({
        studentFirstName: '', studentLastName: '', dob: '', gender: '', applyingForYear: '', currentSchool: '',
        parentName: '', parentEmail: '', parentPhone: '', address: '', country: '', statement: ''
      })
      setDocuments([])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }

  const track = (e) => {
    e.preventDefault()
    const ref = statusRef.trim()
    const found = (db.applications || []).find(
      (a) => a.ref?.toLowerCase() === ref.toLowerCase() || a.parentEmail?.toLowerCase() === ref.toLowerCase()
    )
    setTracking(found || null)
    setNotFound(!found)
  }

  const flowIndex = (status) => STATUS_FLOW.findIndex((s) => s.key === status)

  return (
    <>
      <SeoHead
        title={info?.applyPageTitle || 'Apply Online'}
        description={info?.applyPageDescription || `Apply to ${info?.name || 'Highgate School'} online — submit your application, upload documents, and track its status.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Admissions', to: '/admissions' }, { label: 'Apply Online' }]} />
          <p className="eyebrow">Admissions Portal</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">Apply Online</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Submit your application, upload supporting documents, and track progress — all in one place.
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 grid grid-cols-2 rounded-2xl bg-white p-1.5 shadow-card">
              {[
                ['apply', 'New application'],
                ['track', 'Check status']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-semibold transition',
                    tab === key ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-900'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'apply' ? (
              <div className="card p-8">
                {done && (
                  <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <PartyPopper size={32} className="mx-auto text-emerald-600" />
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-navy-900">Application submitted!</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Your reference is <strong className="text-navy-900">{done.ref}</strong>. A confirmation has been
                      sent to <strong className="text-navy-900">{done.email}</strong>. Keep this reference to check your
                      application status.
                    </p>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                  <div>
                    <p className="font-serif text-lg font-semibold text-navy-900">Student details</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>First name *</label>
                        <input className={inputCls} value={form.studentFirstName} onChange={set('studentFirstName')} required />
                      </div>
                      <div>
                        <label className={labelCls}>Last name *</label>
                        <input className={inputCls} value={form.studentLastName} onChange={set('studentLastName')} required />
                      </div>
                      <div>
                        <label className={labelCls}>Date of birth</label>
                        <input type="date" className={inputCls} value={form.dob} onChange={set('dob')} />
                      </div>
                      <div>
                        <label className={labelCls}>Gender</label>
                        <select className={inputCls} value={form.gender} onChange={set('gender')}>
                          <option value="">Select…</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Applying for year *</label>
                        <select className={inputCls} value={form.applyingForYear} onChange={set('applyingForYear')} required>
                          <option value="">Select year group…</option>
                          {years.map((y) => (
                            <option key={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Current school</label>
                        <input className={inputCls} value={form.currentSchool} onChange={set('currentSchool')} placeholder="Name of current school (if any)" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <p className="font-serif text-lg font-semibold text-navy-900">Parent / guardian details</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Parent / guardian name *</label>
                        <input className={inputCls} value={form.parentName} onChange={set('parentName')} required />
                      </div>
                      <div>
                        <label className={labelCls}>Email *</label>
                        <input type="email" className={inputCls} value={form.parentEmail} onChange={set('parentEmail')} required />
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <input className={inputCls} value={form.parentPhone} onChange={set('parentPhone')} />
                      </div>
                      <div>
                        <label className={labelCls}>Country</label>
                        <input className={inputCls} value={form.country} onChange={set('country')} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Address</label>
                        <input className={inputCls} value={form.address} onChange={set('address')} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <p className="font-serif text-lg font-semibold text-navy-900">Family statement</p>
                    <label className={labelCls}>Why {info?.shortName || info?.name || 'our school'}? (optional)</label>
                    <textarea
                      className={inputCls}
                      rows={4}
                      value={form.statement}
                      onChange={set('statement')}
                      placeholder={`Tell us about your child and why ${info?.shortName || info?.name || 'our school'} feels like the right school.`}
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <p className="font-serif text-lg font-semibold text-navy-900">Supporting documents</p>
                    <p className="mt-1 text-xs text-slate-500">Reports and references (optional, max 3MB per file). You can also send them later.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {documents.map((d) => (
                        <span key={d.id} className="flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-xs font-medium text-navy-800">
                          <FileText size={13} className="text-gold-600" /> {d.name} ({humanFileSize(d.size)})
                          <button type="button" onClick={() => setDocuments((list) => list.filter((x) => x.id !== d.id))} className="text-slate-400 hover:text-red-500" aria-label={`Remove ${d.name}`}>
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn-outline mt-4"
                    >
                      <Upload size={16} /> Upload document
                    </button>
                    <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-royal w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <GraduationCap size={17} /> Submit application
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    By submitting you agree to our <a href="/privacy-policy" className="text-gold-600 underline">privacy policy</a>. The admissions team replies within one working day.
                  </p>
                </form>
              </div>
            ) : (
              <div className="card p-8">
                <form onSubmit={track} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={statusRef}
                      onChange={(e) => setStatusRef(e.target.value)}
                      placeholder="Reference (e.g. APP-2026-001) or parent email"
                      className="input pl-10"
                      aria-label="Application reference"
                    />
                  </div>
                  <button type="submit" className="btn-navy shrink-0">Check status</button>
                </form>

                {notFound && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <XCircle size={18} /> No application found with that reference. Please check and try again.
                  </div>
                )}

                {tracking && (
                  <div className="mt-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-serif text-xl font-semibold text-navy-900">
                          {tracking.studentFirstName} {tracking.studentLastName}
                        </p>
                        <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-gold-300">{tracking.ref}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {tracking.applyingForYear} · Submitted {new Date(tracking.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    <ol className="mt-6 space-y-0">
                      {STATUS_FLOW.map((s, i) => {
                        const idx = flowIndex(tracking.status)
                        const doneStep = i <= idx
                        const closed = tracking.status === 'rejected'
                        return (
                          <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
                            {i < STATUS_FLOW.length - 1 && (
                              <span className={cn('absolute left-[13px] top-8 h-full w-0.5', doneStep && i < idx ? 'bg-gold-500' : 'bg-slate-200')} />
                            )}
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                doneStep ? 'bg-gold-500 text-navy-900' : 'bg-slate-100 text-slate-400'
                              )}
                            >
                              {i + 1}
                            </span>
                            <div className="pt-0.5">
                              <p className={cn('text-sm font-semibold', doneStep ? 'text-navy-900' : 'text-slate-400')}>{s.label}</p>
                              {i === idx && tracking.status === 'offered' && (
                                <p className="mt-1 text-xs text-emerald-600">An offer letter has been issued to your email. Congratulations!</p>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ol>

                    {tracking.status === 'rejected' && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <XCircle size={18} /> This application has been closed. Please contact admissions to discuss next steps.
                      </div>
                    )}
                    {tracking.status === 'accepted' && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle2 size={18} /> Welcome to {info?.shortName || info?.name || 'our school'}! Your enrolment is confirmed.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
