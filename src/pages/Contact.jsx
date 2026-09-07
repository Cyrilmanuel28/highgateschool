import { useMemo, useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Contact() {
  const { db, create, getSingle } = useData()
  const { toast } = useToast()
  const info = db.schoolInfo
  const settings = useMemo(() => getSingle('settings'), [getSingle])
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast('Please complete the required fields', 'error')
      return
    }
    create('messages', {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || 'General enquiry',
      message: form.message.trim(),
      submittedAt: new Date().toISOString(),
      isRead: false
    })
    setSent(true)
    toast('Message sent — we will be in touch within one working day')
  }

  return (
    <>
      <SeoHead
        title={info?.contactPageTitle || 'Contact Us'}
        description={info?.contactPageDescription || `Contact ${info?.name} — ${info?.phone}, ${info?.email}, ${info?.address}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: info?.contactBreadcrumbLabel || 'Contact' }]} />
          <p className="eyebrow">{info?.contactEyebrow || 'Get in Touch'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.contactHeading || 'Contact Us'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.contactSubheading || 'Questions about admissions, tours, or anything else — we would love to hear from you.'}
          </p>
        </div>
      </div>

      <div className="bg-surface py-16">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <Reveal>
              <div className="card p-7">
                <h2 className="font-serif text-2xl font-semibold text-navy-900">{info?.contactReachUsHeading || 'Reach Us Directly'}</h2>
                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-royal/10 border border-royal/20 text-royal">
                      <MapPin size={19} />
                    </span>
                    <div>
                      <p className="font-semibold text-navy-900">Visit Us</p>
                      <p className="mt-1 leading-relaxed text-charcoal/80">{info?.address}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-royal/10 border border-royal/20 text-royal">
                      <Phone size={19} />
                    </span>
                    <div>
                      <p className="font-semibold text-navy-900">Call Us</p>
                      <a href={`tel:${info?.phone?.replace(/[^+\d]/g, '')}`} className="mt-1 block text-charcoal/80 hover:text-royal">
                        {info?.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-royal/10 border border-royal/20 text-royal">
                      <Mail size={19} />
                    </span>
                    <div>
                      <p className="font-semibold text-navy-900">Email Us</p>
                      <a href={`mailto:${info?.email}`} className="mt-1 block text-charcoal/80 hover:text-royal">
                        {info?.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-royal/10 border border-royal/20 text-royal">
                      <Clock size={19} />
                    </span>
                    <div>
                      <p className="font-semibold text-navy-900">{info?.contactOfficeHoursLabel || 'Office Hours'}</p>
                      <p className="mt-1 text-charcoal/80">{info?.officeHours || 'Monday–Friday, 7:30–17:30'}</p>
                      {info?.saturdayHours && <p className="text-charcoal/80">{info.saturdayHours}</p>}
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-xl2 shadow-cardHover">
                <iframe
                  title="School location"
                  src={info?.mapEmbedUrl || 'https://www.openstreetmap.org/export/embed.html?bbox=-0.1575%2C51.5230%2C-0.1275%2C51.5330&layer=mapnik'}
                  className="h-64 w-full border-0"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-3">
            <div className="card p-8 sm:p-10">
              {sent ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <CheckCircle2 size={32} />
                  </span>
                  <h2 className="mt-6 font-serif text-3xl font-semibold text-navy-900">{info?.contactSuccessHeading || 'Message Sent'}</h2>
                  <p className="mt-3 max-w-sm text-slate-600">
                    {info?.contactSuccessMessage || `Thank you, ${form.name.split(' ')[0] || 'friend'}. We will reply to ${form.email} within one working day.`}
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline mt-8">
                    {info?.contactSendAnotherLabel || 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-semibold text-navy-900">{info?.contactFormHeading || 'Send a Message'}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {info?.contactFormSubheading || 'For admissions enquiries, mention the year group you are applying to.'}
                  </p>
                  <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="c-name">Full Name *</label>
                      <input
                        id="c-name"
                        className="input"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-email">Email Address *</label>
                      <input
                        id="c-email"
                        type="email"
                        className="input"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-subject">Subject</label>
                      <input
                        id="c-subject"
                        className="input"
                        placeholder="Admissions enquiry — Year 7"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-message">Message *</label>
                      <textarea
                        id="c-message"
                        rows={6}
                        className="input resize-none"
                        placeholder="Tell us a little about your family and what you'd like to know…"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" className="btn-royal w-full sm:w-auto">
                        <Send size={16} /> Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
