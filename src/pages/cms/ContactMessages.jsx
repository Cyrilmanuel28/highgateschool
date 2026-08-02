import { useMemo, useState } from 'react'
import { Mail, Trash2, CheckCheck, ExternalLink, Clock } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Badge, Btn, ConfirmDialog } from '../../components/cms/UI.jsx'
import { formatDateTime, cn } from '../../lib/utils.js'

export default function ContactMessages() {
  const { db, update, remove } = useData()
  const { toast } = useToast()
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all')

  const messages = useMemo(
    () => (db.messages || []).slice().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [db.messages]
  )

  const filtered = filter === 'all' ? messages : filter === 'unread' ? messages.filter((m) => !m.isRead) : messages.filter((m) => m.isRead)
  const unread = messages.filter((m) => !m.isRead).length

  const markRead = (m) => {
    if (!m.isRead) {
      update('messages', m.id, { isRead: true })
    }
  }

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle={`${messages.length} total · ${unread} unread — submitted via the public contact form`} />

      <div className="mb-4 flex gap-2">
        {[
          { v: 'all', l: `All (${messages.length})` },
          { v: 'unread', l: `Unread (${unread})` },
          { v: 'read', l: `Read (${messages.length - unread})` }
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold transition',
              filter === f.v ? 'bg-navy-900 text-white' : 'bg-white text-navy-800 shadow-sm hover:bg-navy-50'
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">No messages here.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={cn('flex cursor-pointer flex-wrap items-start gap-4 p-4 transition hover:bg-slate-50 sm:flex-nowrap', !m.isRead && 'bg-gold-50/40')}
                onClick={() => {
                  setSelected(m)
                  markRead(m)
                }}
              >
                <span className={cn('mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold', m.isRead ? 'bg-slate-100 text-slate-500' : 'bg-navy-900 text-gold-400')}>
                  {m.name[0].toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-navy-900">{m.subject}</p>
                    {!m.isRead && <Badge tone="gold">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {m.name} · {m.email} · <span className="inline-flex items-center gap-1"><Clock size={10} /> {formatDateTime(m.submittedAt)}</span>
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{m.message}</p>
                </div>
                <div className="flex shrink-0 gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                    title="Reply by email"
                  >
                    <Mail size={15} />
                  </a>
                  {!m.isRead && (
                    <button onClick={() => { update('messages', m.id, { isRead: true }); toast('Marked as read') }} className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600" title="Mark as read">
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button onClick={() => setDeleting(m)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-serif text-lg font-semibold text-navy-900">{selected.subject}</h3>
              <div className="flex gap-1.5">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="btn bg-navy-900 px-3 py-1.5 text-xs text-white hover:bg-navy-800">
                  <ExternalLink size={12} /> Reply
                </a>
                <button onClick={() => setSelected(null)} className="rounded-lg px-2 text-slate-400 hover:bg-slate-100">✕</button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge tone="blue">{selected.name}</Badge>
                <a href={`mailto:${selected.email}`} className="text-gold-600 hover:underline">{selected.email}</a>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {formatDateTime(selected.submittedAt)}
                </span>
              </div>
              <p className="rounded-xl bg-slate-50 p-5 text-[15px] leading-relaxed text-navy-900">{selected.message}</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete message?"
        message={`The message from ${deleting?.name} will be permanently removed.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('messages', deleting.id)
          setDeleting(null)
          setSelected(null)
          toast('Message deleted')
        }}
      />
    </div>
  )
}
