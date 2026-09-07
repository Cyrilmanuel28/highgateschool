import { useEffect } from 'react'
import { useData } from '../context/DataContext.jsx'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function SeoHead({ title, description, ogImage, canonical, type = 'website' }) {
  const { db } = useData()
  const siteTitle = db.schoolInfo?.name || 'School'

  useEffect(() => {
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle
    document.title = finalTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', finalTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', ogImage || db.settings?.defaultOgImage || db.schoolInfo?.logo)
    upsertMeta('property', 'og:site_name', siteTitle)
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', finalTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage || db.settings?.defaultOgImage || db.schoolInfo?.logo)

    const faviconUrl = db.schoolInfo?.crest || db.schoolInfo?.logo || db.settings?.favicon
    if (faviconUrl) {
      let iconLink = document.head.querySelector('link[rel="icon"]') || document.head.querySelector('link[rel*="icon"]')
      if (!iconLink) {
        iconLink = document.createElement('link')
        iconLink.rel = 'icon'
        document.head.appendChild(iconLink)
      }
      iconLink.href = faviconUrl
    }
  }, [title, description, ogImage, canonical, type, siteTitle, db.settings, db.schoolInfo])

  return null
}
