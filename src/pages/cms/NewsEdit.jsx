import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, Save, Send, CalendarClock, Trash2, ClipboardCheck, Ban, Archive, History, RotateCcw } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Field, TextInput, TextArea, Card, Btn, PageHeader, ConfirmDialog, StatusBadge, Select } from '../../components/cms/UI.jsx'
import RichTextEditor from '../../components/cms/RichTextEditor.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import { uid, slugify, toDateTimeLocal, formatDateTime } from '../../lib/utils.js'

export default function NewsEdit() {
  const { id } = useParams()
  const { getRecord, update, remove, create, publish: publishAction, unpublish, archive, submitForReview, schedule, restoreVersion, versionsOf, db } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const navigate = useNavigate()

  const existing = useMemo(() => (id ? getRecord('news', id) : null), [id, getRecord])
  const [article, setArticle] = useState(() =>
    existing || {
      id: null,
      title: '',
      slug: '',
      body: '',
      featuredImage: '',
      author: '',
      publishedAt: '',
      status: 'draft',
      tags: []
    }
  )
  const [tagsInput, setTagsInput] = useState((article.tags || []).join(', '))
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isNew = !existing

  const set = (patch) => setArticle((a) => ({ ...a, ...patch }))

  const parseTags = () => tagsInput.split(',').map((t) => t.trim()).filter(Boolean)

  const persist = (overrides = {}) => {
    let record
    if (isNew) record = create('news', { ...article, id: uid('nw'), ...overrides, tags: parseTags() })
    else {
      record = { ...article, ...overrides, tags: parseTags() }
      update('news', article.id, { ...article, ...overrides, tags: parseTags() })
    }
    return record
  }

  const saveDraft = () => {
    if (!article.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: article.slug || slugify(article.title), status: 'draft', publishAt: null })
    toast('Draft saved', 'info')
    navigate(`/dashboard/news/${record.id}`, { replace: true })
  }

  const submitReview = () => {
    if (!article.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: article.slug || slugify(article.title), status: 'pending', publishAt: null })
    submitForReview('news', record.id)
    toast('Submitted for review')
    navigate(`/dashboard/news/${record.id}`, { replace: true })
  }

  const publish = () => {
    if (!article.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: article.slug || slugify(article.title), publishAt: null, publishedAt: article.publishedAt || new Date().toISOString() })
    const res = publishAction('news', record.id, {
      fields: [
        { key: 'title', label: 'Title', required: true },
        { key: 'body', label: 'Body', required: true }
      ]
    })
    if (!res.ok) {
      toast(res.errors?.[0] || 'Publish failed', 'error')
      return
    }
    toast('Article published — live on the public site')
    navigate(`/dashboard/news/${record.id}`, { replace: true })
  }

  const scheduleNow = () => {
    if (!article.publishAt) {
      toast('Choose a publish date first', 'error')
      return
    }
    const record = persist({ slug: article.slug || slugify(article.title), status: 'scheduled' })
    schedule('news', record.id, article.publishAt)
    toast(`Scheduled for ${formatDateTime(article.publishAt)}`, 'info')
    navigate('/dashboard/news')
  }

  const versions = useMemo(() => (id ? versionsOf('news', id) : []), [id, versionsOf])

  return (
    <div>
      <PageHeader
        title={isNew ? 'New Article' : `Edit: ${article.title}`}
        subtitle={article.slug ? `/news/${article.slug}` : 'No slug yet'}
        actions={
          <>
            <Link to="/dashboard/news" className="btn border border-slate-300 bg-white text-navy-900 hover:bg-slate-50">
              <ArrowLeft size={15} /> All Articles
            </Link>
            {!isNew && (
              <Btn variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={15} /> Delete
              </Btn>
            )}
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <StatusBadge status={article.status} />
        <span className="text-xs text-slate-400">
          {article.status === 'published'
            ? 'This article is live on the public site.'
            : article.status === 'scheduled'
              ? `Publishes automatically at ${article.publishAt ? formatDateTime(article.publishAt) : '—'}`
              : article.status === 'pending'
                ? 'Submitted for review — awaiting approval.'
                : article.status === 'archived'
                  ? 'Archived — hidden from the site.'
                  : article.status === 'unpublished'
                    ? 'Removed from the live site — safe to edit.'
                    : 'Saved but not visible to visitors.'}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Btn variant="outline" onClick={saveDraft}><Save size={14} /> Save Draft</Btn>
          {['draft', 'pending'].includes(article.status) && (
            <Btn variant="outline" onClick={submitReview}><ClipboardCheck size={14} /> Submit for Review</Btn>
          )}
          {!['published', 'archived', 'unpublished'].includes(article.status) && (
            <Btn variant="outline" onClick={scheduleNow}><CalendarClock size={14} /> Schedule</Btn>
          )}
          {['published', 'scheduled'].includes(article.status) && (
            <Btn variant="outline" onClick={() => { unpublish('news', article.id); toast('Article unpublished'); setArticle((a) => ({ ...a, status: 'unpublished', publishAt: null })) }}>
              <Ban size={14} /> Unpublish
            </Btn>
          )}
          {!isNew && article.status !== 'archived' && (
            <Btn variant="outline" onClick={() => { archive('news', article.id); toast('Article archived'); setArticle((a) => ({ ...a, status: 'archived', publishAt: null })) }}>
              <Archive size={14} /> Archive
            </Btn>
          )}
          <Btn variant="gold" onClick={publish}><Send size={14} /> {article.status === 'published' ? 'Update & Publish' : 'Publish'}</Btn>
          {article.slug && (
            <Btn variant="outline" onClick={() => window.open(`/news/${article.slug}?preview=1`, '_blank')}>
              <Eye size={14} /> Preview
            </Btn>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Article details" className="lg:col-span-2">
          <div className="space-y-4">
            <Field label="Title" required>
              <TextInput value={article.title} onChange={(e) => set({ title: e.target.value })} placeholder={`e.g. ${info?.shortName || 'Highgate'} Wins National STEM Award`} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug">
                <TextInput value={article.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} placeholder="highgate-wins-stem-award" />
              </Field>
              <Field label="Author">
                <TextInput value={article.author || ''} onChange={(e) => set({ author: e.target.value })} placeholder="Communications Office" />
              </Field>
              <Field label="Published date">
                <TextInput type="datetime-local" value={article.publishedAt ? toDateTimeLocal(article.publishedAt) : ''} onChange={(e) => set({ publishedAt: e.target.value })} />
              </Field>
              <Field label="Publish at (schedule)">
                <TextInput type="datetime-local" value={article.publishAt ? toDateTimeLocal(article.publishAt) : ''} onChange={(e) => set({ publishAt: e.target.value })} />
              </Field>
            </div>
            <Field label="Status">
              <Select value={article.status} onChange={(e) => set({ status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="pending">Pending review</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="unpublished">Unpublished</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Field label="Tags" hint="Comma-separated, e.g. Academic, Achievement, Sport">
              <TextInput value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Academic, Achievement" />
            </Field>
            <Field label="Body (rich text)" required>
              <RichTextEditor value={article.body || ''} onChange={(body) => set({ body })} placeholder="Write the full article…" />
            </Field>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Featured image">
            <ImagePicker value={article.featuredImage} onChange={(v) => set({ featuredImage: v })} />
          </Card>
          <Card title="SEO preview">
            <p className="text-sm font-medium text-sky-700">
              {article.title || 'Untitled'} | {info?.name || 'Highgate School'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {article.body
                ? article.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) + '…'
                : 'No description yet — a snippet is generated from the article body.'}
            </p>
          </Card>
          {!isNew && (
            <Card title={`Version History (${versions.length})`}>
              {versions.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No versions yet.</p>
              ) : (
                <div className="space-y-2">
                  {versions.slice(0, 6).map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                        <History size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-navy-900">Version {versions.length - i}</p>
                        <p className="text-[11px] text-slate-400">{formatDateTime(v.at)} · {v.user}</p>
                      </div>
                      <Btn variant="outline" size="sm" onClick={() => {
                        const res = restoreVersion('news', id, v.id)
                        if (!res.ok) { toast(res.errors?.[0] || 'Restore failed', 'error'); return }
                        setArticle({ ...res.record, tags: res.record.tags || [] })
                        setTagsInput((res.record.tags || []).join(', '))
                        toast('Version restored', 'success')
                      }}>
                        <RotateCcw size={12} /> Restore
                      </Btn>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete article?"
        message={`"${article.title}" will be permanently removed.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          remove('news', article.id)
          toast('Article deleted')
          navigate('/dashboard/news')
        }}
      />
    </div>
  )
}
