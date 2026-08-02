import { useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import renderBlock from '../components/Blocks.jsx'

export default function Home() {
  const { db } = useData()
  const sections = useMemo(
    () => (db.homeSections || []).filter((s) => (s.status === undefined || s.status === 'published') && s.isVisible).sort((a, b) => a.order - b.order),
    [db.homeSections]
  )
  const schoolInfo = db.schoolInfo

  return (
    <>
      <SeoHead
        title={`${schoolInfo?.name} — ${schoolInfo?.tagline}`}
        description={schoolInfo?.seoDescription || `${schoolInfo?.name || 'Highgate School'} is an international private school for ages 3–18, offering Cambridge IGCSE and the IB Diploma in a warm, global community.`}
        ogImage={schoolInfo?.logo || '/favicon.svg'}
      />
      {sections.map((s, i) => renderBlock({ ...s.content, id: s.id }, i))}
    </>
  )
}
