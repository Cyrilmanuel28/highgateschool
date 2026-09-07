import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Img from '../components/Img.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import RichTextRenderer from '../components/RichTextRenderer.jsx'
import { NewsCard } from '../components/Cards.jsx'
import { formatDate, stripHtml, truncate } from '../lib/utils.js'
import NotFound from './NotFound.jsx'

export default function NewsArticlePage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { getBySlug, getRecord, publishedOnly, db } = useData()
  const article = useMemo(() => getBySlug('news', slug) || getRecord('news', slug), [getBySlug, getRecord, slug, db.news])

  if (!article || (!searchParams.get('preview') && article.status !== 'published')) return <NotFound />

  const related = publishedOnly('news', 'publishedAt', true)
    .filter((n) => n.id !== article.id && (n.tags || []).some((t) => article.tags?.includes(t)))
    .slice(0, 3)

  return (
    <>
      <SeoHead
        title={article.title}
        description={truncate(stripHtml(article.body), 160)}
        ogImage={article.featuredImage}
        canonical={`${window.location.origin}/news/${article.slug}`}
        type="article"
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'News', to: '/news' }, { label: article.title }]} />
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-gold-500/15 px-3 py-1 text-gold-300">
                {article.tags?.[0] || 'News'}
              </span>
              <span className="flex items-center gap-1.5 text-navy-200">
                <Calendar size={13} /> {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5 text-navy-200">
                <User size={13} /> {article.author}
              </span>
            </div>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <article className="bg-cream py-14">
        <div className="container-x max-w-3xl">
          <div className="overflow-hidden rounded-2xl shadow-cardHover">
            <Img src={article.featuredImage} alt={article.title} className="aspect-[16/8]" />
          </div>
          <div className="mt-10">
            <RichTextRenderer html={article.body} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Tag size={13} /> Tags:
            </span>
            {(article.tags || []).map((t) => (
              <Link
                key={t}
                to={`/news?tag=${t}`}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-800 shadow-card transition hover:bg-gold-50"
              >
                {t}
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 transition hover:gap-3">
              <ArrowLeft size={16} /> Back to all news
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="container-x mt-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">Related Articles</h2>
              <Link to="/news" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                View all →
              </Link>
            </div>
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.id} article={n} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
