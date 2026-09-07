import { supabase as _supabase, isRemoteConfigured, remoteSession, ITEMS_TABLE, SINGLES_TABLE } from './supabase'

export const COLLECTIONS = [
  'pages','news','homeSections','albums','media',
  'events','calendarEvents','notices',
  'staff','departments','programs','fees',
  'achievements','clubs','sports','stats',
  'testimonials','feedback','messages',
  'downloads','library','magazineArticles','vacancies',
  'campusLocations','tourScenes','emergencyAlerts',
  'faqs','videos','menus',
  'newsletterCampaigns','newsletterSubscribers',
  'applications','jobApplications','eventRegistrations',
]

export const SINGLES = {
  schoolInfo: {
    officeHours: '',
    saturdayHours: '',
    mapEmbedUrl: '',
    newsletterTitle: '',
    newsletterDescription: '',
    contactHeading: '',
    contactSubheading: '',
    paymentBursariesTitle: '',
    paymentBursariesText: '',
    paymentMethodsText: '',
    seoDescription: '',
    assistantTitle: '',
    assistantSubtitle: '',
    assistantWelcome: '',
    assistantSuggestions: [],
    footerQuickLinksTitle: '',
    footerProgrammesTitle: '',
    footerContactTitle: '',
  },
  settings: { contact: {}, socialLinks: {}, footer: { columns: [], bottomBar: {} }, footerCustomization: {}, home: {} },
  theme: { primary: '#1B3A5C', secondary: '#C8102E', fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Lora' } },
  socialFeeds: { platforms: {} },
}

export const PUBLIC_SUBMISSION = new Set([
  'messages','feedback','testimonials','newsletterSubscribers',
  'applications','jobApplications',
])

export const DB_KEY = 'aia_v1_'
const BLOB_PREFIX = 'aia_v1_blob_'
const IMAGE_MAX_BYTES = 4 * 1024 * 1024

export function loadDb() {
  const db = {}
  for (const key of COLLECTIONS) {
    try { db[key] = JSON.parse(localStorage.getItem(DB_KEY + key)) || [] } catch { db[key] = [] }
  }
  for (const key of Object.keys(SINGLES)) {
    try {
      const raw = localStorage.getItem(DB_KEY + key)
      if (raw != null) db[key] = JSON.parse(raw)
      else db[key] = typeof SINGLES[key] === 'object' ? { ...SINGLES[key] } : SINGLES[key]
    } catch { db[key] = typeof SINGLES[key] === 'object' ? { ...SINGLES[key] } : SINGLES[key] }
  }
  return db
}

export function readJson(key, fallback) {
  try { const r = localStorage.getItem(DB_KEY + key); return r != null ? JSON.parse(r) : (typeof fallback === 'function' ? fallback() : fallback) }
  catch { return typeof fallback === 'function' ? fallback() : fallback }
}

export function writeJson(key, data) {
  try { localStorage.setItem(DB_KEY + key, JSON.stringify(data)) } catch {}
}

export function saveCollection(key, value) {
  if (!value || !Array.isArray(value)) throw new Error(`saveCollection expects an array for key "${key}"`)
  try { localStorage.setItem(DB_KEY + key, JSON.stringify(value)) } catch (e) { throw e }
}

export function resetDb() {
  for (const key of COLLECTIONS) { try { localStorage.removeItem(DB_KEY + key) } catch {} }
  for (const key of Object.keys(SINGLES)) { try { localStorage.removeItem(DB_KEY + key) } catch {} }
}

function getBlobPrefixed(id) {
  try { return localStorage.getItem(BLOB_PREFIX + id) || null } catch { return null }
}

function setBlobPrefixed(id, dataUrl) {
  if (dataUrl && dataUrl.length > IMAGE_MAX_BYTES) throw new Error('File too large (max 4 MB)')
  try {
    if (dataUrl) localStorage.setItem(BLOB_PREFIX + id, dataUrl)
    else localStorage.removeItem(BLOB_PREFIX + id)
  } catch (e) {
    const msg = String(e?.message || e || '')
    if (msg.includes('QuotaExceededError') || msg.toLowerCase().includes('quota')) throw new Error('Storage quota exceeded')
    throw e
  }
}

export function getBlob(id) { return getBlobPrefixed(id) }
export function setBlob(id, dataUrl) { setBlobPrefixed(id, dataUrl) }
export function invalidateBlob(id) { try { localStorage.removeItem(BLOB_PREFIX + id) } catch {} }
export function reloadKey(key, setter) {
  try {
    const raw = localStorage.getItem(DB_KEY + key)
    if (raw != null) setter(JSON.parse(raw))
  } catch {}
}

let _supabaseClient = null
export function setSupabaseClient(client) { _supabaseClient = client }
function getClient() { return _supabaseClient || _supabase }

function chunkArr(arr, size) { const out = []; for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size)); return out }

function rowFromRecord(key, record) {
  return {
    key,
    id: record.id,
    data: record,
    status: record.status || null,
    slug: record.slug || null,
    title: record.title || record.name || record.label || null,
    is_visible: record.isVisible !== undefined ? record.isVisible : null,
    created_at: record.createdAt || record.created_at || new Date().toISOString(),
    updated_at: record.updatedAt || record.updated_at || new Date().toISOString(),
  }
}

export function storeRemote() { return isRemoteConfigured() }

export { remoteSession }

export async function remoteSignIn(email, password) {
  const sb = getClient()
  if (!sb) throw new Error('Supabase not configured')
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function remoteSignOut() {
  const sb = getClient()
  if (!sb) return
  await sb.auth.signOut()
}

export function clearLocalAuth() {
  try { sessionStorage.removeItem('aia_session') } catch {}
}

// --- Cache helpers ---

export function cacheDb(db) {
  try {
    for (const key of COLLECTIONS) {
      if (db[key] != null) localStorage.setItem(DB_KEY + key, JSON.stringify(db[key]))
    }
    for (const key of Object.keys(SINGLES)) {
      if (db[key] != null) localStorage.setItem(DB_KEY + key, JSON.stringify(db[key]))
    }
  } catch {}
}

// --- Supabase with localStorage fallback ---

// Fetch all data from Supabase (the single source of truth).
// Falls back to localStorage per-collection/single on error, so the site
// still renders with cached data when offline.
export async function fetchAllCollectionsFromRemote() {
  const sb = getClient()
  if (!sb) return loadDb()

  const db = {}

  const collectionPromises = COLLECTIONS.map(async (key) => {
    const { data, error } = await sb
      .from(ITEMS_TABLE)
      .select('id,data')
      .eq('key', key)
      .order('created_at', { ascending: true })
    if (error) {
      console.warn(`[store] fetch ${key} failed, using cache:`, error.message)
      try { db[key] = JSON.parse(localStorage.getItem(DB_KEY + key)) || [] } catch { db[key] = [] }
      return
    }
    const remoteRows = (data || []).map(r => r.data)
    let localRows = []
    try { localRows = JSON.parse(localStorage.getItem(DB_KEY + key)) || [] } catch {}
    const remoteIds = new Set(remoteRows.map(r => r.id))
    const localOnly = localRows.filter(r => !remoteIds.has(r.id))
    db[key] = [...remoteRows, ...localOnly]
  })

  const singlePromises = Object.keys(SINGLES).map(async (key) => {
    const { data, error } = await sb
      .from(SINGLES_TABLE)
      .select('key,value')
      .eq('key', key)
      .maybeSingle()
    const fallback = typeof SINGLES[key] === 'object' ? { ...SINGLES[key] } : SINGLES[key]
    if (error) {
      console.warn(`[store] fetch single ${key} failed, using cache:`, error.message)
      try {
        const raw = localStorage.getItem(DB_KEY + key)
        db[key] = raw != null ? JSON.parse(raw) : fallback
      } catch { db[key] = fallback }
      return
    }
    if (data && data.value != null) {
      db[key] = data.value
    } else {
      try {
        const raw = localStorage.getItem(DB_KEY + key)
        db[key] = raw != null ? JSON.parse(raw) : fallback
      } catch { db[key] = fallback }
    }
  })

  try {
    await Promise.all([...collectionPromises, ...singlePromises])
  } catch (e) {
    console.warn('[store] Supabase fetch failed, falling back to cache', e.message)
    return loadDb()
  }

  // Cache successful Supabase data to localStorage for fast reload.
  cacheDb(db)
  return db
}

// --- Supabase-only: push a collection ---

async function ensureSession(sb) {
  return remoteSession()
}

export async function pushCollectionToRemote(key, rows) {
  const sb = getClient()
  if (!sb) return { ok: false, error: 'Supabase not configured' }
  const isSubmission = PUBLIC_SUBMISSION.has(key)
  let session = await ensureSession(sb)
  if (!session && !isSubmission) return { ok: false, error: 'Not signed in to Supabase' }

  const payload = (rows || []).map(r => rowFromRecord(key, r))

  if (isSubmission && !session) {
    const { error } = await sb.from(ITEMS_TABLE).upsert(payload, { onConflict: 'key,id', ignoreDuplicates: true })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const { error } = await sb.from(ITEMS_TABLE).upsert(payload, { onConflict: 'key,id' })
  if (error) return { ok: false, error: error.message }

  // Prune remote rows that are no longer local (user deleted them)
  try {
    const { data: remote } = await sb.from(ITEMS_TABLE).select('id').eq('key', key)
    const localIds = new Set((rows || []).map(r => r.id))
    const removed = (remote || []).filter(r => !localIds.has(r.id)).map(r => r.id)
    for (const chunk of chunkArr(removed, 200)) {
      await sb.from(ITEMS_TABLE).delete().eq('key', key).in('id', chunk)
    }
  } catch (e) {
    console.warn('[store] remote prune failed', key, e.message)
  }
  return { ok: true }
}

// --- Supabase-only: push a single ---

export async function pushSingleToRemote(key, value) {
  const sb = getClient()
  if (!sb) return { ok: false, error: 'Supabase not configured' }
  const session = await ensureSession(sb)
  if (!session) return { ok: false, error: 'Not signed in to Supabase' }

  const payload = { key, value, updated_at: new Date().toISOString() }
  const { error } = await sb.from(SINGLES_TABLE).upsert(payload, { onConflict: 'key' })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
