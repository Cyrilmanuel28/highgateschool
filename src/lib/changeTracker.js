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

const STORAGE_KEY = 'aia_v1_changeTracker'
const MAX_CHANGES = 500

export function listRecentChanges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
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
    previousSnapshot: previousValue ? JSON.parse(JSON.stringify(previousValue)) : null,
    newSnapshot: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped))
  } catch (e) {
    console.warn('[changeTracker] Storage quota exceeded while persisting change:', e)
  }

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
    } catch {}
    return changes[index]
  }
  return null
}
