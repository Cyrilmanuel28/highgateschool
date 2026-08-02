import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowRight, Play, Download, FileText, Users, GraduationCap, ChevronRight } from 'lucide-react'
import Img from './Img.jsx'
import { formatDate, truncate, stripHtml, initials } from '../lib/utils.js'

export function NewsCard({ article, readLabel = 'Read Article' }) {
  return (
    <Link
      to={`/news/${article.slug}`}
      className="card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img
          src={article.featuredImage}
          alt={article.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="rounded-full bg-gold-50 px-3 py-1 text-gold-700">{article.tags?.[0] || 'News'}</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar size={13} /> {formatDate(article.publishedAt)}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-navy-900 transition group-hover:text-gold-700">
          {article.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{truncate(stripHtml(article.body), 130)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition group-hover:gap-2.5">
          {readLabel} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}

export function EventCard({ event, viewLabel = 'View Event' }) {
  const start = new Date(event.startDate)
  return (
    <Link
      to={`/events/${event.slug}`}
      className="card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img src={event.featuredImage} alt={event.title} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/95 shadow-card backdrop-blur">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600">
              {start.toLocaleDateString('en-GB', { month: 'short' })}
            </span>
            <span className="font-serif text-2xl font-bold leading-none text-navy-900">
              {start.getDate()}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold-300">
              {start.getFullYear() === new Date().getFullYear()
                ? formatDate(event.startDate, { year: undefined })
                : formatDate(event.startDate)}
            </p>
            <h3 className="max-w-[220px] font-serif text-lg font-semibold leading-snug text-white">{event.title}</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Clock size={14} className="text-gold-600" />
          {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          {event.endDate && event.endDate !== event.startDate && (
            <span>
              – {formatDate(event.endDate)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <MapPin size={14} className="text-gold-600" /> {event.location}
        </p>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{truncate(event.description, 120)}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition group-hover:gap-2.5">
          {viewLabel} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}

export function StaffCard({ staff, departmentName, profileLabel = 'View Profile →' }) {
  return (
    <Link to={`/staff/${staff.id}`} className="card-hover group overflow-hidden text-center">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Img src={staff.photo} alt={staff.name} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 text-xs font-semibold text-gold-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {profileLabel}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-navy-900">{staff.name}</h3>
        <p className="mt-1 text-sm font-medium text-gold-600">{staff.title}</p>
        {departmentName && <p className="mt-1 text-xs text-slate-500">{departmentName}</p>}
      </div>
    </Link>
  )
}

export function AlbumCard({ album }) {
  return (
    <Link to={`/gallery/${album.slug}`} className="card-hover group relative block overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <Img src={album.coverImage} alt={album.title} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">
          {album.photos?.length || 0} Photos
        </p>
        <h3 className="mt-1 font-serif text-2xl font-semibold text-white">{album.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-navy-100">{album.description}</p>
      </div>
    </Link>
  )
}

export function VideoCard({ video }) {
  return (
    <div className="card-hover group overflow-hidden">
      <a
        href={video.embedUrl}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-video overflow-hidden"
      >
        <Img src={video.thumbnail || ''} alt={video.title} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/40 transition group-hover:bg-navy-950/50">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-gold transition-transform duration-300 group-hover:scale-110">
            <Play size={24} className="ml-1 fill-navy-900 text-navy-900" />
          </span>
        </div>
      </a>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-navy-900">{video.title}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{truncate(video.description, 110)}</p>
      </div>
    </div>
  )
}

export function ProgramCard({ program, index }) {
  return (
    <div className="card-hover relative overflow-hidden p-7">
      <span className="absolute -right-4 -top-6 font-serif text-[7rem] font-bold leading-none text-navy-900/5">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
          <GraduationCap size={22} />
        </span>
        <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">{program.level}</span>
      </div>
      <h3 className="mt-5 font-serif text-2xl font-semibold text-navy-900">{program.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.description}</p>
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-cream px-3.5 py-2.5 text-xs font-medium text-navy-800">
        <GraduationCap size={14} className="text-gold-600" />
        {program.curriculum}
      </div>
    </div>
  )
}

export function AchievementCard({ item }) {
  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Img src={item.image} alt={item.title} className="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-navy-900/85 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
          {item.category}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold text-gold-600">{formatDate(item.date)}</p>
        <h3 className="mt-1.5 font-serif text-xl font-semibold text-navy-900">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
      </div>
    </div>
  )
}

export function DownloadRow({ item }) {
  return (
    <div className="card-hover flex items-center gap-5 p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
        <FileText size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-lg font-semibold text-navy-900">{item.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-600">{item.description}</p>
        <p className="mt-1 text-xs text-slate-400">{formatDate(item.publishedAt)}</p>
      </div>
      <a
        href={item.fileUrl}
        download={item.fileUrl.startsWith('/') ? item.title.replace(/\s+/g, '-').toLowerCase() + '.pdf' : undefined}
        target={item.fileUrl.startsWith('/') || item.fileUrl.startsWith('data:') || item.fileUrl.startsWith('blob:') ? '_self' : '_blank'}
        rel="noreferrer"
        className="btn-outline shrink-0"
      >
        <Download size={16} /> Download
      </a>
    </div>
  )
}

export function ClubCard({ club }) {
  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Img src={club.photo} alt={club.name} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl font-semibold text-white">{club.name}</h3>
      </div>
      <div className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">{club.description}</p>
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p className="flex items-center gap-2">
            <Users size={13} className="text-gold-600" /> Advisor: <span className="font-medium text-navy-800">{club.advisor}</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock size={13} className="text-gold-600" /> {club.meetingSchedule}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SportCard({ sport }) {
  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Img src={sport.photo} alt={sport.name} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <h3 className="absolute bottom-4 left-5 font-serif text-2xl font-semibold text-white">{sport.name}</h3>
      </div>
      <div className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">{sport.description}</p>
        <p className="mt-3 text-xs font-semibold text-navy-800">
          Coach: <span className="font-medium text-gold-600">{sport.coach}</span>
        </p>
        {sport.achievements?.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            {sport.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                <ChevronRight size={13} className="mt-0.5 shrink-0 text-gold-600" /> {a}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function DepartmentCard({ dept, headName, exploreLabel = 'Explore Department' }) {
  return (
    <Link to={`/departments/${dept.slug}`} className="card-hover group overflow-hidden">
      <div className="relative aspect-[16/8] overflow-hidden">
        <Img src={dept.featuredImage} alt={dept.name} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
        <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl font-semibold text-white">{dept.name}</h3>
      </div>
      <div className="p-6">
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{dept.description}</p>
        {headName && (
          <p className="mt-3 text-xs font-medium text-navy-800">
            Head of Department: <span className="text-gold-600">{headName}</span>
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition group-hover:gap-2.5">
          {exploreLabel} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}

export function Avatar({ name, className }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-navy-800 font-serif font-semibold text-gold-400 ${className || 'h-12 w-12 text-lg'}`}
    >
      {initials(name)}
    </div>
  )
}
