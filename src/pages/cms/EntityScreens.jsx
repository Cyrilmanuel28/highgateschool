import { useData } from '../../context/DataContext.jsx'
import SimpleCrud from './SimpleCrud.jsx'
import { Badge } from '../../components/cms/UI.jsx'
import { formatDate } from '../../lib/utils.js'

const imgCol = (key = 'photo', altKey = 'name') => ({
  key,
  label: '',
  render: (row) =>
    row[key] ? (
      <img src={row[key]} alt={row[altKey]} className="h-11 w-11 rounded-lg object-cover" />
    ) : (
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy-800">
        {(row[altKey] || '?')[0].toUpperCase()}
      </span>
    )
})

export function EventsCrud() {
  return (
    <SimpleCrud
      collection="events"
      title="Events"
      newLabel="New Event"
      showStatus
      sortField="startDate"
      columns={[
        imgCol('featuredImage', 'title'),
        { key: 'title', label: 'Event', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'startDate', label: 'Starts', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.startDate)}</span> },
        { key: 'location', label: 'Location', render: (r) => <span className="text-sm text-slate-500">{r.location || '—'}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'published' ? 'green' : r.status === 'scheduled' ? 'amber' : 'slate'}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'slug', label: 'Slug', hint: 'Optional — auto-generated from title if left blank' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'startDate', label: 'Start date', type: 'datetime', required: true },
        { key: 'endDate', label: 'End date', type: 'datetime', hint: 'Optional for multi-day events' },
        { key: 'location', label: 'Location', span: true },
        { key: 'publishAt', label: 'Publish at (schedule)', type: 'datetime' },
        { key: 'featuredImage', label: 'Featured image', type: 'image' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published' }}
      publicSlugPath="/events"
    />
  )
}

export function VideosCrud() {
  return (
    <SimpleCrud
      collection="videos"
      title="Videos"
      newLabel="New Video"
      showStatus
      sortField="publishedAt"
      columns={[
        imgCol('thumbnail', 'title'),
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'embedUrl', label: 'Embed URL', render: (r) => <span className="text-xs text-slate-400">{r.embedUrl}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'published' ? 'green' : r.status === 'scheduled' ? 'amber' : 'slate'}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'slug', label: 'Slug', hint: 'Optional — auto-generated from title if left blank' },
        { key: 'embedUrl', label: 'YouTube embed URL', required: true, placeholder: 'https://www.youtube.com/embed/VIDEO_ID', span: true },
        { key: 'description', label: 'Description', type: 'textarea', span: true },
        { key: 'thumbnail', label: 'Thumbnail', type: 'image' },
        { key: 'publishedAt', label: 'Published date', type: 'datetime' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published' }}
    />
  )
}

export function DownloadsCrud() {
  return (
    <SimpleCrud
      collection="downloads"
      title="Downloads"
      newLabel="New Document"
      sortField="publishedAt"
      columns={[
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'publishedAt', label: 'Published', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.publishedAt)}</span> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'category', label: 'Category', required: true, placeholder: 'e.g. Prospectus, Policies' },
        { key: 'fileUrl', label: 'File', type: 'file', required: true, hint: 'Upload a document (PDF, Word, Excel) or paste a URL', span: true },
        { key: 'description', label: 'Description', type: 'textarea', span: true },
        { key: 'publishedAt', label: 'Published date', type: 'datetime' }
      ]}
    />
  )
}

export function FaqCrud() {
  return (
    <SimpleCrud
      collection="faqs"
      title="FAQ"
      newLabel="New Question"
      sortField="order"
      sortDir="asc"
      columns={[
        { key: 'question', label: 'Question', render: (r) => <span className="font-semibold text-navy-900">{r.question}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'order', label: 'Order', render: (r) => <span className="text-sm text-slate-500">{r.order}</span> }
      ]}
      fields={[
        { key: 'question', label: 'Question', required: true },
        { key: 'answer', label: 'Answer', type: 'richText', required: true, span: true },
        { key: 'category', label: 'Category', placeholder: 'e.g. Admissions, Fees' },
        { key: 'order', label: 'Order', type: 'number' }
      ]}
    />
  )
}

export function AchievementsCrud() {
  return (
    <SimpleCrud
      collection="achievements"
      title="Achievements"
      newLabel="New Achievement"
      sortField="date"
      columns={[
        imgCol('image', 'title'),
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge tone="gold">{r.category}</Badge> },
        { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.date)}</span> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'description', label: 'Description', type: 'textarea', span: true },
        { key: 'category', label: 'Category', placeholder: 'Academic, Arts, Sport, Community' },
        { key: 'date', label: 'Date', type: 'datetime' },
        { key: 'image', label: 'Image', type: 'image' }
      ]}
    />
  )
}

export function ClubsCrud() {
  return (
    <SimpleCrud
      collection="clubs"
      title="Clubs & Societies"
      newLabel="New Club"
      sortField="order"
      sortDir="asc"
      columns={[
        imgCol('photo', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'advisor', label: 'Advisor', render: (r) => <span className="text-sm text-slate-500">{r.advisor || '—'}</span> },
        { key: 'meetingSchedule', label: 'Meetings', render: (r) => <span className="text-xs text-slate-400">{r.meetingSchedule || '—'}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'advisor', label: 'Advisor' },
        { key: 'meetingSchedule', label: 'Meeting schedule' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'photo', label: 'Photo', type: 'image' }
      ]}
    />
  )
}

export function SportsCrud() {
  return (
    <SimpleCrud
      collection="sports"
      title="Sports"
      newLabel="New Sport"
      sortField="order"
      sortDir="asc"
      columns={[
        imgCol('photo', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'coach', label: 'Coach', render: (r) => <span className="text-sm text-slate-500">{r.coach || '—'}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'coach', label: 'Coach' },
        { key: 'achievements', label: 'Achievements', type: 'tags', hint: 'Comma-separated highlights' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'photo', label: 'Photo', type: 'image' }
      ]}
    />
  )
}

export function DepartmentsCrud() {
  const { db } = useData()
  const staff = (db.staff || []).sort((a, b) => a.name.localeCompare(b.name))
  return (
    <SimpleCrud
      collection="departments"
      title="Departments"
      newLabel="New Department"
      sortField="order"
      sortDir="asc"
      columns={[
        imgCol('featuredImage', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'headStaff', label: 'Head', render: (r) => {
          const s = staff.find((x) => x.id === r.headStaff)
          return <span className="text-sm text-slate-500">{s?.name || '—'}</span>
        } },
        { key: 'order', label: 'Order', render: (r) => <span className="text-sm text-slate-500">{r.order}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug', hint: 'Appears in the public URL' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'headStaff', label: 'Head of Department', type: 'selectFrom', source: () => staff, optionValue: 'id', optionLabel: 'name' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'featuredImage', label: 'Featured image', type: 'image' }
      ]}
      publicSlugPath="/departments"
    />
  )
}

export function ProgramsCrud() {
  return (
    <SimpleCrud
      collection="programs"
      title="Academic Programmes"
      newLabel="New Programme"
      showStatus
      sortField="order"
      sortDir="asc"
      columns={[
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'level', label: 'Level', render: (r) => <Badge tone="gold">{r.level}</Badge> },
        { key: 'curriculum', label: 'Curriculum', render: (r) => <span className="text-xs text-slate-500">{r.curriculum}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'published' ? 'green' : 'slate'}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'level', label: 'Level / ages', placeholder: 'e.g. Ages 14–16' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'curriculum', label: 'Curriculum', span: true },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published' }}
    />
  )
}

export function FeesCrud() {
  const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })
  return (
    <SimpleCrud
      collection="fees"
      title="Fee Structures"
      newLabel="New Structure"
      sortField="order"
      sortDir="asc"
      columns={[
        { key: 'level', label: 'Level', render: (r) => <span className="font-semibold text-navy-900">{r.level}</span> },
        { key: 'academicYear', label: 'Year', render: (r) => <Badge>{r.academicYear}</Badge> },
        { key: 'items', label: 'Fee items', render: (r) => { const amounts = (r.items || []).map((i) => i.amount || 0); return <span className="text-sm text-slate-500">{amounts.length} items{amounts.length ? ' · from ' + GBP.format(Math.min(...amounts)) : ''}</span> } }
      ]}
      fields={[
        { key: 'level', label: 'Level', required: true, placeholder: 'e.g. Primary' },
        { key: 'academicYear', label: 'Academic year', placeholder: 'e.g. 2026/27' },
        { key: 'items', label: 'Fee items', type: 'jsonItems', span: true, itemLabel: 'Fee item', itemFields: [
          { key: 'label', label: 'Label', type: 'text', placeholder: 'e.g. Tuition (per term)' },
          { key: 'amount', label: 'Amount (£)', type: 'number', placeholder: '0 = Included' }
        ] },
        { key: 'notes', label: 'Notes', type: 'textarea', span: true, hint: 'Shown in the gold information box' },
        { key: 'order', label: 'Order', type: 'number' }
      ]}
    />
  )
}

export function CalendarCrud() {
  return (
    <SimpleCrud
      collection="calendarEvents"
      title="Calendar Events"
      newLabel="New Calendar Event"
      sortField="date"
      columns={[
        { key: 'title', label: 'Event', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'type', label: 'Type', render: (r) => <Badge>{r.type}</Badge> },
        { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.date)}</span> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Term', 'Holiday', 'Assessment', 'Event', 'Admissions'] },
        { key: 'date', label: 'Start date', type: 'datetime', required: true },
        { key: 'endDate', label: 'End date (optional)', type: 'datetime' },
        { key: 'description', label: 'Description', type: 'textarea', span: true }
      ]}
    />
  )
}

export function StaffCrud() {
  const { db } = useData()
  const depts = [...new Set((db.staff || []).map((s) => s.department).filter(Boolean)), ...(db.departments || []).map((d) => d.name)]
  const uniqueDepts = [...new Set(depts)]
  return (
    <SimpleCrud
      collection="staff"
      title="Staff Directory"
      newLabel="New Staff Member"
      sortField="order"
      sortDir="asc"
      columns={[
        imgCol('photo', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'title', label: 'Title', render: (r) => <span className="text-sm text-slate-500">{r.title}</span> },
        { key: 'department', label: 'Department', render: (r) => <Badge>{r.department || '—'}</Badge> },
        { key: 'isVisible', label: 'Visible', render: (r) => <Badge tone={r.isVisible === false ? 'red' : 'green'}>{r.isVisible === false ? 'Hidden' : 'Visible'}</Badge> }
      ]}
      fields={[
        { key: 'name', label: 'Full name', required: true },
        { key: 'title', label: 'Title / role', required: true, placeholder: 'e.g. Head of Mathematics' },
        { key: 'department', label: 'Department', type: 'select', options: uniqueDepts },
        { key: 'slug', label: 'Slug', hint: 'Optional — for the profile email and URL' },
        { key: 'bio', label: 'Biography', type: 'richText', span: true },
        { key: 'order', label: 'Display order', type: 'number' },
        { key: 'isVisible', label: 'Show on public site', type: 'toggle', default: true },
        { key: 'photo', label: 'Photo', type: 'image' }
      ]}
      publicSlugPath="/staff"
    />
  )
}
