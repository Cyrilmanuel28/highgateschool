import { Field, TextInput, TextArea, Select, Toggle, ItemListEditor } from './UI.jsx'
import RichTextEditor from './RichTextEditor.jsx'
import { ImagePicker } from './ImagePicker.jsx'

const ICON_OPTIONS = [
  { value: 'graduation', label: 'Graduation' },
  { value: 'globe', label: 'Globe' },
  { value: 'heart', label: 'Heart' },
  { value: 'spark', label: 'Spark' },
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Mail' },
  { value: 'shield', label: 'Shield' },
  { value: 'music', label: 'Music' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'users', label: 'Users' },
  { value: 'baby', label: 'Baby' },
  { value: 'book', label: 'Book' },
  { value: 'compass', label: 'Compass' },
  { value: 'camera', label: 'Camera' },
  { value: 'target', label: 'Target' },
  { value: 'award', label: 'Award' }
]

function LinkFields({ value, onChange, label1 = 'Button label', label2 = 'Destination' }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label={label1}>
        <TextInput value={value?.label || ''} onChange={(e) => onChange({ ...(value || {}), label: e.target.value })} placeholder="e.g. Explore Admissions" />
      </Field>
      <Field label={label2}>
        <TextInput value={value?.to || ''} onChange={(e) => onChange({ ...(value || {}), to: e.target.value })} placeholder="/admissions" />
      </Field>
    </div>
  )
}

const FIELDS = {
  hero: ({ b, set, info }) => (
    <div className="space-y-4">
      <Field label="Kicker (small eyebrow text)">
        <TextInput value={b.kicker || ''} onChange={(e) => set({ kicker: e.target.value })} placeholder={`Welcome to ${info?.shortName || info?.name || 'Highgate'}`} />
      </Field>
      <Field label="Headline" required>
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="A School That Feels Like Home" />
      </Field>
      <Field label="Subtitle">
        <TextArea rows={2} value={b.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
      </Field>
      <Field label="Background image">
        <ImagePicker value={b.image} onChange={(v) => set({ image: v })} />
      </Field>
      <LinkFields value={b.cta1} onChange={(v) => set({ cta1: v })} label1="Primary button" />
      <LinkFields value={b.cta2} onChange={(v) => set({ cta2: v })} label1="Secondary button" />
    </div>
  ),
  richText: ({ b, set }) => (
    <Field label="Content (rich text)" hint="Use the image button to insert media from the library">
      <RichTextEditor value={b.html || ''} onChange={(html) => set({ html })} />
    </Field>
  ),
  features: ({ b, set }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Section title">
          <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <TextInput value={b.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </Field>
      </div>
      <Field label="Feature cards">
        <ItemListEditor
          items={b.items}
          onChange={(items) => set({ items })}
          itemTitle="Card"
          fields={[
            { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'text', label: 'Description', type: 'textarea' }
          ]}
        />
      </Field>
    </div>
  ),
  stats: ({ b, set }) => (
    <Field label="Statistics" hint="Numbers displayed in the navy band">
      <ItemListEditor
        items={b.items}
        onChange={(items) => set({ items })}
        itemTitle="Stat"
        fields={[
          { key: 'value', label: 'Value', type: 'text', placeholder: 'e.g. 96%' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'e.g. IB Pass Rate' }
        ]}
      />
    </Field>
  ),
  imageText: ({ b, set }) => (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Text">
        <TextArea rows={4} value={b.text || ''} onChange={(e) => set({ text: e.target.value })} />
      </Field>
      <Field label="Image">
        <ImagePicker value={b.image} onChange={(v) => set({ image: v })} />
      </Field>
      <Field label="Image on the right">
        <Toggle checked={Boolean(b.reversed)} onChange={(v) => set({ reversed: v })} />
      </Field>
      <LinkFields value={b.link} onChange={(v) => set({ link: v })} />
    </div>
  ),
  quote: ({ b, set }) => (
    <div className="space-y-4">
      <Field label="Quote" required>
        <TextArea rows={3} value={b.quote || ''} onChange={(e) => set({ quote: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Author">
          <TextInput value={b.author || ''} onChange={(e) => set({ author: e.target.value })} />
        </Field>
        <Field label="Role">
          <TextInput value={b.role || ''} onChange={(e) => set({ role: e.target.value })} />
        </Field>
      </div>
    </div>
  ),
  cards: ({ b, set }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Section title">
          <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <TextInput value={b.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </Field>
      </div>
      <Field label="Cards">
        <ItemListEditor
          items={b.items}
          onChange={(items) => set({ items })}
          itemTitle="Card"
          fields={[
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'text', label: 'Text', type: 'textarea' },
            { key: 'to', label: 'Link to (optional)', type: 'text', placeholder: '/route' }
          ]}
        />
      </Field>
    </div>
  ),
  timeline: ({ b, set }) => (
    <div className="space-y-4">
      <Field label="Section title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Milestones">
        <ItemListEditor
          items={b.items}
          onChange={(items) => set({ items })}
          itemTitle="Milestone"
          fields={[
            { key: 'year', label: 'Year / Step', type: 'text', placeholder: 'e.g. 2012' },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'text', label: 'Description', type: 'textarea' }
          ]}
        />
      </Field>
    </div>
  ),
  values: ({ b, set }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Section title">
          <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <TextInput value={b.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </Field>
      </div>
      <Field label="Values">
        <ItemListEditor
          items={b.items}
          onChange={(items) => set({ items })}
          itemTitle="Value"
          fields={[
            { key: 'title', label: 'Name', type: 'text' },
            { key: 'text', label: 'Description', type: 'textarea' }
          ]}
        />
      </Field>
    </div>
  ),
  cta: ({ b, set }) => (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Text">
        <TextArea rows={2} value={b.text || ''} onChange={(e) => set({ text: e.target.value })} />
      </Field>
      <LinkFields value={b.cta1} onChange={(v) => set({ cta1: v })} label1="Primary button" />
      <LinkFields value={b.cta2} onChange={(v) => set({ cta2: v })} label1="Secondary button" />
    </div>
  ),
  welcome: ({ b, set }) => (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Body">
        <RichTextEditor value={b.body || ''} onChange={(body) => set({ body })} />
      </Field>
      <Field label="Image">
        <ImagePicker value={b.image} onChange={(v) => set({ image: v })} />
      </Field>
    </div>
  ),
  programs: ({ b, set }) => (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Section title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <TextInput value={b.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
      </Field>
    </div>
  ),
  staffGrid: ({ b, set }) => (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Section title">
        <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Department filter (optional)">
        <TextInput value={b.department || ''} onChange={(e) => set({ department: e.target.value })} placeholder="e.g. Administration" />
      </Field>
    </div>
  ),
  latestNews: ({ b, set }) => (
    <Field label="Section title">
      <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
    </Field>
  ),
  upcomingEvents: ({ b, set }) => (
    <Field label="Section title">
      <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
    </Field>
  ),
  galleryPreview: ({ b, set }) => (
    <Field label="Section title">
      <TextInput value={b.title || ''} onChange={(e) => set({ title: e.target.value })} />
    </Field>
  )
}

export const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'richText', label: 'Rich Text' },
  { value: 'features', label: 'Feature Cards' },
  { value: 'stats', label: 'Statistics Band' },
  { value: 'imageText', label: 'Image + Text' },
  { value: 'quote', label: 'Quote' },
  { value: 'cards', label: 'Card Grid' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'values', label: 'Values' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'welcome', label: 'Welcome Section' },
  { value: 'programs', label: 'Academic Programmes (auto)' },
  { value: 'staffGrid', label: 'Staff Grid (auto)' },
  { value: 'latestNews', label: 'Latest News (auto)' },
  { value: 'upcomingEvents', label: 'Upcoming Events (auto)' },
  { value: 'galleryPreview', label: 'Gallery Preview (auto)' }
]

export default function BlockEditor({ block, onChange, departments, info }) {
  const set = (patch) => onChange({ ...block, ...patch })
  const Editor = FIELDS[block.type]
  return (
    <div className="space-y-4">
      <Field label="Block type">
        <Select value={block.type} onChange={(e) => onChange({ ...block, type: e.target.value })}>
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
      </Field>
      {Editor ? (
        <Editor b={block} set={set} departments={departments} info={info} />
      ) : (
        <p className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
          No settings for this block type.
        </p>
      )}
    </div>
  )
}
