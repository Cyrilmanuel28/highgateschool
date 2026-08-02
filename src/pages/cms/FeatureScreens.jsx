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

const tone = (v, map, fallback = 'slate') => map[v] || fallback

export function NoticesCrud() {
  return (
    <SimpleCrud
      collection="notices"
      title="Notices"
      newLabel="New Notice"
      showStatus
      sortField="publishDate"
      columns={[
        { key: 'title', label: 'Notice', render: (r) => (
          <span className="flex items-center gap-2">
            <span className="font-semibold text-navy-900">{r.title}</span>
            {r.pinned && <Badge tone="gold">Pinned</Badge>}
          </span>
        ) },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'priority', label: 'Priority', render: (r) => <Badge tone={tone(r.priority, { urgent: 'red', high: 'amber' })}>{r.priority || 'normal'}</Badge> },
        { key: 'publishDate', label: 'Publish', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.publishDate)}</span> },
        { key: 'expireDate', label: 'Expires', render: (r) => <span className="text-xs text-slate-400">{r.expireDate ? formatDate(r.expireDate) : '—'}</span> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['General', 'Admissions', 'Examinations', 'PTA', 'Emergency'], default: 'General' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['normal', 'high', 'urgent'], default: 'normal' },
        { key: 'pinned', label: 'Pin to top', type: 'toggle', default: false },
        { key: 'body', label: 'Body', type: 'textarea', required: true, span: true },
        { key: 'publishDate', label: 'Publish date', type: 'datetime', required: true },
        { key: 'expireDate', label: 'Expiry date', type: 'datetime', hint: 'Notice moves to the archive after this date' },
        { key: 'isVisible', label: 'Visible on public site', type: 'toggle', default: true },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published', priority: 'normal', category: 'General', pinned: false, isVisible: true }}
      publicSlugPath="/notices"
    />
  )
}

export function ApplicationsCrud() {
  return (
    <SimpleCrud
      collection="applications"
      title="Admission Applications"
      newLabel="New Application"
      sortField="submittedAt"
      columns={[
        { key: 'ref', label: 'Ref', render: (r) => <span className="font-mono text-xs font-semibold text-navy-900">{r.ref}</span> },
        { key: 'studentFirstName', label: 'Student', render: (r) => <span className="font-semibold text-navy-900">{r.studentFirstName} {r.studentLastName}</span> },
        { key: 'applyingForYear', label: 'Year', render: (r) => <Badge>{r.applyingForYear}</Badge> },
        { key: 'parentName', label: 'Parent', render: (r) => <span className="text-sm text-slate-500">{r.parentName || '—'}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { received: 'blue', under_review: 'amber', assessment: 'gold', offered: 'green', accepted: 'green', rejected: 'red' })}>{r.status}</Badge> },
        { key: 'submittedAt', label: 'Submitted', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.submittedAt)}</span> }
      ]}
      fields={[
        { key: 'ref', label: 'Reference', hint: 'e.g. APP-2026-001' },
        { key: 'studentFirstName', label: 'First name', required: true },
        { key: 'studentLastName', label: 'Last name', required: true },
        { key: 'dob', label: 'Date of birth', type: 'datetime' },
        { key: 'gender', label: 'Gender' },
        { key: 'applyingForYear', label: 'Applying for year', placeholder: 'e.g. Year 7' },
        { key: 'currentSchool', label: 'Current school' },
        { key: 'parentName', label: 'Parent name' },
        { key: 'parentEmail', label: 'Parent email', required: true },
        { key: 'parentPhone', label: 'Parent phone' },
        { key: 'address', label: 'Address', span: true },
        { key: 'country', label: 'Country' },
        { key: 'statement', label: 'Statement', type: 'textarea', span: true },
        { key: 'status', label: 'Status', type: 'select', options: ['received', 'under_review', 'assessment', 'offered', 'accepted', 'rejected'], default: 'under_review' },
        { key: 'decisionNotes', label: 'Decision notes', type: 'textarea', span: true },
        { key: 'submittedAt', label: 'Submitted date', type: 'datetime' }
      ]}
      defaultValues={{ status: 'under_review' }}
    />
  )
}

export function LibraryCrud() {
  return (
    <SimpleCrud
      collection="library"
      title="Library Resources"
      newLabel="New Resource"
      showStatus
      sortField="publishedAt"
      columns={[
        imgCol('coverImage', 'title'),
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'type', label: 'Type', render: (r) => <Badge tone="gold">{r.type}</Badge> },
        { key: 'category', label: 'Category', render: (r) => <span className="text-xs text-slate-500">{r.category}</span> },
        { key: 'downloadCount', label: 'Downloads', render: (r) => <span className="text-xs text-slate-500">{r.downloadCount || 0}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { published: 'green' })}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['eBook', 'Past Paper', 'Notes', 'Magazine', 'Audio', 'Video'], default: 'eBook' },
        { key: 'category', label: 'Category', placeholder: 'e.g. Academic, Reading Lists' },
        { key: 'author', label: 'Author' },
        { key: 'fileUrl', label: 'Resource URL', required: true, span: true, hint: 'Link to the ebook, paper, or audio file' },
        { key: 'description', label: 'Description', type: 'textarea', span: true },
        { key: 'featured', label: 'Featured', type: 'toggle', default: false },
        { key: 'coverImage', label: 'Cover', type: 'image' },
        { key: 'publishedAt', label: 'Published', type: 'datetime' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published', featured: false }}
      publicSlugPath="/library"
    />
  )
}

export function MagazineCrud() {
  return (
    <SimpleCrud
      collection="magazineArticles"
      title="Magazine Articles"
      newLabel="New Article"
      showStatus
      sortField="publishedAt"
      columns={[
        imgCol('coverImage', 'title'),
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'edition', label: 'Edition', render: (r) => <Badge>{r.edition}</Badge> },
        { key: 'category', label: 'Category', render: (r) => <span className="text-xs text-slate-500">{r.category}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { published: 'green' })}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'slug', label: 'Slug', hint: 'Optional — auto-generated from title if left blank' },
        { key: 'edition', label: 'Edition', placeholder: 'e.g. Winter 2026' },
        { key: 'category', label: 'Category', placeholder: 'e.g. Features, Community' },
        { key: 'author', label: 'Author' },
        { key: 'contributorType', label: 'Contributor type', type: 'select', options: ['teacher', 'student', 'guest', 'staff', 'alumni'], default: 'teacher' },
        { key: 'body', label: 'Article body', type: 'richText', required: true, span: true },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', span: true },
        { key: 'featured', label: 'Featured', type: 'toggle', default: false },
        { key: 'coverImage', label: 'Cover image', type: 'image' },
        { key: 'publishedAt', label: 'Published', type: 'datetime' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published', contributorType: 'teacher' }}
      publicSlugPath="/magazine"
    />
  )
}

export function VacanciesCrud() {
  return (
    <SimpleCrud
      collection="vacancies"
      title="Careers & Vacancies"
      newLabel="New Vacancy"
      showStatus
      sortField="closingDate"
      columns={[
        { key: 'title', label: 'Role', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'type', label: 'Type', render: (r) => <Badge>{r.type}</Badge> },
        { key: 'contract', label: 'Contract', render: (r) => <span className="text-xs text-slate-500">{r.contract || '—'}</span> },
        { key: 'closingDate', label: 'Closes', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.closingDate)}</span> },
        { key: 'isOpen', label: 'Open', render: (r) => <Badge tone={r.isOpen !== false ? 'green' : 'slate'}>{r.isOpen !== false ? 'Open' : 'Closed'}</Badge> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { published: 'green' })}>{r.status}</Badge> }
      ]}
      fields={[
        { key: 'title', label: 'Job title', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Teaching', 'Administrative', 'Support'], default: 'Teaching' },
        { key: 'department', label: 'Department' },
        { key: 'location', label: 'Location' },
        { key: 'contract', label: 'Contract', placeholder: 'e.g. Full-time, permanent' },
        { key: 'salary', label: 'Salary range' },
        { key: 'summary', label: 'Summary', type: 'textarea', required: true, span: true },
        { key: 'responsibilities', label: 'Responsibilities', type: 'tags', hint: 'One per entry' },
        { key: 'qualifications', label: 'Qualifications', type: 'tags', hint: 'One per entry' },
        { key: 'closingDate', label: 'Closing date', type: 'datetime', required: true },
        { key: 'isOpen', label: 'Accepting applications', type: 'toggle', default: true },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ status: 'published', isOpen: true, type: 'Teaching' }}
      publicSlugPath="/careers"
    />
  )
}

export function JobApplicationsCrud() {
  const { db } = useData()
  return (
    <SimpleCrud
      collection="jobApplications"
      title="Job Applications"
      newLabel="Record Application"
      sortField="appliedAt"
      columns={[
        { key: 'name', label: 'Candidate', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'vacancyTitle', label: 'Role', render: (r) => <Badge>{r.vacancyTitle || r.vacancyId || '—'}</Badge> },
        { key: 'email', label: 'Email', render: (r) => <span className="text-xs text-slate-500">{r.email}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { received: 'blue', review: 'amber', interview: 'amber', offered: 'green', unsuccessful: 'slate' })}>{r.status}</Badge> },
        { key: 'appliedAt', label: 'Applied', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.appliedAt)}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Candidate name', required: true },
        { key: 'email', label: 'Email', required: true },
        { key: 'phone', label: 'Phone' },
        { key: 'vacancyId', label: 'Vacancy', type: 'selectFrom', source: () => db.vacancies || [], optionValue: 'id', optionLabel: 'title' },
        { key: 'coverLetter', label: 'Cover letter', type: 'textarea', span: true },
        { key: 'cvUrl', label: 'CV', type: 'file', span: true },
        { key: 'status', label: 'Status', type: 'select', options: ['received', 'review', 'shortlisted', 'interview', 'offered', 'unsuccessful'], default: 'received' },
        { key: 'appliedAt', label: 'Applied date', type: 'datetime' }
      ]}
      defaultValues={{ status: 'received' }}
    />
  )
}

export function FeedbackCrud() {
  return (
    <SimpleCrud
      collection="feedback"
      title="Parent Feedback"
      newLabel="New Feedback"
      sortField="createdAt"
      columns={[
        { key: 'ref', label: 'Ref', render: (r) => <span className="font-mono text-xs font-semibold text-navy-900">{r.ref || '—'}</span> },
        { key: 'name', label: 'From', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'priority', label: 'Priority', render: (r) => <Badge tone={tone(r.priority, { High: 'red', Medium: 'amber', Low: 'slate' })}>{r.priority || 'Medium'}</Badge> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { submitted: 'blue', under_review: 'amber', acknowledged: 'amber', resolved: 'green', closed: 'slate' })}>{r.status}</Badge> },
        { key: 'createdAt', label: 'Received', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email' },
        { key: 'category', label: 'Category', type: 'select', options: ['General', 'Suggestion', 'Concern', 'Compliment', 'Complaint'], default: 'General' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message', type: 'textarea', required: true, span: true },
        { key: 'status', label: 'Status', type: 'select', options: ['submitted', 'under_review', 'acknowledged', 'resolved', 'closed'], default: 'submitted' },
        { key: 'ref', label: 'Reference', hint: 'e.g. FBK-483920' },
        { key: 'createdAt', label: 'Received date', type: 'datetime' }
      ]}
      defaultValues={{ status: 'submitted', category: 'General', priority: 'Medium' }}
    />
  )
}

export function TestimonialsCrud() {
  return (
    <SimpleCrud
      collection="testimonials"
      title="Testimonials"
      newLabel="New Testimonial"
      sortField="createdAt"
      columns={[
        imgCol('photo', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'role', label: 'Role', render: (r) => <Badge tone="gold">{r.role}</Badge> },
        { key: 'approved', label: 'Approved', render: (r) => <Badge tone={r.approved ? 'green' : 'amber'}>{r.approved ? 'Approved' : 'Pending'}</Badge> },
        { key: 'createdAt', label: 'Date', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'role', label: 'Role', type: 'select', options: ['Parent', 'Student', 'Teacher', 'Visitor'], default: 'Parent' },
        { key: 'relationship', label: 'Relationship', placeholder: 'e.g. Parent of Year 8 student' },
        { key: 'quote', label: 'Testimonial', type: 'textarea', required: true, span: true },
        { key: 'rating', label: 'Rating', type: 'select', options: ['1', '2', '3', '4', '5'], default: '5' },
        { key: 'featured', label: 'Featured in carousel', type: 'toggle', default: false },
        { key: 'approved', label: 'Approved for public site', type: 'toggle', default: false },
        { key: 'photo', label: 'Photo', type: 'image' }
      ]}
      defaultValues={{ approved: false, featured: false, role: 'Parent', rating: '5' }}
      publicSlugPath="/testimonials"
    />
  )
}

export function NewsletterSubscribersCrud() {
  return (
    <SimpleCrud
      collection="newsletterSubscribers"
      title="Newsletter Subscribers"
      newLabel="Add Subscriber"
      sortField="createdAt"
      columns={[
        { key: 'email', label: 'Email', render: (r) => <span className="font-semibold text-navy-900">{r.email}</span> },
        { key: 'name', label: 'Name', render: (r) => <span className="text-sm text-slate-500">{r.name || '—'}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { subscribed: 'green', unsubscribed: 'slate', bounced: 'red' })}>{r.status}</Badge> },
        { key: 'createdAt', label: 'Subscribed', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> }
      ]}
      fields={[
        { key: 'email', label: 'Email', required: true },
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status', type: 'select', options: ['subscribed', 'unsubscribed', 'bounced'], default: 'subscribed' }
      ]}
      defaultValues={{ status: 'subscribed' }}
    />
  )
}

export function NewsletterCampaignsCrud() {
  return (
    <SimpleCrud
      collection="newsletterCampaigns"
      title="Newsletter Campaigns"
      newLabel="New Campaign"
      showStatus
      sortField="sentAt"
      columns={[
        { key: 'subject', label: 'Subject', render: (r) => <span className="font-semibold text-navy-900">{r.subject}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={tone(r.status, { sent: 'green', scheduled: 'amber', draft: 'slate' })}>{r.status}</Badge> },
        { key: 'opens', label: 'Opens', render: (r) => <span className="text-xs text-slate-500">{r.opens || 0}</span> },
        { key: 'sentAt', label: 'Sent', render: (r) => <span className="text-xs text-slate-500">{r.sentAt ? formatDate(r.sentAt) : '—'}</span> }
      ]}
      fields={[
        { key: 'subject', label: 'Subject', required: true },
        { key: 'headline', label: 'Headline' },
        { key: 'body', label: 'Body', type: 'richText', required: true, span: true },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'sent'], default: 'draft' },
        { key: 'scheduleAt', label: 'Scheduled send', type: 'datetime' },
        { key: 'sentAt', label: 'Sent date', type: 'datetime' },
        { key: 'opens', label: 'Opens', type: 'number' },
        { key: 'clicks', label: 'Clicks', type: 'number' }
      ]}
      defaultValues={{ status: 'draft', opens: 0, clicks: 0 }}
    />
  )
}

export function CampusLocationsCrud() {
  return (
    <SimpleCrud
      collection="campusLocations"
      title="Campus Locations"
      newLabel="New Location"
      sortField="name"
      columns={[
        imgCol('featuredImage', 'name'),
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'x', label: 'Map position', render: (r) => <span className="font-mono text-xs text-slate-500">x {r.x}% · y {r.y}%</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Academic', 'Sports', 'Community', 'Arts & Community', 'Administration', 'Services'], default: 'Academic' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'floor', label: 'Floor / wing', placeholder: 'e.g. Ground floor, West wing' },
        { key: 'icon', label: 'Icon', type: 'select', options: ['door', 'flask', 'book', 'pencil', 'leaf', 'graduation', 'trophy', 'waves', 'tree', 'coffee', 'briefcase', 'music'], default: 'door' },
        { key: 'x', label: 'Map X (%)', type: 'number', hint: '0–100 across the map' },
        { key: 'y', label: 'Map Y (%)', type: 'number', hint: '0–100 down the map' },
        { key: 'featuredImage', label: 'Photo', type: 'image' }
      ]}
      defaultValues={{ category: 'Academic', icon: 'door', x: 50, y: 50 }}
      publicSlugPath="/campus-map"
    />
  )
}

export function TourScenesCrud() {
  return (
    <SimpleCrud
      collection="tourScenes"
      title="Virtual Tour Scenes"
      newLabel="New Scene"
      sortField="order"
      sortDir="asc"
      columns={[
        imgCol('image', 'title'),
        { key: 'title', label: 'Scene', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'category', label: 'Category', render: (r) => <Badge>{r.category}</Badge> },
        { key: 'order', label: 'Order', render: (r) => <span className="text-sm text-slate-500">{r.order}</span> }
      ]}
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Campus', 'Learning Spaces', 'Sport & Community', 'Academic', 'Community'], default: 'Campus' },
        { key: 'location', label: 'Location', placeholder: 'e.g. North Building, Ground floor' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, span: true },
        { key: 'image', label: 'Scene image', type: 'image', required: true },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'isVisible', label: 'Visible on public site', type: 'toggle', default: true }
      ]}
      defaultValues={{ category: 'Campus', isVisible: true }}
      publicSlugPath="/virtual-tour"
    />
  )
}

export function EmergencyAlertsCrud() {
  return (
    <SimpleCrud
      collection="emergencyAlerts"
      title="Emergency Alerts"
      newLabel="New Alert"
      showStatus
      sortField="publishDate"
      columns={[
        { key: 'type', label: 'Type', render: (r) => <Badge tone={tone(r.type, { Weather: 'amber', Security: 'red', Closure: 'red', Health: 'green', Advisory: 'blue', Alert: 'slate' })}>{r.type}</Badge> },
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-navy-900">{r.title}</span> },
        { key: 'severity', label: 'Severity', render: (r) => <Badge tone={tone(r.severity, { critical: 'red', warning: 'amber', info: 'blue' })}>{r.severity}</Badge> },
        { key: 'publishDate', label: 'Published', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.publishDate)}</span> },
        { key: 'expireDate', label: 'Expires', render: (r) => <span className="text-xs text-slate-400">{r.expireDate ? formatDate(r.expireDate) : '—'}</span> }
      ]}
      fields={[
        { key: 'type', label: 'Type', type: 'select', options: ['Alert', 'Advisory', 'Closure', 'Weather', 'Security', 'Health'], default: 'Alert' },
        { key: 'title', label: 'Title', required: true },
        { key: 'severity', label: 'Severity', type: 'select', options: ['info', 'warning', 'critical'], default: 'warning' },
        { key: 'message', label: 'Message', type: 'textarea', required: true, span: true },
        { key: 'isVisible', label: 'Visible on public site', type: 'toggle', default: true },
        { key: 'publishDate', label: 'Published date', type: 'datetime', required: true },
        { key: 'expireDate', label: 'Expiry date', type: 'datetime', hint: 'Alert disappears from public site after this date' },
        { key: 'status', label: 'Status', type: 'status' }
      ]}
      defaultValues={{ active: undefined, severity: 'warning', type: 'Alert', isVisible: true, status: 'published' }}
      publicSlugPath="/emergency"
    />
  )
}

export function EventRegistrationsCrud() {
  const { db } = useData()
  return (
    <SimpleCrud
      collection="eventRegistrations"
      title="Event Registrations"
      newLabel="New Registration"
      sortField="createdAt"
      columns={[
        { key: 'name', label: 'Registrant', render: (r) => <span className="font-semibold text-navy-900">{r.name}</span> },
        { key: 'event', label: 'Event', render: (r) => {
          const e = (db.events || []).find((x) => x.id === r.event)
          return <Badge>{e?.title || r.event}</Badge>
        } },
        { key: 'email', label: 'Email', render: (r) => <span className="text-xs text-slate-500">{r.email}</span> },
        { key: 'createdAt', label: 'Registered', render: (r) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> }
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email', required: true },
        { key: 'event', label: 'Event', type: 'selectFrom', source: () => db.events || [], optionValue: 'id', optionLabel: 'title' },
        { key: 'guests', label: 'Guests', type: 'number' },
        { key: 'createdAt', label: 'Registered date', type: 'datetime' }
      ]}
      defaultValues={{ guests: 0 }}
    />
  )
}

export function StatsCrud() {
  return (
    <SimpleCrud
      collection="stats"
      title="Statistics"
      newLabel="New Statistic"
      sortField="order"
      sortDir="asc"
      columns={[
        { key: 'label', label: 'Label', render: (r) => <span className="font-semibold text-navy-900">{r.label}</span> },
        { key: 'value', label: 'Value', render: (r) => <span className="font-serif text-base font-bold text-navy-900">{r.value}{r.suffix || ''}</span> },
        { key: 'icon', label: 'Icon', render: (r) => <Badge>{r.icon}</Badge> },
        { key: 'order', label: 'Order', render: (r) => <span className="text-sm text-slate-500">{r.order}</span> }
      ]}
      fields={[
        { key: 'label', label: 'Label', required: true },
        { key: 'value', label: 'Value', type: 'number', required: true },
        { key: 'suffix', label: 'Suffix', placeholder: 'e.g. +, %, :1' },
        { key: 'icon', label: 'Icon', type: 'select', options: ['users', 'globe', 'graduation', 'heart', 'teacher', 'trophy', 'target', 'puzzle', 'calendar', 'award'], default: 'target' },
        { key: 'description', label: 'Description', type: 'textarea', span: true },
        { key: 'order', label: 'Order', type: 'number' }
      ]}
      defaultValues={{ icon: 'target', suffix: '' }}
      publicSlugPath="/statistics"
    />
  )
}
