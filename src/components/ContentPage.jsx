import { useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import SeoHead from './SeoHead.jsx'
import renderBlock from './Blocks.jsx'
import NotFound from '../pages/NotFound.jsx'
import { FullPageLoader } from './PageLoader.jsx'

export default function ContentPage({ slug: slugProp }) {
  const { slug: slugParam } = useParams()
  const slug = slugProp || slugParam
  const { getBySlug, loading, db } = useData()
  const [searchParams] = useSearchParams()
  const previewing = searchParams.get('preview') === '1'

  const page = useMemo(() => getBySlug('pages', slug), [getBySlug, slug, db.pages])

  if (loading) {
    return <FullPageLoader message="Loading page..." />
  }

  if (!page || (page.status !== 'published' && !previewing)) {
    return <NotFound />
  }

  const title = previewing && page.status === 'draft' ? `[Draft] ${page.title}` : page.title
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <SeoHead
        title={title}
        description={page.metaDescription}
        ogImage={page.ogImage}
        canonical={origin ? `${origin}/${page.slug}` : `/${page.slug}`}
      />
      {previewing && page.status !== 'published' && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full bg-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-navy-900 shadow-gold">
          Previewing draft — not visible to visitors
        </div>
      )}
      {(page.contentBlocks || []).map((b, i) => renderBlock(b, i))}
    </>
  )
}
