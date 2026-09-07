import { useState } from 'react'
import { MessageSquareText, Mail, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { cn } from '../lib/utils.js'

const CATEGORIES = ['General', 'Suggestion', 'Concern', 'Compliment', 'Complaint']
const PRIORITIES = ['Low', 'Medium', 'High']

const STATUS_TEXT = {
  submitted: 'We have received your feedback and it is now with our team.',
  under_review: 'Your feedback is being reviewed by the relevant department.',
  acknowledged: 'Our team has acknowledged your feedback and is responding.',
  resolved: 'This feedback has been resolved. Thank you.',
  closed: 'This feedback has been closed.'
}

export default function Feedback() {
  const { create, db } = useData()
  const info = db.schoolInfo
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'General',
    priority: 'Medium',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState({ id: '', email: '' })
  const [status, setStatus] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please complete your name, email, and message.')
      return
    }
    const ref = `FBK-${Date.now().toString().slice(-6)}`
    const rec = create('feedback', {
      ...form,
      ref,
      status: 'submitted',
      createdAt: new Date().toISOString()
    })
    setSubmitted(rec)
  }

  const handleTrack = (e) => {
    e.preventDefault()
    const rec = (db.feedback || []).find(
      (f) => f.ref?.toLowerCase() === tracking.id.trim().toLowerCase() && f.email?.toLowerCase() === tracking.email.trim().toLowerCase()
    )
    setStatus(rec ? { ...rec, statusText: STATUS_TEXT[rec.status] || STATUS_TEXT.submitted } : null)
  }

  return (
    <>
      <SeoHead
        title={info?.feedbackPageTitle || 'Parent Feedback'}
        description={info?.feedbackPageDescription || `Share a suggestion, concern, or compliment with the ${info?.name || 'school'} team.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Feedback' }]} />
          <p className="eyebrow">{info?.feedbackEyebrow || 'We Listen'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.feedbackHeading || 'Parent Feedback'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.feedbackSubheading || 'Share a suggestion, concern, or compliment. Every submission is acknowledged, reviewed, and responded to.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="card p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                <h3 className="mt-4 font-serif text-2xl font-semibold text-navy-900">Thank you, {submitted.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Your feedback has been received. Your reference is <strong className="text-navy-900">{submitted.ref}</strong> —
                  keep it to check the status below.
                </p>
                <button onClick={() => setSubmitted(null)} className="btn-outline mt-6">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-semibold text-navy-900">Submit feedback</h2>
                <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>

                {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="fb-name">Your name *</label>
                    <input id="fb-name" className="input" value={form.name} onChange={set('name')} placeholder="e.g. Mrs Adebayo" />
                  </div>
                  <div>
                    <label className="label" htmlFor="fb-email">Email *</label>
                    <input id="fb-email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="label" htmlFor="fb-cat">Category</label>
                    <select id="fb-cat" className="input" value={form.category} onChange={set('category')}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="fb-priority">Priority</label>
                    <select id="fb-priority" className="input" value={form.priority} onChange={set('priority')}>
                      {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="fb-subject">Subject</label>
                    <input id="fb-subject" className="input" value={form.subject} onChange={set('subject')} placeholder="Brief summary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="fb-message">Message *</label>
                    <textarea id="fb-message" className="input min-h-[140px] resize-y" value={form.message} onChange={set('message')} placeholder="Tell us more…" />
                  </div>
                </div>

                <button type="submit" className="btn-royal mt-6 w-full sm:w-auto">Submit feedback</button>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck size={13} /> Your details are shared only with the feedback team.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6">
              <h3 className="font-serif text-xl font-semibold text-navy-900">Track a submission</h3>
              <p className="mt-1 text-sm text-slate-500">Check the status of an existing submission using its reference.</p>
              <form onSubmit={handleTrack} className="mt-4 space-y-4">
                <div>
                  <label className="label" htmlFor="trk-id">Reference</label>
                  <input id="trk-id" className="input" value={tracking.id} onChange={(e) => setTracking((t) => ({ ...t, id: e.target.value }))} placeholder="e.g. FBK-483920" />
                </div>
                <div>
                  <label className="label" htmlFor="trk-email">Email used at submission</label>
                  <input id="trk-email" type="email" className="input" value={tracking.email} onChange={(e) => setTracking((t) => ({ ...t, email: e.target.value }))} placeholder="you@example.com" />
                </div>
                <button type="submit" className="btn-outline w-full">Check status</button>
              </form>

              {status && (
                <div className="mt-4 rounded-xl bg-navy-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-navy-900">Reference: {status.ref}</p>
                  <span className={cn('mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide', status.status === 'resolved' || status.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gold-100 text-gold-700')}>
                    {status.status}
                  </span>
                  <p className="mt-2 text-sm text-slate-600">{status.statusText}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-navy-900 p-6">
              <MessageSquareText size={24} className="text-gold-400" />
              <h3 className="mt-3 font-serif text-xl font-semibold text-white">Prefer to talk?</h3>
              <p className="mt-2 text-sm text-navy-100">
                {info?.feedbackContactText || 'Our parent liaison team is available Monday to Friday, 8:00–16:30.'}
              </p>
              <a href={`mailto:${info?.feedbackEmail || `parents${info?.emailDomain || '@highgate.sch.uk'}`}`} className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-300 transition hover:text-gold-400">
                <Mail size={15} /> {info?.feedbackEmail || `parents${info?.emailDomain || '@highgate.sch.uk'}`}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
