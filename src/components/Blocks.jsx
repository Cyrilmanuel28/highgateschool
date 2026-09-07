import { Link } from 'react-router-dom'
import {
  GraduationCap, Globe2, HeartHandshake, Sparkles, Phone, Mail, ShieldCheck, Music4, Trophy,
  Users, Baby, BookOpen, Compass, Camera, Target, Award, Quote as QuoteIcon, CalendarDays,
  ChevronRight
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
  award: Award
}

export function BlockHero({ block }) {
  const { db } = useData()
  const c = block
  const tagline = db.schoolInfo?.tagline
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <Img src={c.image} alt="" className="opacity-45" eager fetchpriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/65 to-navy-950/95" />
      </div>
      <div className="container-x relative z-10 py-32 text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-navy-900/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">
            {c.kicker || tagline}
          </p>
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl animate-fade-up font-serif text-5xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl [animation-delay:120ms]">
          {c.title}
        </h1>
        {c.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-200 [animation-delay:240ms]">
            {c.subtitle}
          </p>
        )}
        {(c.cta1 || c.cta2) && (
          <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-4 [animation-delay:360ms]">
            {c.cta1 && (
              <Link to={c.cta1.to || '/'} className="btn-royal rounded-lg px-7 py-3.5 text-sm font-semibold shadow-royal">
                {c.cta1.label}
              </Link>
            )}
            {c.cta2 && (
              <Link to={c.cta2.to || '/'} className="btn-outline-light rounded-lg px-7 py-3.5 text-sm font-semibold">
                {c.cta2.label}
              </Link>
            )}
          </div>
        )}
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
    case 'welcome':
      return <BlockWelcome key={block.id || i} block={block} />
    case 'cta':
      return <BlockCta key={block.id || i} block={block} />
    default:
      return null
  }
}
