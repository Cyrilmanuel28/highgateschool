import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { History, RotateCcw } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Btn, Select, Table } from '../../components/cms/UI.jsx'
import { formatDateTime, timeAgo, cn } from '../../lib/utils.js'
import { AUDIT_ACTION_LABEL } from '../../lib/publishing.js'

const ENTITY_LABEL = {
  pages: 'Page',
  news: 'News',
  events: 'Event',
  albums: 'Album',
  videos: 'Video',
  notices: 'Notice',
  library: 'Library item',
  magazineArticles: 'Magazine article',
  vacancies: 'Vacancy',
  downloads: 'Download',
  faqs: 'FAQ',
  achievements: 'Achievement',
  clubs: 'Club',
  sports: 'Sport',
  staff: 'Staff',
  departments: 'Department',
  programs: 'Programme',
  fees: 'Fee structure',
  calendarEvents: 'Calendar event',
  campusLocations: 'Campus location',
  tourScenes: 'Tour scene',
  emergencyAlerts: 'Emergency alert',
  stats: 'Statistic'
}

export default function Versions() {
  const { versions, restoreVersion } = useData()
  const { toast } = useToast()
  const [entity, setEntity] = useState('')
  const [restoredId, setRestoredId] = useState(null)

  const entities = useMemo(() => [...new Set(versions.map((v) => v.entity))].sort(), [versions])

  const filtered = useMemo(
    () => (entity ? versions.filter((v) => v.entity === entity) : versions),
    [versions, entity]
  )

  const restore = (v) => {
    const res = restoreVersion(v.entity, v.recordId, v.id)
    if (res.ok) {
      setRestoredId(`${v.entity}:${v.recordId}`)
      toast('Version restored', 'success')
      setTimeout(() => setRestoredId(null), 2000)
    } else {
      toast(res.errors?.[0] || 'Restore failed', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Version History"
        subtitle={`${filtered.length} snapshots across all content — restore any version to roll back a record`}
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={entity} onChange={(e) => setEntity(e.target.value)} className="max-w-[260px]">
            <option value="">All entities</option>
            {entities.map((e) => (
              <option key={e} value={e}>{ENTITY_LABEL[e] || e}</option>
            ))}
          </Select>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <History size={13} /> Up to 12 versions kept per record
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="py-16 text-center text-sm text-slate-400">
            No versions yet — snapshots are captured automatically when content is saved, published, or deleted.
          </p>
        </Card>
      ) : (
        <Table headers={['Record', 'Entity', 'Version', 'Saved', 'By', 'Action', '']}>
          {filtered.map((v, i) => (
            <tr key={v.id} className="transition hover:bg-slate-50/70">
              <td className="px-5 py-3">
                <Link
                  to={v.recordId ? `/dashboard/${v.entity}/${v.recordId}` : `/dashboard/${v.entity}`}
                  className="text-sm font-semibold text-navy-900 hover:text-gold-700"
                >
                  {v.snapshot?.title || v.snapshot?.name || v.recordId}
                </Link>
              </td>
              <td className="px-5 py-3 text-xs text-slate-500">{ENTITY_LABEL[v.entity] || v.entity}</td>
              <td className="px-5 py-3 text-sm font-medium text-navy-900">
                #{filtered.length - i}
              </td>
              <td className="px-5 py-3">
                <p className="text-xs font-medium text-navy-900">{formatDateTime(v.at)}</p>
                <p className="text-[11px] text-slate-400">{timeAgo(v.at)}</p>
              </td>
              <td className="px-5 py-3 text-sm text-slate-600">{v.user}</td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                    v.action === 'publish'
                      ? 'bg-emerald-50 text-emerald-600'
                      : v.action === 'delete' || v.action === 'unpublish'
                        ? 'bg-red-50 text-red-600'
                        : v.action === 'restore'
                          ? 'bg-sky-50 text-sky-600'
                          : v.action === 'create'
                            ? 'bg-gold-50 text-gold-700'
                            : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {AUDIT_ACTION_LABEL[v.action] || v.action}
                </span>
              </td>
              <td className="px-5 py-3">
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() => restore(v)}
                  disabled={restoredId === `${v.entity}:${v.recordId}`}
                >
                  <RotateCcw size={13} /> {restoredId === `${v.entity}:${v.recordId}` ? 'Restored' : 'Restore'}
                </Btn>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
