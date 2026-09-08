import { DB_KEY } from './store.js'

const KEY = DB_KEY + 'versions'
const MAX_PER_RECORD = 5

function stripLargeFields(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(stripLargeFields)
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && v.length > 2000 && (v.startsWith('data:') || v.startsWith('blob:'))) {
      out[k] = v.substring(0, 50) + '...[stripped]'
    } else if (typeof v === 'string' && v.length > 3000) {
      out[k] = v.substring(0, 200) + '...[truncated]'
    } else if (typeof v === 'object' && v !== null) {
      out[k] = stripLargeFields(v)
    } else {
      out[k] = v
    }
  }
  return out
}

export function loadVersionsMap() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persist(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch (e) {
    console.warn('[versions] Storage full — trimming old versions')
    for (const entity of Object.keys(map)) {
      for (const id of Object.keys(map[entity] || {})) {
        map[entity][id] = map[entity][id].slice(-2)
      }
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(map))
    } catch {
      console.warn('[versions] Still full after trim, keeping only 1 version per record')
      for (const entity of Object.keys(map)) {
        for (const id of Object.keys(map[entity] || {})) {
          map[entity][id] = map[entity][id].slice(-1)
        }
      }
      try { localStorage.setItem(KEY, JSON.stringify(map)) } catch { /* give up */ }
    }
  }
}

export function saveVersion(entity, recordId, snapshot, action, user = 'admin', now = new Date().toISOString()) {
  const map = loadVersionsMap()
  map[entity] = map[entity] || {}
  const list = map[entity][recordId] || []
  list.push({
    id: `ver_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    at: now,
    user,
    action,
    snapshot: stripLargeFields(JSON.parse(JSON.stringify(snapshot)))
  })
  map[entity][recordId] = list.slice(-MAX_PER_RECORD)
  persist(map)
  return map[entity][recordId]
}

export function listVersions(entity, recordId) {
  const map = loadVersionsMap()
  return ((map[entity] && map[entity][recordId]) || []).slice().reverse()
}

export function getVersion(entity, recordId, versionId) {
  const map = loadVersionsMap()
  return (map[entity] && map[entity][recordId])?.find((v) => v.id === versionId) || null
}

export function listAllVersions() {
  const map = loadVersionsMap()
  const out = []
  for (const [entity, byId] of Object.entries(map)) {
    for (const [recordId, list] of Object.entries(byId || {})) {
      ;(list || []).forEach((v) => out.push({ entity, recordId, ...v }))
    }
  }
  return out.sort((a, b) => new Date(b.at) - new Date(a.at))
}
