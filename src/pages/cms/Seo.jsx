import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, TextInput, TextArea, Field, Btn, Table } from '../../components/cms/UI.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import { cn } from '../../lib/utils.js'

export default function Seo() {
  const { db, update } = useData()
  const info = db.schoolInfo
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState(db.pages?.[0]?.id || null)
  const [dirty, setDirty] = useState(false)

  const pages = useMemo(() => (db.pages || []).slice().sort((a, b) => a.slug.localeCompare(b.slug)), [db.pages])
  const page = pages.find((p) => p.id === selectedId) || null

  const set = (patch) => {
    if (!page) return
    update('pages', page.id, patch)
    setDirty(true)
  }

  return (
    <div>
      <PageHeader
        title="SEO"
        subtitle="Per-page metadata is stored in the database and rendered in the <head> of every public page"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Pages" subtitle="Select a page to edit its SEO" className="lg:col-span-1">
          <div className="space-y-1">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedId(p.id)
                  setDirty(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition',
                  selectedId === p.id ? 'bg-navy-900 text-white' : 'text-navy-800 hover:bg-slate-50'
                )}
              >
                <span>{p.title}</span>
                <span className={cn('text-[11px]', selectedId === p.id ? 'text-gold-400' : 'text-slate-400')}>/{p.slug}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {page ? (
            <>
              <Card
                title={`SEO — ${page.title}`}
                subtitle="Changes save instantly and are used by search engines and social platforms"
                action={
                  <Link to={`/dashboard/pages/${page.id}?tab=seo`} className="text-xs font-semibold text-gold-600 hover:text-gold-700">
                    Open full page editor →
                  </Link>
                }
              >
                <div className="space-y-4">
                  <Field label="Meta title" hint={`${(page.metaTitle || page.title || '').length} characters (ideal: 50–60)`}>
                    <TextInput value={page.metaTitle || ''} onChange={(e) => set({ metaTitle: e.target.value })} placeholder={page.title} />
                  </Field>
                  <Field label="Meta description" hint={`${(page.metaDescription || '').length} characters (ideal: 120–160)`}>
                    <TextArea rows={3} value={page.metaDescription || ''} onChange={(e) => set({ metaDescription: e.target.value })} placeholder="Describe this page for search results…" />
                  </Field>
                  <Field label="Open Graph image" hint="Shown when the page is shared on social media">
                    <ImagePicker value={page.ogImage} onChange={(v) => set({ ogImage: v })} />
                  </Field>
                  <Field label="Canonical URL">
                    <TextInput value={`${window.location.origin}/${page.slug}`} readOnly className="bg-slate-50 text-slate-500" />
                  </Field>
                </div>
              </Card>

              <Card title="Live search preview">
                <div className="rounded-xl border border-slate-200 p-5">
                  <p className="text-sm font-medium text-sky-700">{page.metaTitle || page.title} | {info?.name || 'Highgate School'}</p>
                  <p className="mt-1 text-xs text-emerald-700">{window.location.origin}/{page.slug}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {page.metaDescription || 'No description set — search engines will generate one from the page content.'}
                  </p>
                </div>
                {dirty && <p className="mt-3 text-right text-xs font-medium text-emerald-600">✓ Saved automatically</p>}
              </Card>
            </>
          ) : (
            <Card>
              <p className="py-16 text-center text-sm text-slate-400">No page selected.</p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Card title="All page metadata" subtitle="A quick reference of every page's current meta title">
          <Table headers={['Page', 'Meta title', 'Characters', '']}>
            {pages.map((p) => (
              <tr key={p.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-navy-900">/{p.slug}</span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">{p.metaTitle || p.title}</td>
                <td className="px-5 py-3 text-xs text-slate-400">{(p.metaTitle || p.title || '').length}</td>
                <td className="px-5 py-3">
                  <button onClick={() => window.open(`/${p.slug}`, '_blank')} className="ml-auto flex items-center gap-1.5 rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600" title="Open page">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  )
}
