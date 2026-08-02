import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, History, Eye, Save, Send, CalendarClock, Copy, RotateCcw, ClipboardCheck, Archive, Ban } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import {
  Field, TextInput, TextArea, Select, Card, Btn, Toggle, PageHeader, ConfirmDialog, StatusBadge
} from '../../components/cms/UI.jsx'
import BlockEditor, { BLOCK_TYPES } from '../../components/cms/BlockEditor.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import { uid, slugify, toDateTimeLocal, formatDateTime } from '../../lib/utils.js'
import { cn } from '../../lib/utils.js'

export default function PageEdit() {
  const { id } = useParams()
  const { getRecord, update, remove, create, publish: publishAction, unpublish, archive, submitForReview, schedule, restoreVersion, versionsOf, db } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const navigate = useNavigate()

  const getFreshRecord = useCallback(() => (id ? getRecord('pages', id) : null), [id, getRecord, db.pages])
  const existing = useMemo(() => getFreshRecord(), [getFreshRecord])
  const [page, setPage] = useState(() =>
    existing || {
      id: null,
      slug: '',
      title: '',
      status: 'draft',
      publishAt: '',
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      contentBlocks: [],
      isVisible: true
    }
  )

  useEffect(() => {
    if (existing && existing.id === page.id) {
      setPage((prev) => ({ ...existing, contentBlocks: existing.contentBlocks || prev.contentBlocks || [] }))
    }
  }, [existing])

  const [tab, setTab] = useState('content')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isNew = !existing

  const set = (patch) => setPage((p) => ({ ...p, ...patch }))

  const persist = (overrides = {}) => {
    let record
    if (isNew) {
      record = create('pages', { ...page, id: uid('pg'), ...overrides })
    } else {
      record = { ...page, ...overrides }
      update('pages', page.id, { ...page, ...overrides })
    }
    return record
  }

  const saveDraft = () => {
    if (!page.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const slug = page.slug || slugify(page.title)
    const record = persist({ slug, status: 'draft', publishAt: null })
    toast('Draft saved', 'info')
    navigate(`/dashboard/pages/${record.id}`, { replace: true })
  }

  const submitReview = () => {
    if (!page.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: page.slug || slugify(page.title), status: 'pending', publishAt: null })
    submitForReview('pages', record.id)
    toast('Submitted for review')
    navigate(`/dashboard/pages/${record.id}`, { replace: true })
  }

  const publish = () => {
    if (!page.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: page.slug || slugify(page.title) })
    const res = publishAction('pages', record.id, { fields: [{ key: 'title', label: 'Title', required: true }] })
    if (!res.ok) {
      toast(res.errors?.[0] || 'Publish failed', 'error')
      return
    }
    toast('Page published — live on the public site')
    navigate(`/dashboard/pages/${record.id}`, { replace: true })
  }

  const scheduleNow = () => {
    if (!page.publishAt) {
      toast('Choose a publish date and time first', 'error')
      return
    }
    const record = persist({ slug: page.slug || slugify(page.title), status: 'scheduled' })
    schedule('pages', record.id, page.publishAt)
    toast(`Scheduled for ${formatDateTime(page.publishAt)}`, 'info')
    navigate('/dashboard/pages')
  }

  const addBlock = () => {
    const block = { id: uid('blk'), type: 'richText' }
    set({ contentBlocks: [...(page.contentBlocks || []), block] })
    toast('Block added — configure it below', 'info')
  }

  const moveBlock = (i, dir) => {
    const blocks = [...page.contentBlocks]
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
    set({ contentBlocks: blocks })
  }

  const removeBlock = (i) => {
    set({ contentBlocks: page.contentBlocks.filter((_, idx) => idx !== i) })
  }

  const restoreFromHistory = (v) => {
    if (!id) return
    const res = restoreVersion('pages', id, v.id)
    if (!res.ok) {
      toast(res.errors?.[0] || 'Restore failed', 'error')
      return
    }
    setPage({ ...res.record, contentBlocks: res.record.contentBlocks || [] })
    toast('Version restored — the restored content is now the current draft', 'success')
  }

  const duplicatePage = () => {
    const copy = { ...page, id: uid('pg'), title: `${page.title} (Copy)`, slug: `${page.slug || slugify(page.title)}-copy`, status: 'draft', versionHistory: [] }
    create('pages', copy)
    toast('Page duplicated as draft')
    navigate(`/dashboard/pages/${copy.id}`, { replace: true })
  }

  const versions = useMemo(() => (id ? versionsOf('pages', id) : []), [id, versionsOf])

  return (
    <div>
      <PageHeader
        title={isNew ? 'New Page' : `Edit: ${page.title}`}
        subtitle={page.slug ? `Public URL: /${page.slug}` : 'No slug yet — set one below'}
        actions={
          <>
            <Link to="/dashboard/pages" className="btn border border-slate-300 bg-white text-navy-900 hover:bg-slate-50">
              <ArrowLeft size={15} /> All Pages
            </Link>
            {!isNew && (
              <Btn variant="outline" onClick={duplicatePage}>
                <Copy size={15} /> Duplicate
              </Btn>
            )}
            {!isNew && (
              <Btn variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={15} /> Delete
              </Btn>
            )}
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <StatusBadge status={page.status} />
        <span className="text-xs text-slate-400">
          {page.status === 'published'
            ? 'This page is live on the public site.'
            : page.status === 'scheduled'
              ? `Publishes automatically at ${page.publishAt ? formatDateTime(page.publishAt) : '—'}`
              : page.status === 'pending'
                ? 'Submitted for review — awaiting approval.'
                : page.status === 'archived'
                  ? 'Archived — hidden from the site.'
                  : page.status === 'unpublished'
                    ? 'Removed from the live site — safe to edit.'
                    : 'Saved but not visible to visitors.'}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Btn variant="outline" onClick={saveDraft}>
            <Save size={14} /> Save Draft
          </Btn>
          {['draft', 'pending'].includes(page.status) && (
            <Btn variant="outline" onClick={submitReview}>
              <ClipboardCheck size={14} /> Submit for Review
            </Btn>
          )}
          {!['published', 'archived', 'unpublished'].includes(page.status) && (
            <Btn variant="outline" onClick={scheduleNow}>
              <CalendarClock size={14} /> Schedule
            </Btn>
          )}
          {['published', 'scheduled'].includes(page.status) && (
            <Btn variant="outline" onClick={() => { unpublish('pages', page.id); toast('Page unpublished'); setPage((p) => ({ ...p, status: 'unpublished', publishAt: null })) }}>
              <Ban size={14} /> Unpublish
            </Btn>
          )}
          {!isNew && page.status !== 'archived' && (
            <Btn variant="outline" onClick={() => { archive('pages', page.id); toast('Page archived'); setPage((p) => ({ ...p, status: 'archived', publishAt: null })) }}>
              <Archive size={14} /> Archive
            </Btn>
          )}
          <Btn variant="gold" onClick={publish}>
            <Send size={14} /> {page.status === 'published' ? 'Update & Publish' : 'Publish'}
          </Btn>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <Card title="Page details" className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <TextInput
                value={page.title}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="e.g. About Us"
              />
            </Field>
            <Field label="Slug" hint={page.slug && `Live URL: /${page.slug}`}>
              <TextInput
                value={page.slug}
                onChange={(e) => set({ slug: slugify(e.target.value) })}
                placeholder="about"
              />
            </Field>
            <Field label="Status">
              <Select value={page.status} onChange={(e) => set({ status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="pending">Pending review</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="unpublished">Unpublished</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Field label="Publish at (for scheduling)">
              <TextInput
                type="datetime-local"
                value={page.publishAt ? toDateTimeLocal(page.publishAt) : ''}
                onChange={(e) => set({ publishAt: e.target.value })}
              />
            </Field>
            <Field label="Visible on public site">
              <Toggle checked={page.isVisible !== false} onChange={(v) => set({ isVisible: v })} />
            </Field>
            {page.slug && (
              <div className="sm:col-span-2">
                <Btn variant="outline" onClick={() => window.open(`/${page.slug}?preview=1`, '_blank')}>
                  <Eye size={14} /> Preview Page
                </Btn>
              </div>
            )}
          </div>
        </Card>
        <Card title="Open Graph image" className="lg:col-span-1">
          <ImagePicker value={page.ogImage} onChange={(v) => set({ ogImage: v })} label="Choose image" />
        </Card>
      </div>

      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {[
          { key: 'content', label: `Content Blocks (${page.contentBlocks?.length || 0})` },
          { key: 'seo', label: 'SEO & Metadata' },
          { key: 'versions', label: `Version History (${versions.length})` }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'border-b-2 px-4 py-3 text-sm font-semibold transition',
              tab === t.key ? 'border-gold-500 text-navy-900' : 'border-transparent text-slate-400 hover:text-navy-800'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div className="space-y-4">
          {(page.contentBlocks || []).map((block, i) => (
            <div key={block.id || i} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-navy-900 text-[10px] text-white">{i + 1}</span>
                  {BLOCK_TYPES.find((t) => t.value === block.type)?.label || block.type}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900 disabled:opacity-30">
                    ↑
                  </button>
                  <button onClick={() => moveBlock(i, 1)} disabled={i === (page.contentBlocks?.length || 0) - 1} className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900 disabled:opacity-30">
                    ↓
                  </button>
                  <button onClick={() => removeBlock(i)} className="rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <BlockEditor
                  block={block}
                  onChange={(nb) => {
                    const blocks = page.contentBlocks.map((b, idx) => (idx === i ? nb : b))
                    set({ contentBlocks: blocks })
                  }}
                  info={info}
                />
              </div>
            </div>
          ))}
          <button onClick={addBlock} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-5 text-sm font-semibold text-slate-500 transition hover:border-gold-500 hover:text-gold-600">
            <Plus size={16} /> Add Content Block
          </button>
        </div>
      )}

      {tab === 'seo' && (
        <Card title="Search engine optimisation">
          <div className="space-y-4">
            <Field label="Meta title" hint={`Shown in search results — currently ${(page.metaTitle || page.title || '').length}/60 characters`}>
              <TextInput value={page.metaTitle || ''} onChange={(e) => set({ metaTitle: e.target.value })} placeholder={page.title} />
            </Field>
            <Field label="Meta description" hint={`Suggested 120–160 characters — currently ${(page.metaDescription || '').length}`}>
              <TextArea rows={3} value={page.metaDescription || ''} onChange={(e) => set({ metaDescription: e.target.value })} placeholder="A short, compelling summary of this page…" />
            </Field>
            <Field label="Open Graph image" hint="Used when the page is shared on social media">
              <ImagePicker value={page.ogImage} onChange={(v) => set({ ogImage: v })} />
            </Field>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live preview</p>
              <p className="mt-1.5 text-sm font-medium text-sky-700">{page.metaTitle || page.title || 'Untitled'} | {info?.name || 'Highgate School'}</p>
              <p className="mt-0.5 text-xs text-slate-500">{page.metaDescription || 'No description set — a summary will be generated from the page content.'}</p>
              <p className="mt-0.5 text-xs text-emerald-700">{typeof window !== 'undefined' ? window.location.origin : ''}/{page.slug || '…'}</p>
            </div>
          </div>
        </Card>
      )}

      {tab === 'versions' && (
        <Card
          title="Version history"
          subtitle="A snapshot is saved automatically on every publish, status change, delete and restore. Roll back at any time."
        >
          {versions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No versions yet — snapshots are captured automatically as you work.
            </p>
          ) : (
            <div className="space-y-3">
              {versions.map((v, i) => (
                <div key={v.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <History size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">Version {versions.length - i}</p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(v.at)} · by {v.user} · <span className="font-semibold">{v.action}</span>
                    </p>
                  </div>
                  <Btn variant="outline" size="sm" onClick={() => restoreFromHistory(v)}>
                    <RotateCcw size={13} /> Restore
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete page?"
        message={`"${page.title}" and all its versions will be permanently removed.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          remove('pages', page.id)
          toast('Page deleted')
          navigate('/dashboard/pages')
        }}
      />
    </div>
  )
}
