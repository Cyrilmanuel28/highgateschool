import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube
}

export default function Footer() {
  const { db, create } = useData()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const info = db.schoolInfo
  const topMenu = (db.menus || [])
    .filter((m) => m.isVisible && !m.parentId)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
  const feeds = db.socialFeeds
  const year = new Date().getFullYear()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    create('newsletterSubscribers', {
      email: email.trim(),
      status: 'subscribed',
      createdAt: new Date().toISOString()
    })
    setEmail('')
    setSubscribed(true)
  }

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="border-b border-white/10 bg-navy-900/60">
        <div className="container-x flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h3 className="font-serif text-xl font-semibold text-white">{info?.newsletterTitle || 'Newsletter'}</h3>
            <p className="mt-1 text-sm text-navy-200">{info?.newsletterDescription || info?.tagline || ''}</p>
          </div>
          {subscribed ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <CheckCircle2 size={16} /> Thank you — please check your inbox to confirm.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={info?.newsletterPlaceholder || 'Enter your email'}
                aria-label="Email address"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-navy-300 focus:border-gold-500"
              />
              <button type="submit" className="btn-gold shrink-0" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3.5">
            {info?.logo ? (
              <img src={info.logo} alt={info.name} className="h-12 w-12 rounded-lg object-contain shadow-subtle" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-royal font-serif text-xl font-bold text-white border border-gold-500/30 shadow-subtle">
                <span className="text-gold-300">{(info?.name || 'Highgate').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div>
              <p className="font-serif text-xl font-semibold text-white">{info?.name}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">{info?.tagline}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-navy-200">{info?.footerText}</p>
          <div className="mt-5 flex gap-2">
            {Object.entries(info?.socialLinks || {}).map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key]
              if (!Icon) return null
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-navy-100 transition hover:border-gold-500/60 hover:bg-gold-500/15 hover:text-gold-300"
                >
                  <Icon size={15} />
                </a>
              )
            })}
          </div>
          {feeds?.platforms?.length > 0 && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
                {feeds.headline || 'Follow our community'}
              </p>
              <ul className="mt-3 space-y-2.5">
                {feeds.platforms.filter((p) => p.url).map((p) => {
                  const Icon = SOCIAL_ICONS[p.platform]
                  if (!Icon) return null
                  return (
                    <li key={p.platform}>
                      <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between text-sm text-navy-200 transition hover:text-gold-400">
                        <span className="flex items-center gap-2.5">
                          <Icon size={15} className="text-gold-400" />
                          {p.handle}
                        </span>
                        {p.followerCount && <span className="text-xs text-navy-400">{p.followerCount} followers</span>}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-white">{info?.footerQuickLinksTitle || 'Quick Links'}</h3>
          <ul className="mt-5 space-y-2.5">
            {topMenu.map((m) => (
              <li key={m.id}>
                <Link to={m.url} className="text-sm text-navy-200 transition hover:text-gold-400">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-white">{info?.footerProgrammesTitle || 'Programmes'}</h3>
          <ul className="mt-5 space-y-2.5">
            {(db.programs || [])
              .slice()
              .sort((a, b) => a.order - b.order)
              .slice(0, 6)
              .map((p) => (
                <li key={p.id}>
                  <Link to="/academics" className="text-sm text-navy-200 transition hover:text-gold-400">
                    {p.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-white">{info?.footerContactTitle || 'Contact'}</h3>
          <ul className="mt-5 space-y-3.5 text-sm text-navy-200">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
              <span>{info?.address}</span>
            </li>
            <li>
              <a href={`tel:${info?.phone?.replace(/[^+\d]/g, '')}`} className="flex gap-3 transition hover:text-gold-400">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-400" />
                {info?.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${info?.email}`} className="flex gap-3 transition hover:text-gold-400">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-400" />
                {info?.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-navy-300 sm:flex-row">
          <p>
            © {year} {info?.name}. {info?.copyrightText || `All rights reserved. Founded ${info?.founded || ''}.`}
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="transition hover:text-gold-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-gold-400">
              Terms of Use
            </Link>
            <Link to="/dashboard" className="transition hover:text-gold-400">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
