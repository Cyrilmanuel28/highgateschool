import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom'
import {
  Plus, ArrowLeft, Save, Send, CalendarClock, Trash2, Pencil, ExternalLink, Upload,
  EyeOff, Archive as ArchiveIcon, ClipboardCheck, History, RotateCcw
} from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import {
  Field, TextInput, TextArea, Select, Toggle, Card, Btn, PageHeader, ConfirmDialog, StatusBadge,
  ItemListEditor, Table
} from '../../components/cms/UI.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import RichTextEditor from '../../components/cms/RichTextEditor.jsx'
import { uid, toDateTimeLocal, formatDateTime } from '../../lib/utils.js'
import { cn } from '../../lib/utils.js'
import { validateForPublish, AUDIT_ACTION_LABEL } from '../../lib/publishing.js'
import { readFileAsDataURL } from '../../lib/media.js'

export default function SimpleCrud({
  collection,
  title,
  newLabel = 'New Item',
  publicPath,
  columns = [],
  fields = [],
  sortField,
  sortDir = 'desc',
  defaultValues = {},
  showStatus = false,
  publicSlugPath = ''
}) {
  const { db, getRecord, update, remove, create, restoreVersion, versionsOf } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams()
  const mode = id ? 'edit' : window.location.pathname.endsWith('/new') ? 'new' : 'list'

  const [deleting, setDeleting] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const existing = useMemo(() => (id ? getRecord(collection, id) : null), [id, getRecord, collection])

  const [item, setItem] = useState(() => {
    if (mode === 'edit' && existing) return { ...existing }
    if (mode === 'new') {
      const seed = {}
      fields.forEach((f) => {
        if (f.type === 'select' || f.type === 'status') seed[f.key] = f.default || ''
        else if (f.type === 'number') seed[f.key] = 0
        else if (f.type === 'toggle') seed[f.key] = f.default !== undefined ? f.default : true
        else if (f.type === 'jsonItems') seed[f.key] = []
        else if (f.type === 'tags') seed[f.key] = []
        else seed[f.key] = ''
      })
      return { ...defaultValues, ...seed, status: defaultValues.status || (showStatus ? 'draft' : 'published') }
    }
    return null
  })

  const rows = useMemo(() => {
    const list = (db[collection] || []).slice()
    if (sortField) {
      list.sort((a, b) => {
        const av = a[sortField], bv = b[sortField]
        if (sortDir === 'asc') return (av ?? 0) > (bv ?? 0) ? 1 : -1
        if (sortDir === 'string') return String(av ?? '').localeCompare(String(bv ?? ''))
        return (av ? new Date(av).getTime() : 0) > (bv ? new Date(bv).getTime() : 0) ? -1 : 1
      })
    }
    return list
  }, [db, collection, sortField, sortDir])

  const versions = useMemo(
    () => (mode === 'edit' && item?.id ? versionsOf(collection, item.id) : []),
    [mode, item, collection, versionsOf, db]
  )

  if (mode === 'edit' && !existing) return <Navigate to={`/dashboard/${collection}`} replace />

  if (mode !== 'list') {
    const set = (patch) => setItem((v) => ({ ...v, ...patch }))

    const persist = (overrides = {}) => {
      let record
      if (mode === 'new') record = create(collection, { ...item, id: uid(collection.slice(0, 3)), ...overrides })
      else {
        record = { ...item, ...overrides }
        update(collection, item.id, { ...item, ...overrides })
      }
      return record
    }

    const save = (statusOverride) => {
      const requireSlug = statusOverride === 'published'
      const check = validateForPublish(item, fields, requireSlug)
      if (!check.ok) {
        toast(`Cannot ${statusOverride === 'published' ? 'publish' : 'save'} — ${check.errors.slice(0, 2).join(' · ')}`, 'error')
        return null
      }
      const overrides = { ...(statusOverride ? { status: statusOverride, publishAt: null } : {}) }
      if (statusOverride === 'published' && !item.publishedAt) overrides.publishedAt = new Date().toISOString()
      const record = persist(overrides)
      if (statusOverride === 'published') toast('Published — now live on the public site', 'success')
      else if (statusOverride === 'unpublished') toast('Unpublished — no longer visible on the public site', 'info')
      else if (statusOverride === 'pending') toast('Submitted for review', 'info')
      else if (statusOverride === 'archived') toast('Archived', 'info')
      else toast('Saved', 'info')
      navigate(`/dashboard/${collection}/${record.id}`, { replace: true })
      return record
    }

    const schedule = () => {
      if (!item.publishAt) {
        toast('Choose a publish date first', 'error')
        return
      }
      const check = validateForPublish(item, fields, false)
      if (!check.ok) {
        toast(`Cannot schedule — ${check.errors.slice(0, 2).join(' · ')}`, 'error')
        return
      }
      persist({ status: 'scheduled', publishAt: new Date(item.publishAt).toISOString() })
      toast(`Scheduled for ${formatDateTime(item.publishAt)}`, 'info')
      navigate(`/dashboard/${collection}`)
    }

    const restore = (v) => {
      if (mode !== 'edit' || !item?.id) return
      const res = restoreVersion(collection, item.id, v.id)
      if (res.ok) {
        toast('Version restored — review and publish to go live', 'success')
        setItem({ ...res.record })
      } else {
        toast(res.errors?.[0] || 'Restore failed', 'error')
      }
    }

    const inputFor = (f) => {
      switch (f.type) {
        case 'textarea':
          return <TextArea rows={f.rows || 3} value={item[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })} placeholder={f.placeholder} />
        case 'number':
          return <TextInput type="number" value={item[f.key] ?? 0} onChange={(e) => set({ [f.key]: Number(e.target.value) })} />
        case 'select':
          return (
            <Select value={item[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })}>
              <option value="">—</option>
              {f.options.map((o) => (
                <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
                  {typeof o === 'string' ? o : o.label}
                </option>
              ))}
            </Select>
          )
        case 'selectFrom':
          return (
            <Select value={item[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })}>
              <option value="">—</option>
              {f.source().map((o) => (
                <option key={o[f.optionValue]} value={o[f.optionValue]}>{o[f.optionLabel]}</option>
              ))}
            </Select>
          )
        case 'status':
          return (
            <Select value={item[f.key] || 'draft'} onChange={(e) => set({ [f.key]: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="unpublished">Unpublished</option>
              <option value="archived">Archived</option>
            </Select>
          )
        case 'toggle':
          return <Toggle checked={Boolean(item[f.key])} onChange={(v) => set({ [f.key]: v })} label={f.toggleLabel} />
        case 'image':
          return <ImagePicker value={item[f.key] || ''} onChange={(v) => set({ [f.key]: v })} label={f.imageLabel || 'Choose image'} />
        case 'datetime':
          return <TextInput type="datetime-local" value={item[f.key] ? toDateTimeLocal(item[f.key]) : ''} onChange={(e) => set({ [f.key]: e.target.value })} />
        case 'richText':
          return <RichTextEditor value={item[f.key] || ''} onChange={(v) => set({ [f.key]: v })} placeholder={f.placeholder} />
        case 'jsonItems':
          return (
            <ItemListEditor
              items={item[f.key]}
              onChange={(items) => set({ [f.key]: items })}
              itemTitle={f.itemLabel || 'Item'}
              fields={f.itemFields || [{ key: 'label', label: 'Label', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }]}
            />
          )
        case 'file':
          return (
            <div className="space-y-2">
              <TextInput value={item[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })} placeholder="or paste a file URL" />
              <label className="btn w-fit cursor-pointer border border-slate-300 bg-white text-navy-900 hover:bg-slate-50">
                <Upload size={14} /> Upload document
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 8 * 1024 * 1024) {
                      toast('File too large (max 8 MB)', 'error')
                      return
                    }
                    const dataUrl = await readFileAsDataURL(file)
                    set({ [f.key]: dataUrl, _fileName: file.name })
                    toast('Document attached')
                  }}
                />
              </label>
              {item._fileName && <p className="text-xs text-slate-400">Attached: {item._fileName}</p>}
            </div>
          )
        case 'tags':
          return (
            <TextInput
              value={(item[f.key] || []).join(', ')}
              onChange={(e) => set({ [f.key]: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              placeholder="Comma separated"
            />
          )
        default:
          return <TextInput value={item[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })} placeholder={f.placeholder} />
      }
    }

    const publicUrl = publicSlugPath ? `${publicSlugPath}/${item.slug || item.id}` : ''

    const showReview = showStatus && (item.status === 'draft' || item.status === 'pending')
    const showUnpublish = showStatus && item.status === 'published'
    const showSchedule = showStatus && item.status !== 'published'
    const showArchive = showStatus && item.status !== 'archived' && mode === 'edit'

    return (
      <div>
        <PageHeader
          title={mode === 'new' ? `New ${newLabel}` : `Edit: ${item?.title || item?.name || title}`}
          subtitle={publicUrl || 'Changes take effect when published'}
          actions={
            <>
              <Link to={`/dashboard/${collection}`} className="btn border border-slate-300 bg-white text-navy-900 hover:bg-slate-50">
                <ArrowLeft size={15} /> All
              </Link>
              {mode === 'edit' && (
                <Btn variant="danger" onClick={() => setDeleting(item)}>
                  <Trash2 size={15} /> Delete
                </Btn>
              )}
            </>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {showStatus && <StatusBadge status={item.status} />}
          <span className="text-xs text-slate-400">
            {showStatus && item.status === 'published'
              ? 'Live on the public site.'
              : showStatus && item.status === 'scheduled'
                ? `Publishes automatically at ${formatDateTime(item.publishAt)}`
                : showStatus && item.status === 'pending'
                  ? 'Awaiting review — not visible to visitors.'
                  : showStatus
                    ? 'Saved but not visible to visitors.'
                    : 'Changes apply to the public site immediately.'}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Btn variant="outline" onClick={() => save(null)}>
              <Save size={14} /> Save
            </Btn>
            {showReview && (
              <Btn variant="outline" onClick={() => save('pending')}>
                <ClipboardCheck size={14} /> Submit for Review
              </Btn>
            )}
            {showSchedule && (
              <Btn variant="outline" onClick={schedule}>
                <CalendarClock size={14} /> Schedule
              </Btn>
            )}
            {showUnpublish && (
              <Btn variant="outline" onClick={() => save('unpublished')}>
                <EyeOff size={14} /> Unpublish
              </Btn>
            )}
            {showArchive && (
              <Btn variant="outline" onClick={() => save('archived')}>
                <ArchiveIcon size={14} /> Archive
              </Btn>
            )}
            <Btn variant="gold" onClick={() => save(showStatus ? 'published' : null)}>
              <Send size={14} /> {showStatus ? (item.status === 'published' ? 'Update & Publish' : 'Publish') : 'Save'}
            </Btn>
            {publicUrl && (
              <Btn variant="outline" onClick={() => window.open(`${publicUrl}${item.slug ? '?preview=1' : ''}`, '_blank')}>
                <ExternalLink size={14} /> Preview
              </Btn>
            )}
          </div>
        </div>

        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.key} label={f.label} required={f.required} hint={f.hint} className={cn(f.span && 'sm:col-span-2')}>
                {inputFor(f)}
              </Field>
            ))}
          </div>
        </Card>

        {showStatus && mode === 'edit' && (
          <Card
            className="mt-6"
            title={`Version History (${versions.length})`}
            subtitle="Snapshots are captured before publishes, edits, and status changes. Restoring a version lets you roll back safely."
            action={
              <Btn variant="outline" size="sm" onClick={() => setShowHistory((v) => !v)}>
                <History size={13} /> {showHistory ? 'Hide' : 'Show'}
              </Btn>
            }
          >
            {!showHistory ? (
              <p className="text-xs text-slate-400">Click “Show” to browse previous versions of this record.</p>
            ) : versions.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No versions recorded yet — they are captured when you save or publish.</p>
            ) : (
              <div className="space-y-3">
                {versions.map((v, i) => (
                  <div key={v.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                      <History size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy-900">
                        Version {versions.length - i}
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {AUDIT_ACTION_LABEL[v.action] || v.action}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(v.at)} · by {v.user || 'admin'}
                      </p>
                    </div>
                    <Btn variant="outline" size="sm" onClick={() => restore(v)}>
                      <RotateCcw size={13} /> Restore
                    </Btn>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <ConfirmDialog
          open={Boolean(deleting)}
          title={`Delete ${newLabel.toLowerCase()}?`}
          message="This cannot be undone."
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(collection, deleting.id)
            toast('Deleted')
            navigate(`/dashboard/${collection}`)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={title}
        actions={
          <Link to="new" className="btn bg-navy-900 text-white hover:bg-navy-800">
            <Plus size={15} /> {newLabel}
          </Link>
        }
      />

      <Table headers={[...columns.map((c) => c.label), '']}>
        {rows.map((row) => (
          <tr key={row.id} className="transition hover:bg-slate-50/70">
            {columns.map((c) => (
              <td key={c.key} className="px-5 py-3.5">
                {c.render ? c.render(row) : (
                  <span className="text-sm font-medium text-navy-900">{String(row[c.key] ?? '—')}</span>
                )}
              </td>
            ))}
            <td className="px-5 py-3.5">
              <div className="flex items-center justify-end gap-1.5">
                {publicSlugPath && row.slug && (
                  <button
                    onClick={() => window.open(`${publicSlugPath}/${row.slug}`, '_blank')}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                    title="View on site"
                  >
                    <ExternalLink size={15} />
                  </button>
                )}
                <button
                  onClick={() => navigate(`${row.id}`)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-800"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleting(row)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${newLabel.toLowerCase()}?`}
        message="This cannot be undone."
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove(collection, deleting.id)
          toast('Deleted')
          setDeleting(null)
        }}
      />
    </div>
  )
}
