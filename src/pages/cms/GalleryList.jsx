import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Images } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Table, RowActions, ConfirmDialog, StatusBadge } from '../../components/cms/UI.jsx'
import { formatDateTime } from '../../lib/utils.js'

export default function GalleryList() {
  const { db, remove } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  const albums = useMemo(
    () => (db.albums || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    [db.albums]
  )

  return (
    <div>
      <PageHeader
        title="Gallery Albums"
        subtitle={`${albums.length} albums`}
        actions={
          <Link to="/dashboard/gallery/new" className="btn bg-navy-900 text-white hover:bg-navy-800">
            <Plus size={15} /> New Album
          </Link>
        }
      />

      <Table headers={['Album', 'Photos', 'Status', 'Created', '']}>
        {albums.map((a) => (
          <tr key={a.id} className="transition hover:bg-slate-50/70">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <img src={a.coverImage} alt={a.title} className="h-11 w-16 rounded-lg object-cover" />
                <div>
                  <Link to={`/dashboard/gallery/${a.id}`} className="font-semibold text-navy-900 hover:text-gold-700">
                    {a.title}
                  </Link>
                  <p className="text-xs text-slate-400">/gallery/{a.slug}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3.5">
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <Images size={14} className="text-gold-600" /> {a.photos?.length || 0}
              </span>
            </td>
            <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
            <td className="px-5 py-3.5 text-xs text-slate-400">{formatDateTime(a.updatedAt)}</td>
            <td className="px-5 py-3.5">
              <RowActions
                onEdit={() => navigate(`/dashboard/gallery/${a.id}`)}
                onPreview={() => window.open(`/gallery/${a.slug}`, '_blank')}
                onDelete={() => setDeleting(a)}
              />
            </td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete album?"
        message={`"${deleting?.title}" and all its photos will be removed from the public site.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('albums', deleting.id)
          toast('Album deleted')
          setDeleting(null)
        }}
      />
    </div>
  )
}
