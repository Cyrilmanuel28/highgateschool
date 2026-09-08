import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Img from '../components/Img.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { initials, formatDate } from '../lib/utils.js'

export default function MagazineArticle() {
  const { slug } = useParams()
  const { db } = useData()
  const article = (db.magazineArticles || []).find((a) => a.slug === slug)

  if (!article || (article.status !== undefined && article.status !== 'published')) {
    return (
      <>
        <SeoHead title="Article not found" />
        <div className="bg-cream px-4 py-32">
          <EmptyState icon={Newspaper} title="Article not found" text="This article may have been unpublished or removed." action={<Link to="/magazine" className="btn-navy">Back to the magazine</Link>} />
        </div>
      </>
    )
  }

  const related = (db.magazineArticles || [])
    .filter((a) => a.status === 'published' && a.id !== article.id)
    .slice(0, 3)

  return (
    <>
      <SeoHead title={article.title} description={article.excerpt} ogImage={article.coverImage} />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Magazine', to: '/magazine' }, { label: article.title }]} />
          <p className="eyebrow">{article.edition} · {article.category}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">{article.title}</h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 font-serif text-base font-semibold text-navy-900">
              {initials(article.author)}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{article.author}</p>
              <p className="text-xs text-navy-200">{article.contributorType || 'Guest'} · {formatDate(article.publishedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <article className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <Img src={article.coverImage} alt={article.title} eager className="aspect-[16/8]" />
            </div>
            <div className="ql-rendered mt-10 text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: article.body }} />
          </article>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl">
              <h2 className="font-serif text-2xl font-semibold text-navy-900">More from the magazine</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((a) => (
                  <Link key={a.id} to={`/magazine/${a.slug}`} className="card-hover group overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden">
                      <Img src={a.coverImage} alt={a.title} lazy className="transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gold-600">{a.category}</p>
                      <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-navy-900">{a.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/magazine" className="btn-outline">
              <ArrowLeft size={16} /> Back to the magazine
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
