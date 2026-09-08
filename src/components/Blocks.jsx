import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Globe2, HeartHandshake, Sparkles, Phone, Mail, ShieldCheck, Music4, Trophy,
  Users, Baby, BookOpen, Compass, Camera, Target, Award, Quote as QuoteIcon, CalendarDays,
  ChevronRight, MapPin, Lightbulb, Handshake, Eye, Star, Brain, Leaf, HandHelping, Zap
} from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import Reveal from './Reveal.jsx'
import SectionHeading from './SectionHeading.jsx'
import RichTextRenderer from './RichTextRenderer.jsx'
import Img from './Img.jsx'
import { NewsCard, EventCard, ProgramCard, AlbumCard, StaffCard } from './Cards.jsx'
import { formatDate } from '../lib/utils.js'
import { cn } from '../lib/utils.js'

const ICONS = {
  graduation: GraduationCap,
  globe: Globe2,
  heart: HeartHandshake,
  spark: Sparkles,
  phone: Phone,
  mail: Mail,
  shield: ShieldCheck,
  music: Music4,
  trophy: Trophy,
  users: Users,
  baby: Baby,
  book: BookOpen,
  compass: Compass,
  camera: Camera,
  target: Target,
  award: Award,
  lightbulb: Lightbulb,
  handshake: Handshake,
  eye: Eye,
  star: Star,
  brain: Brain,
  leaf: Leaf,
  help: HandHelping,
  zap: Zap
}

export function BlockHero({ block }) {
  const { db } = useData()
  const c = block
  const info = db.schoolInfo
  const tagline = info?.tagline || 'Knowledge Without Borders'
  const schoolName = info?.name || 'Highgate School'

  const cta1 = c.cta1 || { label: 'Apply for Admission', to: '/admissions' }
  const cta2 = c.cta2 || { label: 'Explore Our School', to: '/about' }

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <Img src={c.image} alt={schoolName} className="opacity-40" eager fetchpriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/65 to-navy-950/95" />
      </div>
      <div className="container-x relative z-10 py-32 text-center">
        {/* School Emblem / Kicker */}
        <div className="animate-fade-up mb-5 inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-navy-900/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
          {info?.logo ? (
            <img src={info.logo} alt="" className="h-5 w-5 object-contain" />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-royal text-[10px] font-bold text-gold-300">
              {schoolName[0] || 'H'}
            </span>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">
            {c.kicker || `${schoolName} · ${tagline}`}
          </p>
        </div>

        <h1 className="mx-auto mt-4 max-w-4xl animate-fade-up font-serif text-5xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl [animation-delay:120ms]">
          {c.title}
        </h1>

        {c.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-200 [animation-delay:240ms]">
            {c.subtitle}
          </p>
        )}

        <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-4 [animation-delay:360ms]">
          <Link to={cta1.to || '/admissions'} className="btn-royal rounded-lg px-7 py-3.5 text-sm font-semibold shadow-royal">
            {cta1.label}
          </Link>
          <Link to={cta2.to || '/about'} className="btn-outline-light rounded-lg px-7 py-3.5 text-sm font-semibold">
            {cta2.label}
          </Link>
        </div>

        {/* Quick Identity Badges */}
        <div className="animate-fade-up mt-14 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-medium text-slate-200 backdrop-blur-sm [animation-delay:480ms]">
          <span className="inline-flex items-center gap-2">
            <GraduationCap size={15} className="text-gold-400" /> Ages 3–18 Co-educational
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:inline" />
          <span className="inline-flex items-center gap-2">
            <Globe2 size={15} className="text-gold-400" /> Cambridge & IB World School
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:inline" />
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} className="text-gold-400" /> Founded {info?.founded || '1998'} · London
          </span>
        </div>
      </div>
    </section>
  )
}

export function BlockRichText({ block }) {
  return (
    <section className="bg-cream py-20">
      <div className="container-x max-w-4xl">
        <Reveal>
          <RichTextRenderer html={block.html} />
        </Reveal>
      </div>
    </section>
  )
}

export function BlockFeatures({ block }) {
  return (
    <section className={cn('py-20 lg:py-24', block.alt ? 'bg-white' : 'bg-surface')}>
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'What We Offer'} title={block.title} subtitle={block.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(block.items || []).map((f, i) => {
            const Icon = ICONS[f.icon] || Target
            return (
              <Reveal key={i} delay={i * 90} className="h-full">
                <div className="card-hover group flex h-full flex-col p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface border border-gold-500/30 text-royal transition-all duration-300 group-hover:bg-royal group-hover:text-white group-hover:border-royal group-hover:shadow-royal">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-navy-900 transition-colors group-hover:text-royal">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal/80">{f.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function BlockStats({ block }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 border-y border-white/10 py-20">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-royal/20 blur-3xl" />
      <div className="container-x relative grid grid-cols-2 gap-10 lg:grid-cols-4">
        {(block.items || []).map((s, i) => (
          <Reveal key={i} delay={i * 100} className="text-center">
            <p className="font-serif text-5xl font-semibold text-gold-400 lg:text-6xl">{s.value}</p>
            <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-navy-100">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function BlockImageText({ block }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal className={cn(block.reversed && 'lg:order-2')}>
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-28 w-28 rounded-xl bg-gold-100/70 border border-gold-500/20" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 shadow-cardHover">
              <Img src={block.image} alt={block.title} />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120} className={cn(block.reversed && 'lg:order-1')}>
          <p className="eyebrow mb-3">{block.eyebrow || 'Discover'}</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.6rem]">{block.title}</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
          <p className="mt-6 text-lg leading-relaxed text-charcoal/80">{block.text}</p>
          {block.link && (
            <Link to={block.link.to || '/'} className="mt-6 inline-flex items-center gap-2 font-semibold text-royal transition hover:text-navy-900 hover:gap-3">
              {block.link.label} <ChevronRight size={18} />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export function BlockQuote({ block }) {
  return (
    <section className="bg-navy-950 py-24">
      <div className="container-x mx-auto max-w-4xl text-center">
        <Reveal>
          <QuoteIcon size={44} className="mx-auto text-gold-500" />
          <p className="mt-8 font-serif text-2xl font-medium italic leading-relaxed text-white sm:text-3xl">
            "{block.quote}"
          </p>
          <div className="mt-8">
            <p className="font-serif text-lg font-semibold text-gold-400">{block.author}</p>
            <p className="mt-1 text-sm text-navy-200">{block.role}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function BlockCards({ block }) {
  return (
    <section className="bg-cream py-20">
      <div className="container-x">
        <SectionHeading title={block.title} subtitle={block.subtitle} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(block.items || []).map((c, i) => (
            <Reveal key={i} delay={i * 80} className="h-full">
              {c.to ? (
                <Link to={c.to} className="card-hover group flex h-full flex-col p-7">
                  {c.image && (
                    <div className="mb-5 aspect-[16/9] overflow-hidden rounded-xl">
                      <Img src={c.image} alt={c.title} />
                    </div>
                  )}
                  <h3 className="font-serif text-xl font-semibold text-navy-900">{c.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{c.text}</p>
                  <span className="mt-4 text-sm font-semibold text-gold-600">{c.linkLabel || 'Learn more →'}</span>
                </Link>
              ) : (
                <div className="card h-full p-7">
                  <h3 className="font-serif text-xl font-semibold text-navy-900">{c.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockTimeline({ block }) {
  return (
    <section className="bg-white py-20">
      <div className="container-x max-w-4xl">
        <SectionHeading eyebrow={block.eyebrow || 'Through the Years'} title={block.title} />
        <div className="relative">
          <div className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-gold-200 sm:left-1/2 sm:-translate-x-px" />
          <div className="space-y-10">
            {(block.items || []).map((t, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className={cn('relative flex items-start gap-6 sm:w-1/2', i % 2 === 0 ? 'sm:pr-12' : 'sm:ml-auto sm:pl-12')}>
                  <span className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-gold-200 bg-navy-900 font-serif text-sm font-bold text-gold-400 sm:left-auto sm:-translate-x-1/2"
                    style={i % 2 === 0 ? { right: '-20px' } : { left: '-20px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="ml-14 sm:ml-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t.year}</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold text-navy-900">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function BlockValues({ block }) {
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Our Values'} title={block.title} subtitle={block.subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {(block.items || []).map((v, i) => (
            <Reveal key={i} delay={i * 90} className="h-full">
              <div className="card-hover flex h-full items-start gap-6 p-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-royal font-serif text-xl font-bold text-white border border-gold-500/30 shadow-subtle">
                  <span className="text-gold-300">{v.title[0]}</span>
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-navy-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockPrograms({ block }) {
  const { publishedOnly } = useData()
  const programs = publishedOnly('programs', 'order')
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Academics'} title={block.title || 'Our Programmes'} subtitle={block.subtitle} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} className="h-full">
              <ProgramCard program={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockStaffGrid({ block }) {
  const { publishedOnly } = useData()
  const staff = publishedOnly('staff', 'order').filter(
    (s) => !block.department || s.department === block.department
  )
  const depts = useData().db.departments || []
  const deptName = (d) => depts.find((x) => x.name === d)?.name || d
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Our People'} title={block.title || 'Meet Our Team'} subtitle={block.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((s, i) => (
            <Reveal key={s.id} delay={i * 70} className="h-full">
              <StaffCard staff={s} departmentName={deptName(s.department)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockLatestNews({ block }) {
  const { publishedOnly } = useData()
  const news = publishedOnly('news', 'publishedAt', true).slice(0, 3)
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Newsroom'} title={block.title || 'Latest News'} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n, i) => (
            <Reveal key={n.id} delay={i * 80} className="h-full">
              <NewsCard article={n} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/news" className="btn-outline">
            {block.viewAllLabel || 'View All News'} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BlockUpcomingEvents({ block }) {
  const { publishedOnly, now } = useData()
  const upcoming = publishedOnly('events')
  const upcomingFiltered = upcoming
    .filter((e) => new Date(e.startDate).getTime() >= now - 86400000)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3)
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || "What's On"} title={block.title || 'Upcoming Events'} />
        {upcomingFiltered.length === 0 ? (
          <p className="text-center text-charcoal/70">{block.emptyText || 'No upcoming events at the moment — check back soon.'}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFiltered.map((e, i) => (
              <Reveal key={e.id} delay={i * 80} className="h-full">
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/events" className="btn-outline">
            {block.viewAllLabel || 'View All Events'} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BlockGalleryPreview({ block }) {
  const { publishedOnly } = useData()
  const albums = publishedOnly('albums').slice(0, 3)
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Gallery'} title={block.title || 'Life in Pictures'} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((a, i) => (
            <Reveal key={a.id} delay={i * 80} className="h-full">
              <AlbumCard album={a} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/gallery" className="btn-outline">
            {block.viewAllLabel || 'View Full Gallery'} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BlockCta({ block, dark }) {
  return (
    <section className={dark ? 'bg-navy-950 py-20 lg:py-24' : 'bg-surface py-20 lg:py-24'}>
      <div className="container-x">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-2xl bg-navy-900 border border-white/10 px-8 py-16 text-center shadow-cardHover sm:px-16"
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-royal/20 blur-3xl" />
            <h2 className="relative font-serif text-3xl font-semibold text-white sm:text-4xl">{block.title}</h2>
            {block.text && <p className="relative mx-auto mt-4 max-w-2xl text-navy-100">{block.text}</p>}
            {(block.cta1 || block.cta2) && (
              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
                {block.cta1 && (
                  <Link to={block.cta1.to || '/'} className="btn-royal rounded-lg px-7 py-3 font-semibold shadow-royal">
                    {block.cta1.label}
                  </Link>
                )}
                {block.cta2 && (
                  <Link to={block.cta2.to || '/'} className="btn-outline-light rounded-lg px-7 py-3">
                    {block.cta2.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function BlockWelcome({ block }) {
  return (
    <section className="bg-white py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-3">{block.eyebrow || 'Welcome'}</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.7rem]">{block.title}</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
          <div className="ql-rendered mt-6 text-lg text-charcoal/80" dangerouslySetInnerHTML={{ __html: block.body || '' }} />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={block.cta1?.to || '/about'} className="btn-royal">{block.cta1?.label || 'About the School'}</Link>
            <Link to={block.cta2?.to || '/vision-mission'} className="btn-outline">{block.cta2?.label || 'Our Vision & Mission'}</Link>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-36 w-36 rounded-xl bg-gold-100/60 border border-gold-500/20" />
            <div className="absolute -bottom-3 -left-3 h-28 w-28 rounded-xl bg-navy-100/50" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 shadow-cardHover">
              <Img src={block.image} alt={block.title} />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-5 py-3 shadow-cardHover">
              <CalendarDays size={20} className="text-gold-600" />
              <p className="text-sm font-semibold text-navy-900">
                Since {useData().db.schoolInfo?.founded || '1998'}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function BlockFacilities({ block }) {
  const { db } = useData()
  const scenes = useMemo(
    () => (db.tourScenes || []).filter((s) => s.isVisible !== false).slice(0, 4),
    [db.tourScenes]
  )

  if (scenes.length === 0) return null

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={block.eyebrow || 'Campus & Facilities'}
          title={block.title || 'World-Class Learning Spaces'}
          subtitle={block.subtitle || 'Purpose-built for inquiry, creativity, and athletic excellence.'}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {scenes.map((s, i) => (
            <Reveal key={s.id || i} delay={i * 70} className="h-full">
              <Link to="/virtual-tour" className="card-hover group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
                  <Img src={s.image} alt={s.title} className="transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-md bg-navy-950/80 px-2.5 py-1 text-[11px] font-semibold text-gold-300 backdrop-blur-sm">
                    {s.location || s.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg font-semibold text-navy-900 transition-colors group-hover:text-royal">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-charcoal/70">
                    {s.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-royal transition group-hover:text-navy-900">
                    Explore Space <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-center">
          <Link to="/virtual-tour" className="btn-royal">
            Take Virtual Tour <ChevronRight size={16} />
          </Link>
          <Link to="/campus-map" className="btn-outline">
            <MapPin size={16} /> View Campus Map
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BlockTestimonials({ block }) {
  const { db } = useData()
  const testimonials = useMemo(
    () => (db.testimonials || []).filter((t) => t.approved && (t.status === undefined || t.status === 'published')),
    [db.testimonials]
  )

  if (testimonials.length === 0) return null

  return (
    <section className="bg-surface border-y border-slate-200/70 py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={block.eyebrow || 'Community Voices'}
          title={block.title || 'What Parents & Students Say'}
          subtitle={block.subtitle || 'Real perspectives from families who call Highgate their school community.'}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.id || i} delay={i * 80} className="h-full">
              <div className="card-hover flex h-full flex-col justify-between bg-white p-8">
                <div>
                  <div className="mb-4 flex items-center gap-1 text-gold-500">
                    {Array.from({ length: t.rating || 5 }).map((_, r) => (
                      <span key={r} className="text-base">★</span>
                    ))}
                  </div>
                  <p className="font-serif text-base italic leading-relaxed text-navy-900">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-4">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full border border-slate-200 object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-royal font-serif text-sm font-bold text-white">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-serif text-sm font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs text-charcoal/60">{t.role} · {t.relationship}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/testimonials" className="btn-outline">
            {block.viewAllLabel || 'Read All Testimonials'} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BlockHeadOfSchool({ block }) {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-36 w-36 rounded-xl bg-gold-100/60 border border-gold-500/20" />
            <div className="absolute -bottom-3 -right-3 h-28 w-28 rounded-xl bg-navy-100/50" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 shadow-cardHover">
              <Img src={block.image} alt={block.author || 'Head of School'} />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-3">{block.eyebrow || 'Leadership'}</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.6rem]">{block.title}</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
          <div className="ql-rendered mt-6 text-lg leading-relaxed text-charcoal/80" dangerouslySetInnerHTML={{ __html: block.body || '' }} />
          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="font-serif text-lg font-semibold text-navy-900">{block.author}</p>
            <p className="mt-1 text-sm text-charcoal/60">{block.role}</p>
          </div>
          {block.signature && (
            <p className="mt-6 font-serif text-xl italic text-navy-900">{block.signature}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export function BlockPhilosophy({ block }) {
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Our Approach'} title={block.title} subtitle={block.subtitle} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(block.items || []).map((item, i) => {
            const Icon = ICONS[item.icon] || Lightbulb
            return (
              <Reveal key={i} delay={i * 90} className="h-full">
                <div className="card-hover group flex h-full flex-col p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-all duration-300 group-hover:bg-royal group-hover:text-white group-hover:shadow-royal">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-navy-900 transition-colors group-hover:text-royal">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{item.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function BlockDistinctive({ block }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 lg:py-28">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-royal/20 blur-3xl" />
      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3 text-gold-400">{block.eyebrow || 'What Sets Us Apart'}</p>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">{block.title}</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
            {block.subtitle && <p className="mt-6 text-lg text-navy-200">{block.subtitle}</p>}
          </div>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(block.items || []).map((item, i) => {
            const Icon = ICONS[item.icon] || Star
            return (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-200">{item.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function BlockStudentExperience({ block }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow={block.eyebrow || 'Student Life'} title={block.title} subtitle={block.subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {(block.items || []).map((item, i) => (
            <Reveal key={i} delay={i * 80} className="h-full">
              <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 shadow-card transition-shadow hover:shadow-cardHover">
                {item.image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <Img src={item.image} alt={item.title} className="transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-7">
                  <h3 className="font-serif text-xl font-semibold text-navy-900 transition-colors group-hover:text-royal">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal/80">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlockCommunity({ block }) {
  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-36 w-36 rounded-xl bg-gold-100/60 border border-gold-500/20" />
            <div className="absolute -bottom-3 -right-3 h-28 w-28 rounded-xl bg-navy-100/50" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 shadow-cardHover">
              <Img src={block.image} alt={block.title || 'Our Community'} />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-3">{block.eyebrow || 'Together We Thrive'}</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.6rem]">{block.title}</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
          <div className="ql-rendered mt-6 text-lg leading-relaxed text-charcoal/80" dangerouslySetInnerHTML={{ __html: block.body || '' }} />
          {(block.stats || []).length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
              {block.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-serif text-2xl font-semibold text-royal">{s.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-charcoal/60">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default function renderBlock(block, i = 0) {
  switch (block.type) {
    case 'hero':
      return <BlockHero key={block.id || i} block={block} />
    case 'richText':
      return <BlockRichText key={block.id || i} block={block} />
    case 'features':
      return <BlockFeatures key={block.id || i} block={block} />
    case 'stats':
      return <BlockStats key={block.id || i} block={block} />
    case 'imageText':
      return <BlockImageText key={block.id || i} block={block} />
    case 'quote':
      return <BlockQuote key={block.id || i} block={block} />
    case 'cards':
      return <BlockCards key={block.id || i} block={block} />
    case 'timeline':
      return <BlockTimeline key={block.id || i} block={block} />
    case 'values':
      return <BlockValues key={block.id || i} block={block} />
    case 'programs':
      return <BlockPrograms key={block.id || i} block={block} />
    case 'staffGrid':
      return <BlockStaffGrid key={block.id || i} block={block} />
    case 'latestNews':
      return <BlockLatestNews key={block.id || i} block={block} />
    case 'upcomingEvents':
      return <BlockUpcomingEvents key={block.id || i} block={block} />
    case 'galleryPreview':
      return <BlockGalleryPreview key={block.id || i} block={block} />
    case 'facilities':
      return <BlockFacilities key={block.id || i} block={block} />
    case 'testimonials':
      return <BlockTestimonials key={block.id || i} block={block} />
    case 'headOfSchool':
      return <BlockHeadOfSchool key={block.id || i} block={block} />
    case 'philosophy':
      return <BlockPhilosophy key={block.id || i} block={block} />
    case 'distinctive':
      return <BlockDistinctive key={block.id || i} block={block} />
    case 'studentExperience':
      return <BlockStudentExperience key={block.id || i} block={block} />
    case 'community':
      return <BlockCommunity key={block.id || i} block={block} />
    case 'welcome':
      return <BlockWelcome key={block.id || i} block={block} />
    case 'cta':
      return <BlockCta key={block.id || i} block={block} />
    default:
      return null
  }
}
