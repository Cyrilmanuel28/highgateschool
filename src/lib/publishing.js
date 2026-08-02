export const PUBLISH_STATUSES = ['draft', 'pending', 'scheduled', 'published', 'unpublished', 'archived']

export const STATUS_META = {
  draft: { label: 'Draft', tone: 'slate' },
  pending: { label: 'Pending review', tone: 'blue' },
  scheduled: { label: 'Scheduled', tone: 'amber' },
  published: { label: 'Published', tone: 'green' },
  unpublished: { label: 'Unpublished', tone: 'red' },
  archived: { label: 'Archived', tone: 'slate' }
}

export const PUBLIC_SUBMISSION = new Set([
  'applications',
  'jobApplications',
  'eventRegistrations',
  'newsletterSubscribers',
  'messages',
  'feedback',
  'testimonials'
])

export const VERSIONED_EDIT = new Set(['pages', 'news', 'homeSections'])

export function isPublicSubmission(key) {
  return PUBLIC_SUBMISSION.has(key)
}

export function isEmptyValue(v) {
  if (v == null) return true
  if (typeof v === 'string') return !v.trim()
  if (Array.isArray(v)) return v.length === 0
  return false
}

export function validateForPublish(item, fields = [], requireSlug = false) {
  const errors = []
  for (const f of fields || []) {
    if (!f.required) continue
    if (isEmptyValue(item?.[f.key])) {
      errors.push(`"${f.label || f.key}" is required`)
    }
  }
  if (requireSlug && item && item.slug !== undefined && isEmptyValue(item.slug)) {
    errors.push('A slug is required before publishing')
  }
  return { ok: errors.length === 0, errors }
}

export function actionForStatusChange(from, to) {
  if (!from && to) return 'create'
  if (to === 'published') return 'publish'
  if (from === 'published' && (to === 'draft' || to === 'unpublished')) return 'unpublish'
  if (to === 'archived') return 'archive'
  if (to === 'pending') return 'submit-review'
  if (to === 'scheduled') return 'schedule'
  if (from === 'pending' && (to === 'draft' || to === 'unpublished')) return 'withdraw'
  return 'edit'
}

export function recordTitle(record) {
  if (!record) return ''
  return (
    record.title ||
    record.name ||
    record.question ||
    record.level ||
    record.subject ||
    record.role ||
    record.label ||
    record.email ||
    record.id ||
    ''
  )
}

export const AUDIT_ACTION_LABEL = {
  create: 'Create',
  edit: 'Edit',
  publish: 'Publish',
  unpublish: 'Unpublish',
  archive: 'Archive',
  delete: 'Delete',
  restore: 'Restore',
  schedule: 'Schedule',
  'submit-review': 'Submit for review',
  withdraw: 'Withdraw',
  'bulk-update': 'Reordered',
  update: 'Update'
}
