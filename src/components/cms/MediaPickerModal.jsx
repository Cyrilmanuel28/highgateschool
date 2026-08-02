import { useMemo, useState } from 'react'
import { Upload, Copy, Check, FileText, FolderOpen, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Modal, Btn, TextInput, Select, Field } from './UI.jsx'
import { cn, formatDate } from '../../lib/utils.js'
import { fileAcceptFor, fileKind, humanFileSize } from '../../lib/media.js'

export default function MediaPickerModal({ open, onClose, onSelect, title = 'Choose an image', filter = 'image' }) {
  const { db, resolveMediaUrl, addMedia, remove } = useData()
  const { toast } = useToast()
  const [folder, setFolder] = useState('All')
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const folders = useMemo(() => [...new Set((db.media || []).map((m) => m.folder).filter(Boolean))], [db.media])

  const items = useMemo(() => {
    return (db.media || [])
      .filter((m) => (filter === 'all' ? true : fileKind(m.name) === filter))
      .filter((m) => folder === 'All' || m.folder === folder)
      .filter((m) => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [db.media, folder, query, filter])

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

  const copyUrl = async (e, m) => {
    e.stopPropagation()
    const url = resolveMediaUrl(m)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(m.id)
      setTimeout(() => setCopiedId(null), 1500)
      toast('URL copied to clipboard')
    } catch {
      toast('Could not copy URL', 'error')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search media…"
          className="max-w-xs"
        />
        <Select value={folder} onChange={(e) => setFolder(e.target.value)} className="max-w-[180px]">
          <option value="All">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
        <div className="ml-auto flex items-center gap-2">
          {uploading && <span className="text-xs font-medium text-slate-400">Uploading…</span>}
          <label className="btn cursor-pointer bg-navy-900 text-white hover:bg-navy-800">
            <Upload size={15} /> Upload
            <input
              type="file"
              multiple
              accept={fileAcceptFor(filter)}
              className="hidden"
              onChange={(e) => {
                onFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <FolderOpen size={32} className="text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No media yet — upload your first file above.</p>
        </div>
      ) : (
        <div className="grid max-h-[52vh] grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
          {items.map((m) => {
            const url = resolveMediaUrl(m)
            const kind = fileKind(m.name)
            return (
              <button
                key={m.id}
                onClick={() => onSelect && onSelect(m, url)}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:border-gold-500 hover:shadow-card"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-slate-100">
                  {kind === 'image' ? (
                    <img src={url} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <FileText size={30} className="text-slate-400" />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold text-navy-900">{m.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {humanFileSize(m.size)} · {formatDate(m.createdAt, { year: undefined })}
                  </p>
                </div>
                <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <span
                    onClick={(e) => copyUrl(e, m)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900/90 text-white backdrop-blur"
                    title="Copy URL"
                  >
                    {copiedId === m.id ? <Check size={13} /> : <Copy size={13} />}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      remove('media', m.id)
                      toast('Media deleted')
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/90 text-white backdrop-blur"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
