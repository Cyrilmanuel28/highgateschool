import { appendAudit } from './audit.js'
import { recordTitle } from './publishing.js'

const SCHEDULED_ENTITIES = [
  'pages', 'news', 'events', 'videos', 'albums', 'notices', 'magazineArticles',
  'vacancies', 'library', 'downloads', 'testimonials', 'campusLocations',
  'tourScenes', 'emergencyAlerts', 'stats', 'calendarEvents', 'fees', 'programs'
]

export function processSchedule(db, now = Date.now()) {
  const changed = []
  for (const key of SCHEDULED_ENTITIES) {
    const rows = db[key]
    if (!Array.isArray(rows)) continue
    for (const row of rows) {
      if (row.status === 'scheduled' && row.publishAt && new Date(row.publishAt).getTime() <= now) {
        row.status = 'published'
        row.publishAt = null
        row.publishedAt = row.publishedAt || new Date(now).toISOString()
        changed.push({ key, id: row.id })
        appendAudit({
          user: 'system',
          role: 'system',
          entity: key,
          recordId: row.id,
          title: recordTitle(row),
          action: 'publish',
          from: 'scheduled',
          to: 'published',
          note: 'Scheduled publication'
        })
      }
    }
  }
  return changed
}
