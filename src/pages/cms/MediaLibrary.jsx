import { useMemo, useState } from 'react'
import { Upload, Copy, Check, FileText, Film, Image as ImageIcon, Trash2, Folder, FolderPlus, X } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Btn, TextInput, Select, ConfirmDialog } from '../../components/cms/UI.jsx'
import { formatDate, cn } from '../../lib/utils.js'
import { fileAcceptFor, fileKind, humanFileSize } from '../../lib/media.js'

const KIND_META = {
  image: { label: 'Images', icon: ImageIcon, color: 'text-sky-600 bg-sky-50' },
  video: { label: 'Videos', icon: Film, color: 'text-purple-600 bg-purple-50' },
  document: { label: 'Documents', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  file: { label: 'Files', icon: FileText, color: 'text-slate-600 bg-slate-100' }
}

export default function MediaLibrary() {
  const { db, resolveMediaUrl, addMedia, remove, saveSingle } = useData()
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')
  const [folder, setFolder] = useState('All')
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [newFolder, setNewFolder] = useState('')

  const media = useMemo(() => (db.media || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [db.media])

  const folders = useMemo(() => [...new Set(media.map((m) => m.folder).filter(Boolean))], [media])

  const filtered = media
    .filter((m) => filter === 'all' || fileKind(m.name) === filter)
    .filter((m) => folder === 'All' || m.folder === folder)
    .filter((m) => !query || m.name.toLowerCase().includes(query.toLowerCase()))

  const onFiles = async (files) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await addMedia(file, folder === 'All' ? 'Uncategorised' : folder, null)
      }
      toast('Upload complete')
    } catch (e) {
      toast(e.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = async (m) => {
    const url = resolveMediaUrl(m)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(m.id)
      setTimeout(() => setCopiedId(null), 1500)
      toast('URL copied — paste it into any content')
    } catch {
      toast('Could not copy URL', 'error')
    }
  }

  const totalSize = media.reduce((sum, m) => sum + (m.size || 0), 0)

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${media.length} files · ${humanFileSize(totalSize)} · stored via Base44 storage`}
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {[{ v: 'all', l: 'All' }, ...Object.entries(KIND_META).map(([k, v]) => ({ v: k, l: v.label }))].map((k) => (
              <button
                key={k.v}
                onClick={() => setFilter(k.v)}
                className={cn('rounded-lg px-3.5 py-1.5 text-xs font-semibold transition', filter === k.v ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900')}
              >
                {k.l}
              </button>
            ))}
          </div>
          <Select value={folder} onChange={(e) => setFolder(e.target.value)} className="max-w-[200px]">
            <option value="All">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="max-w-xs" />
          <div className="ml-auto flex items-center gap-2">
            {uploading && <span className="text-xs text-slate-400">Uploading…</span>}
            <label className="btn cursor-pointer bg-navy-900 text-white hover:bg-navy-800">
              <Upload size={15} /> Upload Files
              <input type="file" multiple accept={fileAcceptFor(filter)} className="hidden" onChange={(e) => {
                onFiles(e.target.files)
                e.target.value = ''
              }} />
            </label>
          </div>
        </div>
      </Card>

      {folders.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(folder === f ? 'All' : f)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                folder === f ? 'bg-gold-500 text-white' : 'bg-white text-navy-800 shadow-sm hover:bg-gold-50'
              )}
            >
              <Folder size={12} /> {f}
            </button>
          ))}
          {newFolder ? (
            <span className="flex items-center gap-1.5">
              <TextInput
                autoFocus
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newFolder.trim()) {
                    setFolder(newFolder.trim())
                    setNewFolder('')
                  }
                }}
                className="w-36 py-1.5 text-xs"
                placeholder="Folder name"
              />
              <button onClick={() => setNewFolder('')} className="text-slate-400 hover:text-navy-900"><X size={14} /></button>
            </span>
          ) : (
            <button
              onClick={() => setNewFolder('untitled')}
              className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-gold-500 hover:text-gold-600"
            >
              <FolderPlus size={12} /> New folder
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card>
          <p className="py-16 text-center text-sm text-slate-400">No files match — upload something to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => {
            const url = resolveMediaUrl(m)
            const kind = fileKind(m.name)
            const meta = KIND_META[kind]
            return (
              <div key={m.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                  {kind === 'image' ? (
                    <img src={url} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <span className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', meta.color)}>
                      <meta.icon size={26} />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-semibold text-navy-900" title={m.name}>{m.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{humanFileSize(m.size)} · {formatDate(m.createdAt, { year: undefined })}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-gold-600">
                    <Folder size={9} /> {m.folder}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => copyUrl(m)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 py-1.5 text-[11px] font-semibold text-navy-800 transition hover:bg-navy-900 hover:text-white"
                    >
                      {copiedId === m.id ? <Check size={11} /> : <Copy size={11} />} {copiedId === m.id ? 'Copied' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => setDeleting(m)}
                      className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete media file?"
        message={`"${deleting?.name}" will be removed from the library. Files already embedded in pages will keep working but the link will point to a missing file.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('media', deleting.id)
          toast('File deleted')
          setDeleting(null)
        }}
      />
    </div>
  )
}
