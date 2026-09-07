import { useEffect, useMemo, useState } from 'react'
import { Quote, Star, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import { cn } from '../lib/utils.js'

const inputCls = 'input'
const labelCls = 'label'

export function StarRating({ value, onChange, size = 16 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          aria-label={`${n} stars`}
          className={cn('transition', onChange ? 'hover:scale-110' : 'cursor-default')}
        >
          <Star size={size} className={cn(n <= value ? 'fill-gold-500 text-gold-500' : 'text-slate-300')} />
        </button>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { db, create } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', role: 'Parent', relationship: '', quote: '', rating: 5 })

  const approved = useMemo(
    () => (db.testimonials || []).filter((t) => t.approved).sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0) || new Date(b.createdAt) - new Date(a.createdAt)),
    [db.testimonials]
  )
  const featured = approved.filter((t) => t.featured)
  const grid = approved.length > 0 ? approved : []

  useEffect(() => {
    if (featured.length <= 1) return
    const t = setInterval(() => setFeaturedIndex((i) => (i + 1) % featured.length), 6000)
    return () => clearInterval(t)
  }, [featured.length])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const current = featured[featuredIndex] || null

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!form.name || !form.quote) return
    setSubmitting(true)
    try {
      await create('testimonials', {
        ...form,
        approved: false,
        featured: false,
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
      setForm({ name: '', role: 'Parent', relationship: '', quote: '', rating: 5 })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SeoHead
        title={info?.testimonialsPageTitle || 'Testimonials'}
        description={info?.testimonialsPageDescription || `Hear what parents, students, and teachers say about ${info?.name || 'Highgate School'}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Testimonials' }]} />
          <p className="eyebrow">Our Community</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">Testimonials</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            In their own words — parents, students, teachers, and visitors on life at {info?.shortName || info?.name || 'the school'}.
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            {current && (
              <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-8 shadow-cardHover sm:p-12">
                <Quote size={80} className="absolute -right-2 -top-2 text-white/5" />
                <div className="flex items-center gap-1">
                  <StarRating value={current.rating} />
                </div>
                <p className="mt-5 font-serif text-xl leading-relaxed text-navy-100 sm:text-2xl">"{current.quote}"</p>
                <div className="mt-7 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 font-serif text-lg font-semibold text-navy-900">
                    {(current.name || '?')[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{current.name}</p>
                    <p className="text-sm text-navy-200">{current.relationship || current.role}</p>
                  </div>
                </div>
                {featured.length > 1 && (
                  <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
                    <button
                      onClick={() => setFeaturedIndex((featuredIndex - 1 + featured.length) % featured.length)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-500 hover:text-navy-900"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-1.5">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setFeaturedIndex(i)}
                          aria-label={`Testimonial ${i + 1}`}
                          className={cn('h-1.5 rounded-full transition-all', i === featuredIndex ? 'w-6 bg-gold-500' : 'w-1.5 bg-white/25')}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setFeaturedIndex((featuredIndex + 1) % featured.length)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-500 hover:text-navy-900"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {grid.map((t, i) => (
                <Reveal key={t.id} delay={(i % 2) * 60}>
                  <div className="card-hover flex h-full flex-col p-6">
                    <StarRating value={t.rating} />
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">"{t.quote}"</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 font-serif text-base font-semibold text-gold-400">
                        {(t.name || '?')[0]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.relationship || t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-16">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">Share your experience</h2>
              <p className="mt-2 text-sm text-slate-500">
                We would love to hear from our community. Submissions are reviewed before publication.
              </p>
              {submitted && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                  Thank you! Your testimonial has been submitted and will appear after review.
                </div>
              )}
              <form onSubmit={submit} className="card mt-6 p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input className={inputCls} value={form.name} onChange={set('name')} required />
                  </div>
                  <div>
                    <label className={labelCls}>I am a…</label>
                    <select className={inputCls} value={form.role} onChange={set('role')}>
                      {['Parent', 'Student', 'Teacher', 'Visitor'].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Relationship / context</label>
                    <input className={inputCls} value={form.relationship} onChange={set('relationship')} placeholder="e.g. Parent of Year 8" />
                  </div>
                  <div>
                    <label className={labelCls}>Rating</label>
                    <div className="pt-2.5">
                      <StarRating value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} size={20} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Your testimonial *</label>
                    <textarea rows={4} className={inputCls} value={form.quote} onChange={set('quote')} required placeholder="What has Highgate meant to you or your family?" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-royal mt-6 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting Testimonial...
                    </>
                  ) : (
                    <>
                      <Quote size={16} /> Submit testimonial
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
