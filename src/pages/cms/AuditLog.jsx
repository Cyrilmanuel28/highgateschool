import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScrollText, Trash2, FilterX } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Select, Btn, Table, ConfirmDialog, StatusBadge } from '../../components/cms/UI.jsx'
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
  stats: 'Statistic',
  menus: 'Navigation menu',
  homeSections: 'Homepage section',
  schoolInfo: 'School info',
  settings: 'Settings',
  theme: 'Theme',
  socialFeeds: 'Social feeds',
  media: 'Media'
}

export default function AuditLog() {
  const { auditLog, clearAuditLog } = useData()
  const { toast } = useToast()
  const [action, setAction] = useState('')
  const [entity, setEntity] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const entities = useMemo(() => [...new Set(auditLog.map((e) => e.entity).filter(Boolean))].sort(), [auditLog])

  const filtered = useMemo(
    () =>
      auditLog.filter(
        (e) =>
          (!action || e.action === action) &&
          (!entity || e.entity === entity)
      ),
    [auditLog, action, entity]
  )

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle={`${filtered.length} of ${auditLog.length} recorded actions — every create, edit, publish, unpublish, delete and restore is tracked`}
        actions={
          <Btn variant="danger" onClick={() => setConfirmClear(true)}>
            <Trash2 size={14} /> Clear Log
          </Btn>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={action} onChange={(e) => setAction(e.target.value)} className="max-w-[220px]">
            <option value="">All actions</option>
            {Object.entries(AUDIT_ACTION_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <Select value={entity} onChange={(e) => setEntity(e.target.value)} className="max-w-[240px]">
            <option value="">All entities</option>
            {entities.map((e) => (
              <option key={e} value={e}>{ENTITY_LABEL[e] || e}</option>
            ))}
          </Select>
          {(action || entity) && (
            <Btn variant="ghost" size="sm" onClick={() => { setAction(''); setEntity('') }}>
              <FilterX size={13} /> Clear filters
            </Btn>
          )}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <ScrollText size={13} /> Live — updates instantly as content changes
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="py-16 text-center text-sm text-slate-400">No actions recorded yet.</p>
        </Card>
      ) : (
        <Table headers={['When', 'User', 'Action', 'Item', 'Status change', 'Note']}>
          {filtered.map((e) => (
            <tr key={e.id} className="transition hover:bg-slate-50/70">
              <td className="px-5 py-3">
                <p className="text-xs font-medium text-navy-900">{formatDateTime(e.at)}</p>
                <p className="text-[11px] text-slate-400">{timeAgo(e.at)}</p>
              </td>
              <td className="px-5 py-3">
                <span className="text-sm font-semibold text-navy-900">{e.user}</span>
                {e.role && e.role !== 'user' && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">{e.role}</p>
                )}
              </td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                    e.action === 'publish'
                      ? 'bg-emerald-50 text-emerald-600'
                      : e.action === 'delete' || e.action === 'unpublish'
                        ? 'bg-red-50 text-red-600'
                        : e.action === 'restore'
                          ? 'bg-sky-50 text-sky-600'
                          : e.action === 'create'
                            ? 'bg-gold-50 text-gold-700'
                            : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {AUDIT_ACTION_LABEL[e.action] || e.action}
                </span>
              </td>
              <td className="px-5 py-3">
                <Link
                  to={e.recordId ? `/dashboard/${e.entity}/${e.recordId}` : `/dashboard/${e.entity}`}
                  className="text-sm font-medium text-navy-900 hover:text-gold-700"
                >
                  {e.title || e.entity}
                </Link>
                <p className="text-[11px] text-slate-400">{ENTITY_LABEL[e.entity] || e.entity}</p>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1.5">
                  {e.from && <StatusBadge status={e.from} />}
                  {e.from && e.to && <span className="text-xs text-slate-400">→</span>}
                  {e.to && <StatusBadge status={e.to} />}
                </div>
              </td>
              <td className="px-5 py-3 text-xs text-slate-500">{e.note || '—'}</td>
            </tr>
          ))}
        </Table>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear the audit log?"
        message="All recorded actions will be permanently removed. Consider exporting anything you need first."
        confirmLabel="Clear Log"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearAuditLog()
          toast('Audit log cleared')
          setConfirmClear(false)
        }}
      />
    </div>
  )
}
