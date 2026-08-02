import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Send, X, Sparkles, MessageCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { stripHtml, truncate } from '../lib/utils.js'

const SUGGESTIONS = [
  'How do I apply for admission?',
  'What are the school fees?',
  'What are the school hours?',
  'Tell me about the IB programme',
  'When is the next Open Morning?',
  'How do I get a bus or transport?'
]

const HISTORY_KEY = 'aia_assistant_history'

function replyFor(input, ctx) {
  const q = input.toLowerCase()
  const { schoolInfo, fees, programs, events, notices, faqs } = ctx

  const has = (...words) => words.some((w) => q.includes(w))

  if (has('hello', 'hi', 'hey', 'good morning', 'good afternoon')) {
    return {
      text: `Hello! Welcome to ${schoolInfo?.name || 'Highgate School'}. I can help with admissions, fees, programmes, term dates, uniform, transport, and much more. What would you like to know?`,
      chips: ctx.suggestions
    }
  }

  if (has('phone', 'call', 'contact', 'email', 'address', 'reach', 'office')) {
    const hours = schoolInfo?.officeHours || schoolInfo?.contactPageHoursText || ''
    const hoursLine = hours ? `\n\nThe front office is open ${hours}.` : ''
    return {
      text: `You can reach us at:\n📞 ${schoolInfo?.phone}\n✉️ ${schoolInfo?.email}\n📍 ${schoolInfo?.address}${hoursLine}`,
      links: [{ label: 'Contact page', to: '/contact' }],
      chips: ['How do I apply for admission?', 'Book a campus visit']
    }
  }

  if (has('fee', 'fees', 'cost', 'tuition', 'price', 'pay', 'scholarship', 'bursar')) {
    const lines = (fees || []).slice(0, 4).map((f) => `• ${f.level}: ${f.academicYear} — see page for termly breakdown`)
    const scholarship = has('scholarship') ? `\n\nScholarships (academic, music, sport) cover 25–100% of fees for Years 7 and 12 entry.` : ''
    const paymentInfo = schoolInfo?.feesPaymentInfo || 'Fees are payable termly in advance; annual payment attracts a 2% discount.'
    return {
      text: `Fees vary by year group and term. Here are the structures on record:\n${lines.join('\n')}${scholarship}\n\n${paymentInfo}`,
      links: [{ label: 'Full fee details', to: '/fees' }],
      chips: ['What scholarships are available?', 'How do I apply for admission?']
    }
  }

  if (has('scholarship')) {
    return {
      text: `We offer academic, music, and sport scholarships for entry at Years 7 and 12, covering between 25% and 100% of tuition. Assessments take place in November (Year 12) and February (Year 7).\n\nCheck the notice board or contact admissions for the latest application deadlines.`,
      links: [{ label: 'Admissions & scholarships', to: '/admissions' }],
      chips: ['What are the school fees?', 'How do I apply for admission?']
    }
  }

  if (has('appl', 'admission', 'enrol', 'enroll', 'join', 'admit', 'entry')) {
    const name = schoolInfo?.shortName || schoolInfo?.name || 'our school'
    return {
      text: `Applying to ${name} is a four-step journey:\n1. Enquire & visit — every family tours campus first\n2. Submit the online application with student details and school reports\n3. Assessment & interview (age-appropriate)\n4. Offer & enrolment — usually within two weeks\n\nYou can apply online through the Admissions Portal.`,
      links: [
        { label: 'Apply online', to: '/apply' },
        { label: 'Admissions overview', to: '/admissions' }
      ],
      chips: ['What are the school fees?', 'What are the entry requirements?']
    }
  }

  if (has('tour', 'visit', 'open morning', 'open day', 'see the school')) {
    return {
      text: `We would love to show you around! We host monthly Open Mornings, and private campus tours can be arranged weekdays. You can also take our interactive virtual tour from anywhere.`,
      links: [
        { label: 'Book a visit', to: '/contact' },
        { label: 'Virtual tour', to: '/virtual-tour' }
      ],
      chips: ['How do I apply for admission?', 'What are the school hours?']
    }
  }

  if (has('curriculum', 'academic', 'programme', 'program', 'igcse', 'ib', 'cambridge', 'baccalaureate', 'subject')) {
    const names = (programs || []).map((p) => p.name).join(', ')
    const name = schoolInfo?.shortName || schoolInfo?.name || 'our school'
    return {
      text: `We offer a seamless international pathway:\n${names}\n\nProgrammes span Early Years through the Cambridge IGCSE and IB Diploma, with university counselling from Year 10.`,
      links: [{ label: 'Explore programmes', to: '/academics' }],
      chips: ['What are the school fees?', 'How do I apply for admission?']
    }
  }

  if (has('school hours', 'hours', 'start time', 'end time', 'open', 'school day')) {
    const hours = schoolInfo?.contactPageHoursText || schoolInfo?.officeHours || ''
    const hoursLine = hours ? `\n\nThe front office is open ${hours}.` : ''
    return {
      text: `The school day runs from 08:30 to 15:30 for most year groups. Early drop-off is available from 07:45, and after-school clubs continue until 17:30.${hoursLine}`,
      chips: ['What are the term dates?', 'How do I get a bus or transport?']
    }
  }

  if (has('term date', 'calendar', 'holiday', 'half-term', 'term begins', 'term ends')) {
    return {
      text: `All term dates, holidays, and assessment windows are published in our interactive academic calendar. You can switch between month, week, and day views, and export dates to Google or Outlook.`,
      links: [{ label: 'Academic calendar', to: '/calendar' }],
      chips: ['When is the next Open Morning?', 'What are the school hours?']
    }
  }

  if (has('uniform', 'dress', 'dress code')) {
    return {
      text: `The full uniform list for every year group — including suppliers and sizing guidance — is available in the Download Centre.`,
      links: [{ label: 'Uniform & dress code guide', to: '/downloads' }],
      chips: ['What are the school fees?', 'Is there a bus service?']
    }
  }

  if (has('bus', 'transport', 'travel', 'getting to school', 'shuttle')) {
    const name = schoolInfo?.shortName || schoolInfo?.name || 'the school'
    return {
      text: `Yes — ${name} runs door-to-door and hub-based bus services, with trained escorts on every route. Routes and pick-up times are confirmed termly with families.`,
      links: [{ label: 'Contact transport team', to: '/contact' }],
      chips: ['What are the school hours?', 'How do I apply for admission?']
    }
  }

  if (has('upcoming event', 'events', 'what\'s on', 'what is on', 'gala', 'festival', 'fair')) {
    const up = (events || [])
      .filter((e) => new Date(e.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3)
    const lines = up.length
      ? up.map((e) => `• ${truncate(e.title, 46)} — ${new Date(e.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`)
      : ['There are no confirmed events on record right now.']
    return {
      text: `Here are the next upcoming events:\n${lines.join('\n')}`,
      links: [{ label: 'All events', to: '/events' }],
      chips: ['What are the term dates?', 'Tell me about the IB programme']
    }
  }

  if (has('news', 'latest', 'newsletter')) {
    return {
      text: `Our newsroom covers the latest achievements, announcements, and stories from across the school community. You can also subscribe to our newsletter to receive updates by email.`,
      links: [
        { label: 'Read the news', to: '/news' },
        { label: 'Subscribe to newsletter', to: '/newsletter' }
      ],
      chips: ['What are the school fees?', 'How do I apply for admission?']
    }
  }

  if (has('download', 'prospectus', 'document', 'form', 'handbook')) {
    return {
      text: `The Download Centre has prospectuses, fee brochures, term dates, admission forms, policies, and the parent handbook — all free to download.`,
      links: [{ label: 'Download Centre', to: '/downloads' }],
      chips: ['What are the school fees?', 'How do I apply for admission?']
    }
  }

  if (has('notice', 'announcement', 'board')) {
    const active = (notices || []).filter((n) => n.status !== 'archived' && n.isVisible !== false).slice(0, 3)
    const lines = active.length
      ? active.map((n) => `• ${truncate(n.title, 60)}`)
      : ['No active notices right now.']
    return {
      text: `Live notice board — latest items:\n${lines.join('\n')}`,
      links: [{ label: 'View notice board', to: '/notices' }],
      chips: ['What are the term dates?', 'What are the school fees?']
    }
  }

  if (has('library', 'book', 'ebook', 'e-book', 'read')) {
    return {
      text: `Our digital library offers e-books, past papers, study notes, magazines, and audio/video lessons — browsable by category with free downloads for our community.`,
      links: [{ label: 'Digital library', to: '/library' }],
      chips: ['How do I download the prospectus?', 'Tell me about the IB programme']
    }
  }

  if (has('magazine', 'school magazine')) {
    const name = schoolInfo?.shortName || schoolInfo?.name || 'the school'
    return {
      text: `The ${name} magazine is published in editions and features interviews, student writing, and photography from across the school.`,
      links: [{ label: 'Read the magazine', to: '/magazine' }],
      chips: ['Tell me about the IB programme', 'What are the school fees?']
    }
  }

  if (has('career', 'job', 'vacan', 'work', 'teach', 'apply to teach', 'hiring', 'position')) {
    return {
      text: `We advertise teaching, administrative, and support vacancies on our Careers page, where you can apply online and upload your CV. Applications are reviewed by the relevant department.`,
      links: [{ label: 'Current vacancies', to: '/careers' }],
      chips: ['What are the school hours?', 'How do I apply for admission?']
    }
  }

  if (has('feedback', 'complaint', 'suggestion', 'concern')) {
    return {
      text: `We value your feedback. You can submit a suggestion, concern, or meeting request through the Parent Feedback system — it is assigned to the right team and you can track its status.`,
      links: [{ label: 'Share feedback', to: '/feedback' }],
      chips: ['How do I apply for admission?', 'What are the school fees?']
    }
  }

  if (has('emergency', 'closure', 'alert', 'snow', 'weather', 'safety')) {
    return {
      text: `In an emergency, our Emergency Information Centre publishes closure notices, weather advisories, and security alerts instantly. Families are also contacted by email and text.`,
      links: [{ label: 'Emergency information', to: '/emergency' }],
      chips: ['What are the term dates?', 'What are the school hours?']
    }
  }

  if (has('campus', 'map', 'where is', 'facilities', 'located')) {
    return {
      text: `Our interactive campus map lets you explore classrooms, labs, the library, sports facilities, and more — with zoom, search, and clickable locations.`,
      links: [{ label: 'Interactive campus map', to: '/campus-map' }],
      chips: ['Book a campus visit', 'What are the school hours?']
    }
  }

  if (has('statistic', 'numbers', 'results', 'pass rate', 'ratio', 'how many students')) {
    return {
      text: `Our statistics dashboard brings the school to life with animated counters — students, nationalities, IB pass rate, university placements, and more.`,
      links: [{ label: 'School statistics', to: '/statistics' }],
      chips: ['Tell me about the IB programme', 'How do I apply for admission?']
    }
  }

  if (has('testimonial', 'review', 'what do parents', 'parent say')) {
    return {
      text: `Hear from parents, students, and teachers in their own words on our Testimonials page — the community really is our best advocate.`,
      links: [{ label: 'Read testimonials', to: '/testimonials' }],
      chips: ['How do I apply for admission?', 'Book a campus visit']
    }
  }

  if (has('faq', 'question', 'help')) {
    const top = (faqs || []).slice(0, 3).map((f) => `• ${f.question}`)
    return {
      text: `Here are popular questions from our FAQ:\n${top.join('\n')}`,
      links: [{ label: 'Browse all FAQs', to: '/faq' }],
      chips: ctx.suggestions
    }
  }

  if (has('staff', 'teacher', 'principal', 'head of school', 'who is')) {
    return {
      text: `Meet our staff directory — from the Senior Leadership Team to every department — with full profiles and contact details.`,
      links: [{ label: 'Staff directory', to: '/staff' }],
      chips: ['How do I apply for admission?', 'What are the school fees?']
    }
  }

  if (has('thank', 'thanks')) {
    return {
      text: `You're very welcome! Is there anything else I can help you with?`,
      chips: SUGGESTIONS
    }
  }

  return {
    text: `I'm not 100% sure about that one yet — I'm still learning. If you'd like, you can browse the FAQ, use site search, or ask our team directly and a real person will reply within one working day.`,
    links: [
      { label: 'Search the site', to: '/search' },
      { label: 'Contact our team', to: '/contact' }
    ],
    chips: ctx.suggestions
  }
}

export default function AssistantWidget() {
  const { db } = useData()
  const info = db.schoolInfo
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  const suggestions = info?.assistantSuggestions?.length ? info.assistantSuggestions : SUGGESTIONS

  const ctx = useMemo(
    () => ({
      schoolInfo: db.schoolInfo,
      fees: db.fees || [],
      programs: db.programs || [],
      events: db.events || [],
      notices: db.notices || [],
      faqs: db.faqs || [],
      downloads: db.downloads || [],
      suggestions
    }),
    [db, suggestions]
  )

  useEffect(() => {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-40)))
    } catch {
      /* ignore */
    }
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  const ask = (raw) => {
    const text = (raw || '').trim()
    if (!text) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setTyping(true)
    const reply = replyFor(text, ctx)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', ...reply }])
      setTyping(false)
    }, 550)
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cardHover animate-scale-in sm:right-6">
          <div className="flex items-center gap-3 bg-navy-900 px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900">
              <Bot size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base font-semibold text-white">{info?.assistantTitle || 'Assistant'}</p>
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {info?.assistantSubtitle || 'Online — answers instantly'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-navy-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X size={17} />
            </button>
          </div>

          <div ref={scrollRef} className="h-80 space-y-3 overflow-y-auto bg-cream p-4">
            {messages.length === 0 && (
              <div className="rounded-2xl rounded-tl-sm bg-white p-4 shadow-card">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-600">
                  <Sparkles size={13} /> {info?.assistantWelcome || 'Hi, I\'m the Assistant'}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {info?.assistantWelcomeText || `I can help you with admissions, fees, programmes, term dates, transport, and more — powered by the school's live data.`}
                </p>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gold-500 px-4 py-2.5 text-sm font-medium text-navy-900 shadow-card">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-card">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{m.text}</p>
                    {m.links?.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.links.map((l) => (
                          <Link
                            key={l.to}
                            to={l.to}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition hover:bg-gold-100"
                          >
                            {l.label} <ArrowRight size={12} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-card">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-500"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-slate-400 shadow-card transition hover:text-navy-900"
              >
                <RotateCcw size={11} /> {info?.assistantClearLabel || 'Clear conversation'}
              </button>
            )}
          </div>

          {messages.length === 0 && (
            <div className="border-t border-slate-100 bg-white px-4 py-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{info?.assistantSuggestionsLabel || 'Try asking'}</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-800 transition hover:border-gold-400 hover:bg-gold-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={info?.assistantPlaceholder || 'Ask me anything...'}
              className="input"
              aria-label="Ask the assistant"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white transition hover:bg-navy-800"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Open School Assistant'}
        className="fixed bottom-6 right-4 z-[70] flex items-center gap-2 rounded-full bg-gold-500 px-5 py-4 font-semibold text-navy-900 shadow-gold transition hover:-translate-y-0.5 hover:bg-gold-400 sm:right-6"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && <span className="hidden text-sm sm:inline">{info?.assistantButtonLabel || 'Ask Assistant'}</span>}
      </button>
    </>
  )
}
