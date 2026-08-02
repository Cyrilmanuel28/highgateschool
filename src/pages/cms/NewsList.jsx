import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Newspaper } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Table, RowActions, ConfirmDialog, StatusBadge } from '../../components/cms/UI.jsx'
import { formatDateTime, timeAgo } from '../../lib/utils.js'

export default function NewsList() {
  const { db, remove } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  const news = useMemo(
    () => (db.news || []).slice().sort((a, b) => new Date(b.publishedAt || b.updatedAt) - new Date(a.publishedAt || a.updatedAt)),
    [db.news]
  )

  return (
    <div>
      <PageHeader
        title="News"
        subtitle={`${news.length} articles`}
        actions={
          <Link to="/dashboard/news/new" className="btn bg-navy-900 text-white hover:bg-navy-800">
            <Plus size={15} /> New Article
          </Link>
        }
      />

      <Table headers={['Article', 'Author', 'Status', 'Published', '']}>
        {news.map((n) => (
          <tr key={n.id} className="transition hover:bg-slate-50/70">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                  <Newspaper size={16} />
                </span>
                <div>
                  <Link to={`/dashboard/news/${n.id}`} className="font-semibold text-navy-900 hover:text-gold-700">
                    {n.title}
                  </Link>
                  <p className="text-xs text-slate-400">/news/{n.slug}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3.5 text-sm text-slate-600">{n.author || '—'}</td>
            <td className="px-5 py-3.5"><StatusBadge status={n.status} /></td>
            <td className="px-5 py-3.5">
              <p className="text-xs text-slate-500">{n.publishedAt ? formatDateTime(n.publishedAt) : '—'}</p>
              <p className="text-[11px] text-slate-400">{timeAgo(n.publishedAt || n.updatedAt)}</p>
            </td>
            <td className="px-5 py-3.5">
              <RowActions
                onEdit={() => navigate(`/dashboard/news/${n.id}`)}
                onPreview={() => window.open(`/news/${n.slug}?preview=1`, '_blank')}
                onDelete={() => setDeleting(n)}
              />
            </td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete article?"
        message={`"${deleting?.title}" will be permanently removed from the website.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('news', deleting.id)
          setDeleting(null)
          toast('Article deleted')
        }}
      />
    </div>
  )
}
