import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Send, CalendarClock, Trash2, Eye, Upload, Star, StarOff } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Field, TextInput, TextArea, Select, Card, Btn, PageHeader, ConfirmDialog, Badge } from '../../components/cms/UI.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import MediaPickerModal from '../../components/cms/MediaPickerModal.jsx'
import { uid, slugify, toDateTimeLocal, formatDateTime } from '../../lib/utils.js'
import { fileAcceptFor } from '../../lib/media.js'
import { cn } from '../../lib/utils.js'

export default function GalleryEdit() {
  const { id } = useParams()
  const { getRecord, update, remove, create, addMedia, resolveMediaUrl } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()

  const existing = useMemo(() => (id ? getRecord('albums', id) : null), [id, getRecord])
  const [album, setAlbum] = useState(() =>
    existing || {
      id: null,
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      photos: [],
      status: 'draft'
    }
  )
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isNew = !existing

  const set = (patch) => setAlbum((a) => ({ ...a, ...patch }))

  const persist = (overrides = {}) => {
    let record
    if (isNew) record = create('albums', { ...album, id: uid('alb'), ...overrides })
    else {
      record = { ...album, ...overrides }
      update('albums', album.id, { ...album, ...overrides })
    }
    return record
  }

  const save = (status) => {
    if (!album.title.trim()) {
      toast('Title is required', 'error')
      return
    }
    const record = persist({ slug: album.slug || slugify(album.title), status, publishAt: null, updatedAt: new Date().toISOString() })
    toast(status === 'published' ? 'Album published' : 'Draft saved', status === 'published' ? 'success' : 'info')
    navigate(`/dashboard/gallery/${record.id}`, { replace: true })
  }

  const schedule = () => {
    if (!album.publishAt) {
      toast('Choose a publish date first', 'error')
      return
    }
    persist({ status: 'scheduled', publishAt: new Date(album.publishAt).toISOString() })
    toast(`Scheduled for ${formatDateTime(album.publishAt)}`, 'info')
    navigate('/dashboard/gallery')
  }

  const onFiles = async (files) => {
    setUploading(true)
    const urls = []
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast(`${file.name} is not an image`, 'error')
          continue
        }
        const rec = await addMedia(file, 'Gallery', null)
        urls.push(resolveMediaUrl(rec))
      }
      set({ photos: [...(album.photos || []), ...urls] })
      if (urls.length) toast(`${urls.length} photo${urls.length > 1 ? 's' : ''} added`)
    } catch (e) {
      toast(e.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const onPick = (m, url) => {
    set({ photos: [...(album.photos || []), url || m.url] })
  }

  const removePhoto = (i) => set({ photos: album.photos.filter((_, idx) => idx !== i) })

  return (
    <div>
      <PageHeader
        title={isNew ? 'New Album' : `Edit: ${album.title}`}
        subtitle={album.slug ? `/gallery/${album.slug}` : 'No slug yet'}
        actions={
          <>
            <Link to="/dashboard/gallery" className="btn border border-slate-300 bg-white text-navy-900 hover:bg-slate-50">
              <ArrowLeft size={15} /> All Albums
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
        <Badge tone={album.status === 'published' ? 'green' : album.status === 'scheduled' ? 'amber' : 'slate'}>{album.status}</Badge>
        <div className="ml-auto flex flex-wrap gap-2">
          <Btn variant="outline" onClick={() => save('draft')}>
            <Save size={14} /> Save Draft
          </Btn>
          {album.status !== 'published' && (
            <Btn variant="outline" onClick={schedule}>
              <CalendarClock size={14} /> Schedule
            </Btn>
          )}
          <Btn variant="gold" onClick={() => save('published')}>
            <Send size={14} /> {album.status === 'published' ? 'Update & Publish' : 'Publish'}
          </Btn>
          {album.slug && (
            <Btn variant="outline" onClick={() => window.open(`/gallery/${album.slug}?preview=1`, '_blank')}>
              <Eye size={14} /> Preview
            </Btn>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Album details" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <TextInput value={album.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Sports Day 2026" />
            </Field>
            <Field label="Slug">
              <TextInput value={album.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} placeholder="sports-day-2026" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <TextArea rows={2} value={album.description || ''} onChange={(e) => set({ description: e.target.value })} />
              </Field>
            </div>
            <Field label="Status">
              <Select value={album.status} onChange={(e) => set({ status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Field label="Publish at (schedule)">
              <TextInput type="datetime-local" value={album.publishAt ? toDateTimeLocal(album.publishAt) : ''} onChange={(e) => set({ publishAt: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Cover image" subtitle="Shown on the gallery grid">
          <ImagePicker value={album.coverImage} onChange={(v) => set({ coverImage: v })} />
        </Card>
      </div>

      <div className="mt-6">
        <Card
          title={`Photos (${album.photos?.length || 0})`}
          action={
            <div className="flex gap-2">
              {uploading && <span className="self-center text-xs text-slate-400">Uploading…</span>}
              <Btn variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                <Eye size={13} /> From Media Library
              </Btn>
              <label className="btn cursor-pointer bg-navy-900 px-3 py-1.5 text-xs text-white hover:bg-navy-800">
                <Upload size={13} /> Upload Photos
                <input type="file" multiple accept={fileAcceptFor('image')} className="hidden" onChange={(e) => {
                  onFiles(e.target.files)
                  e.target.value = ''
                }} />
              </label>
            </div>
          }
        >
          {!album.photos?.length ? (
            <p className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
              No photos yet — upload images or pick from the media library.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {album.photos.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                  <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-950/0 transition group-hover:bg-navy-950/55">
                    <button
                      onClick={() => {
                        set({ coverImage: src })
                        toast('Set as cover image')
                      }}
                      title="Set as cover"
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition',
                        album.coverImage === src ? 'bg-gold-500 text-white' : 'bg-white/90 text-navy-800 opacity-0 group-hover:opacity-100'
                      )}
                    >
                      {album.coverImage === src ? <Star size={14} /> : <StarOff size={14} />}
                    </button>
                    <button
                      onClick={() => removePhoto(i)}
                      title="Remove photo"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-navy-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">1</span>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onPick} filter="image" title="Add photos from media library" />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete album?"
        message={`"${album.title}" and all its photos will be removed.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          remove('albums', album.id)
          toast('Album deleted')
          navigate('/dashboard/gallery')
        }}
      />
    </div>
  )
}
