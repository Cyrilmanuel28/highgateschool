import { stripHtml } from './utils.js'

export function buildSearchIndex(db) {
  const index = []
  const push = (item) => index.push(item)

  ;(db.pages || []).forEach((p) => {
    if (p.status !== 'published') return
    push({
      id: `pg_${p.id}`,
      title: p.title,
      snippet: p.metaDescription || stripHtml(p.contentBlocks?.map((b) => b.html || b.text || b.subtitle || '').join(' ')).slice(0, 160),
      url: `/${p.slug}`,
      type: 'Page'
    })
  })
  ;(db.news || []).forEach((n) => {
    if (n.status !== 'published') return
    push({ id: `nw_${n.id}`, title: n.title, snippet: stripHtml(n.body).slice(0, 160), url: `/news/${n.slug}`, type: 'News', sub: n.tags?.[0] || 'News' })
  })
  ;(db.events || []).forEach((e) => {
    if (e.status !== 'published') return
    push({ id: `ev_${e.id}`, title: e.title, snippet: (e.description || '').slice(0, 160), url: `/events/${e.slug}`, type: 'Event', sub: new Date(e.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) })
  })
  ;(db.staff || []).forEach((s) => {
    if (s.isVisible === false) return
    push({ id: `stf_${s.id}`, title: s.name, snippet: s.title || '', url: `/staff/${s.id}`, type: 'Staff', sub: s.department })
  })
  ;(db.departments || []).forEach((d) => {
    push({ id: `dep_${d.id}`, title: d.name, snippet: (d.description || '').slice(0, 160), url: `/departments/${d.slug}`, type: 'Department', sub: 'Department' })
  })
  ;(db.programs || []).forEach((p) => {
    if (p.status !== 'published') return
    push({ id: `prg_${p.id}`, title: p.name, snippet: p.description || '', url: '/academics', type: 'Programme', sub: p.level })
  })
  ;(db.downloads || []).forEach((d) => {
    push({ id: `dl_${d.id}`, title: d.title, snippet: (d.description || '').slice(0, 160), url: '/downloads', type: 'Download', sub: d.category })
  })
  ;(db.faqs || []).forEach((f) => {
    push({ id: `faq_${f.id}`, title: f.question, snippet: stripHtml(f.answer).slice(0, 140), url: '/faq', type: 'FAQ', sub: f.category })
  })
  ;(db.albums || []).forEach((a) => {
    if (a.status !== 'published') return
    push({ id: `alb_${a.id}`, title: a.title, snippet: (a.description || '').slice(0, 160), url: `/gallery/${a.slug}`, type: 'Gallery', sub: `${a.photos?.length || 0} photos` })
  })
  ;(db.notices || []).forEach((n) => {
    if (n.status === 'archived' || n.isVisible === false) return
    push({ id: `not_${n.id}`, title: n.title, snippet: (n.body || '').slice(0, 160), url: '/notices', type: 'Notice', sub: n.category })
  })
  ;(db.library || []).forEach((l) => {
    if (l.status !== 'published') return
    push({ id: `lib_${l.id}`, title: l.title, snippet: (l.description || '').slice(0, 160), url: '/library', type: 'Library', sub: l.category })
  })
  ;(db.magazineArticles || []).forEach((m) => {
    if (m.status !== 'published') return
    push({ id: `mag_${m.id}`, title: m.title, snippet: (m.excerpt || '').slice(0, 160), url: `/magazine/${m.slug}`, type: 'Magazine', sub: m.edition })
  })
  ;(db.vacancies || []).forEach((v) => {
    if (!v.isOpen && v.status !== 'published') return
    push({ id: `vac_${v.id}`, title: v.title, snippet: v.summary || '', url: '/careers', type: 'Careers', sub: v.department })
  })
  ;(db.testimonials || []).forEach((t) => {
    if (!t.approved) return
    push({ id: `tes_${t.id}`, title: t.name, snippet: (t.quote || '').slice(0, 160), url: '/testimonials', type: 'Testimonial', sub: t.relationship })
  })
  ;(db.clubs || []).forEach((c) => {
    push({ id: `club_${c.id}`, title: c.name, snippet: (c.description || '').slice(0, 160), url: '/clubs', type: 'Clubs', sub: c.advisor })
  })
  ;(db.sports || []).forEach((s) => {
    push({ id: `sp_${s.id}`, title: s.name, snippet: (s.description || '').slice(0, 160), url: '/sports', type: 'Sport', sub: s.coach })
  })

  return index
}

export const SEARCH_TYPES = ['Page', 'News', 'Event', 'Staff', 'Department', 'Programme', 'Download', 'FAQ', 'Gallery', 'Notice', 'Library', 'Magazine', 'Careers', 'Testimonial', 'Clubs', 'Sport']

export function filterType(type) {
  if (type === 'Pages') return ['Page']
  if (type === 'News & Events') return ['News', 'Event', 'Notice', 'Magazine']
  if (type === 'Downloads') return ['Download', 'Library']
  if (type === 'People') return ['Staff', 'Department', 'Testimonial', 'Clubs', 'Sport']
  if (type === 'FAQ') return ['FAQ']
  if (type === 'Resources') return ['Programme', 'Gallery', 'Careers']
  return SEARCH_TYPES
}

export function searchIndex(index, query, types) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const allowed = new Set(types)
  return index
    .filter((i) => allowed.has(i.type))
    .map((i) => {
      const hay = `${i.title} ${i.snippet} ${i.sub || ''}`.toLowerCase()
      const score = hay.startsWith(q) ? 3 : hay.includes(q) ? 1 : 0
      return { ...i, score }
    })
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
}
