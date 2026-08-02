import { DB_KEY } from './store.js'

const KEY = DB_KEY + 'auditLog'
const MAX = 1000

export function listAudit() {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function appendAudit({ user = 'admin', role = 'admin', entity, recordId, title = '', action, from, to, note = '' }) {
  const arr = listAudit()
  arr.push({
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    user,
    role,
    entity,
    recordId,
    title,
    action,
    from,
    to,
    note
  })
  const capped = arr.slice(-MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(capped))
  } catch (e) {
    console.error('[audit] Failed to persist audit log:', e)
  }
  return capped
}

export function clearAudit() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
