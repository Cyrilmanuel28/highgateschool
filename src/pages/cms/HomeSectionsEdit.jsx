import { useState } from 'react'
import { ChevronDown, ChevronRight, Save, GripVertical } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Field, TextInput, TextArea, Btn } from '../../components/cms/UI.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import { cn } from '../../lib/utils.js'

const SECTION_LABELS = {
  hhero: 'Hero Banner',
  hwelcome: 'Welcome Section',
  hstats: 'Statistics',
  hprograms: 'Programmes',
  hnews: 'Latest News',
  hevents: 'Upcoming Events',
  hquote: 'Quote',
  hgallery: 'Gallery Preview',
  hcta: 'Call to Action',
}

function HeroFields({ section, onChange }) {
  const c = section.content || {}
  const set = (patch) => onChange({ ...section, content: { ...c, ...patch } })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Kicker text" className="sm:col-span-2">
        <TextInput value={c.kicker || ''} onChange={(e) => set({ kicker: e.target.value })} />
      </Field>
      <Field label="Title" className="sm:col-span-2">
        <TextInput value={c.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Subtitle" className="sm:col-span-2">
        <TextArea rows={3} value={c.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
      </Field>
      <Field label="Background image">
        <ImagePicker value={c.image} onChange={(v) => set({ image: v })} />
      </Field>
      <div className="space-y-3">
        <Field label="Button 1 text">
          <TextInput value={c.cta1?.label || ''} onChange={(e) => set({ cta1: { ...c.cta1, label: e.target.value } })} />
        </Field>
        <Field label="Button 1 link">
          <TextInput value={c.cta1?.to || ''} onChange={(e) => set({ cta1: { ...c.cta1, to: e.target.value } })} />
        </Field>
        <Field label="Button 2 text">
          <TextInput value={c.cta2?.label || ''} onChange={(e) => set({ cta2: { ...c.cta2, label: e.target.value } })} />
        </Field>
        <Field label="Button 2 link">
          <TextInput value={c.cta2?.to || ''} onChange={(e) => set({ cta2: { ...c.cta2, to: e.target.value } })} />
        </Field>
      </div>
    </div>
  )
}

function WelcomeFields({ section, onChange }) {
  const c = section.content || {}
  const set = (patch) => onChange({ ...section, content: { ...c, ...patch } })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" className="sm:col-span-2">
        <TextInput value={c.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Body (HTML)" className="sm:col-span-2">
        <TextArea rows={5} value={c.body || ''} onChange={(e) => set({ body: e.target.value })} />
      </Field>
      <Field label="Image">
        <ImagePicker value={c.image} onChange={(v) => set({ image: v })} />
      </Field>
    </div>
  )
}

function StatsFields({ section, onChange }) {
  const c = section.content || {}
  const items = c.items || []
  const setItems = (newItems) => onChange({ ...section, content: { ...c, items: newItems } })
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <TextInput value={item.label || ''} onChange={(e) => {
            const next = [...items]; next[i] = { ...next[i], label: e.target.value }; setItems(next)
          }} placeholder="Label" />
          <TextInput value={item.value || ''} onChange={(e) => {
            const next = [...items]; next[i] = { ...next[i], value: e.target.value }; setItems(next)
          }} placeholder="Value" />
          <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-600 px-2">&times;</button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, { label: '', value: '' }])}
        className="text-sm font-medium text-gold-600 hover:text-gold-700">+ Add stat</button>
    </div>
  )
}

function SimpleTitleFields({ section, onChange }) {
  const c = section.content || {}
  const set = (patch) => onChange({ ...section, content: { ...c, ...patch } })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title">
        <TextInput value={c.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <TextInput value={c.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
      </Field>
    </div>
  )
}

function QuoteFields({ section, onChange }) {
  const c = section.content || {}
  const set = (patch) => onChange({ ...section, content: { ...c, ...patch } })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Quote" className="sm:col-span-2">
        <TextArea rows={3} value={c.quote || ''} onChange={(e) => set({ quote: e.target.value })} />
      </Field>
      <Field label="Author">
        <TextInput value={c.author || ''} onChange={(e) => set({ author: e.target.value })} />
      </Field>
      <Field label="Role">
        <TextInput value={c.role || ''} onChange={(e) => set({ role: e.target.value })} />
      </Field>
    </div>
  )
}

function CtaFields({ section, onChange }) {
  const c = section.content || {}
  const set = (patch) => onChange({ ...section, content: { ...c, ...patch } })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" className="sm:col-span-2">
        <TextInput value={c.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Text" className="sm:col-span-2">
        <TextArea rows={2} value={c.text || ''} onChange={(e) => set({ text: e.target.value })} />
      </Field>
      <Field label="Button 1 text">
        <TextInput value={c.cta1?.label || ''} onChange={(e) => set({ cta1: { ...c.cta1, label: e.target.value } })} />
      </Field>
      <Field label="Button 1 link">
        <TextInput value={c.cta1?.to || ''} onChange={(e) => set({ cta1: { ...c.cta1, to: e.target.value } })} />
      </Field>
      <Field label="Button 2 text">
        <TextInput value={c.cta2?.label || ''} onChange={(e) => set({ cta2: { ...c.cta2, label: e.target.value } })} />
      </Field>
      <Field label="Button 2 link">
        <TextInput value={c.cta2?.to || ''} onChange={(e) => set({ cta2: { ...c.cta2, to: e.target.value } })} />
      </Field>
    </div>
  )
}

const FIELDS_BY_TYPE = {
  hero: HeroFields,
  welcome: WelcomeFields,
  stats: StatsFields,
  quote: QuoteFields,
  cta: CtaFields,
  programs: SimpleTitleFields,
  latestNews: SimpleTitleFields,
  upcomingEvents: SimpleTitleFields,
  galleryPreview: SimpleTitleFields,
}

export default function HomeSectionsEdit() {
  const { db, replaceAll } = useData()
  const { toast } = useToast()
  const [sections, setSections] = useState(() => {
    const raw = db.homeSections || []
    return raw.map((s) => ({ ...s }))
  })
  const [openId, setOpenId] = useState('hhero')

  const updateSection = (index, updated) => {
    const next = [...sections]
    next[index] = updated
    setSections(next)
  }

  const toggleVisible = (index) => {
    const s = sections[index]
    updateSection(index, { ...s, isVisible: !s.isVisible })
  }

  const save = () => {
    replaceAll('homeSections', sections)
    toast('Home sections saved')
  }

  return (
    <div>
      <PageHeader
        title="Home Sections"
        subtitle="Configure the sections on the public home page"
        actions={<Btn variant="gold" onClick={save}><Save size={14} /> Save All</Btn>}
      />
      <div className="space-y-3">
        {sections.map((section, i) => {
          const label = SECTION_LABELS[section.id] || section.id
          const isOpen = openId === section.id
          const Fields = FIELDS_BY_TYPE[section.content?.type]
          return (
            <Card key={section.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : section.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                <GripVertical size={16} className="text-slate-400" />
                <span className="flex-1 font-serif text-lg font-semibold text-navy-900">{label}</span>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                  section.isVisible ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                )}>
                  {section.isVisible ? 'Visible' : 'Hidden'}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); toggleVisible(i) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); toggleVisible(i); } }}
                  className="text-xs text-slate-500 hover:text-navy-900 underline ml-2 cursor-pointer"
                >
                  {section.isVisible ? 'Hide' : 'Show'}
                </span>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {isOpen && Fields && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Fields section={section} onChange={(updated) => updateSection(i, updated)} />
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
