import { uid } from './utils.js'

export const CHANGE_STATUSES = {
  DRAFT: 'DRAFT',
  SAVED: 'SAVED',
  PUBLISHING: 'PUBLISHING',
  PUBLISHED: 'PUBLISHED',
  VERIFYING: 'VERIFYING',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
  ROLLED_BACK: 'ROLLED_BACK'
}

export function computeDiff(prev, next) {
  if (!prev && !next) return {}
  if (!prev) return { type: 'created', fields: Object.keys(next || {}) }
  if (!next) return { type: 'deleted', fields: Object.keys(prev || {}) }

  const changed = {}
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)])

  for (const key of allKeys) {
    if (key === 'updatedAt' || key === 'updated_at') continue
    const v1 = prev[key]
    const v2 = next[key]
    if (JSON.stringify(v1) !== JSON.stringify(v2)) {
      changed[key] = { from: v1, to: v2 }
    }
  }
  return { type: Object.keys(changed).length ? 'updated' : 'unchanged', fields: changed }
}

function stripLargeFields(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(stripLargeFields)
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && v.length > 2000 && (v.startsWith('data:') || v.startsWith('blob:'))) {
      out[k] = v.substring(0, 50) + '...[stripped]'
    } else if (typeof v === 'string' && v.length > 5000) {
      out[k] = v.substring(0, 200) + '...[truncated]'
    } else if (typeof v === 'object' && v !== null) {
      out[k] = stripLargeFields(v)
    } else {
      out[k] = v
    }
  }
  return out
}

const STORAGE_KEY = 'aia_v1_changeTracker'
const MAX_CHANGES = 200

export function listRecentChanges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistChanges(changes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
  } catch (e) {
    console.warn('[changeTracker] Storage quota exceeded, trimming oldest changes')
    const trimmed = changes.slice(0, Math.floor(changes.length / 2))
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch (e2) {
      console.warn('[changeTracker] Still full after trim, keeping minimal set')
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed.slice(0, 20)))
      } catch {}
    }
  }
}

export function recordChange({
  id = null,
  entity,
  recordId,
  title = '',
  action = 'update',
  previousValue = null,
  newValue = null,
  user = 'admin',
  status = CHANGE_STATUSES.SAVED,
  failedStage = null,
  verificationStages = null,
  note = ''
}) {
  const changes = listRecentChanges()
  const changeId = id || uid('chg')
  const diff = computeDiff(previousValue, newValue)

  const existingIndex = changes.findIndex((c) => c.id === changeId)
  const record = {
    id: changeId,
    entity,
    recordId,
    title,
    action,
    user,
    status,
    failedStage,
    diff,
    previousSnapshot: previousValue ? stripLargeFields(JSON.parse(JSON.stringify(previousValue))) : null,
    newSnapshot: newValue ? stripLargeFields(JSON.parse(JSON.stringify(newValue))) : null,
    verificationStages,
    note,
    timestamp: new Date().toISOString()
  }

  if (existingIndex >= 0) {
    changes[existingIndex] = { ...changes[existingIndex], ...record }
  } else {
    changes.unshift(record)
  }

  const capped = changes.slice(0, MAX_CHANGES)
  persistChanges(capped)

  return record
}

export function updateChangeStatus(changeId, status, { failedStage = null, verificationStages = null, note = '' } = {}) {
  const changes = listRecentChanges()
  const index = changes.findIndex((c) => c.id === changeId)
  if (index >= 0) {
    changes[index].status = status
    if (failedStage !== null) changes[index].failedStage = failedStage
    if (verificationStages !== null) changes[index].verificationStages = verificationStages
    if (note) changes[index].note = note
    changes[index].updatedAt = new Date().toISOString()
    persistChanges(changes)
    return changes[index]
  }
  return null
}
