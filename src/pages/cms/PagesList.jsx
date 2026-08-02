import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Table, RowActions, ConfirmDialog, StatusBadge, Btn } from '../../components/cms/UI.jsx'
import { formatDateTime } from '../../lib/utils.js'

export default function PagesList() {
  const { db, remove } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  const pages = useMemo(
    () => (db.pages || []).slice().sort((a, b) => a.slug.localeCompare(b.slug)),
    [db.pages]
  )

  return (
    <div>
      <PageHeader
        title="Pages"
        subtitle={`${pages.length} pages · content is rendered from the database`}
        actions={
          <Link to="/dashboard/pages/new" className="btn bg-navy-900 text-white hover:bg-navy-800">
            <Plus size={15} /> New Page
          </Link>
        }
      />

      <Table headers={['Page', 'Slug', 'Status', 'Blocks', 'Updated', '']}>
        {pages.map((p) => (
          <tr key={p.id} className="transition hover:bg-slate-50/70">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                  <FileText size={16} />
                </span>
                <div>
                  <Link to={`/dashboard/pages/${p.id}`} className="font-semibold text-navy-900 hover:text-gold-700">
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-400">/{p.slug}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3.5">
              <Link to={`/${p.slug}`} className="text-xs font-medium text-gold-600 hover:underline">
                /{p.slug}
              </Link>
            </td>
            <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
            <td className="px-5 py-3.5 text-sm text-slate-600">{p.contentBlocks?.length || 0}</td>
            <td className="px-5 py-3.5 text-xs text-slate-400">{formatDateTime(p.updatedAt)}</td>
            <td className="px-5 py-3.5">
              <RowActions
                onEdit={() => navigate(`/dashboard/pages/${p.id}`)}
                onPreview={() => window.open(`/${p.slug}?preview=1`, '_blank')}
                onDelete={() => setDeleting(p)}
              />
            </td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete page?"
        message={`"${deleting?.title}" will be permanently removed from the website. This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('pages', deleting.id)
          setDeleting(null)
          toast('Page deleted')
        }}
      />
    </div>
  )
}
