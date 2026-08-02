import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchAllCollectionsFromRemote, pushCollectionToRemote, pushSingleToRemote, getBlob, setBlob, saveCollection, cacheDb, COLLECTIONS, SINGLES, invalidateBlob, storeRemote, DB_KEY, loadDb } from '../lib/store.js'
import { supabase as sbClient, ITEMS_TABLE, uploadToStorage, deleteFromStorage, isRemoteConfigured } from '../lib/supabase.js'
import { processSchedule } from '../lib/scheduler.js'
import { uid } from '../lib/utils.js'
import { compressImage } from '../lib/media.js'
import { api } from '../lib/api.js'
import { saveVersion, listVersions, getVersion, listAllVersions } from '../lib/versions.js'
import { appendAudit, listAudit, clearAudit } from '../lib/audit.js'
import {
  isPublicSubmission,
  VERSIONED_EDIT,
  actionForStatusChange,
  recordTitle,
  validateForPublish
} from '../lib/publishing.js'

const DataContext = createContext(null)

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const [db, setDb] = useState({})
  const [loading, setLoading] = useState(true)
  const dbRef = useRef(db)
  dbRef.current = db
  const [auditLog, setAuditLog] = useState(() => listAudit())
  const [versions, setVersions] = useState(() => listAllVersions())

  // --- Boot: load cache instantly for state, sync from Supabase before showing ---
  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      const cached = loadDb()
      if (cancelled) return
      dbRef.current = cached
      setDb({ ...cached })
      try {
        const data = await fetchAllCollectionsFromRemote()
        if (cancelled) return
        dbRef.current = data
        setDb({ ...data })
        setAuditLog(listAudit())
        setVersions(listAllVersions())
      } catch (e) {
        console.error('[data] Supabase sync failed, using cache', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    boot()
    return () => { cancelled = true }
  }, [])

  // --- Mutate: optimistic update, push to Supabase in background ---
  const mutate = useCallback((key, updater) => {
    const previous = dbRef.current
    const next = updater(previous[key])
    const newDb = { ...previous, [key]: next }
    dbRef.current = newDb
    setDb(newDb)
    try { saveCollection(key, next) } catch {}
    pushCollectionToRemote(key, next).then(r => {
      if (!r.ok) {
        console.warn('[data] push failed for', key, r.error)
      }
    })
    return next
  }, [])

  const actorFromSession = useCallback(() => {
    try {
      const s = sessionStorage.getItem('aia_session')
      if (s) {
        const u = JSON.parse(s)
        if (u && u.username) return { user: u.username, role: u.role || 'admin' }
      }
    } catch {}
    return { user: 'admin', role: 'admin' }
  }, [])

  const currentActor = useCallback(() => {
    try {
      const s = sessionStorage.getItem('aia_session')
      if (s) {
        const u = JSON.parse(s)
        if (u && u.username) return { user: u.username, role: u.role || 'admin' }
      }
    } catch {}
    return null
  }, [])

  const audit = useCallback(
    (entry) => {
      const current = listAudit()
      const last = current[current.length - 1]
      if (
        last &&
        last.entity === entry.entity &&
        last.recordId === entry.recordId &&
        last.action === entry.action &&
        last.user === entry.user &&
        Date.now() - new Date(last.at).getTime() < 20000
      ) {
        return
      }
      appendAudit(entry)
      setAuditLog(listAudit())
    },
    []
  )

  const snapshot = useCallback(
    (key, record, action, actor) => {
      if (!record || !record.id) return
      const existing = listVersions(key, record.id)
      const newest = existing[0]
      if (newest && newest.action === action && Date.now() - new Date(newest.at).getTime() < 15000) return
      saveVersion(key, record.id, record, action, actor.user)
      setVersions(listAllVersions())
    },
    []
  )

  const create = useCallback(
    (key, data) => {
      const id = data.id || uid(key.slice(0, 3))
      const record = { ...data, id }
      mutate(key, (rows) => [...(rows || []), record])
      if (!isPublicSubmission(key)) {
        const actor = actorFromSession()
        snapshot(key, record, 'create', actor)
        audit({ ...actor, entity: key, recordId: id, title: recordTitle(record), action: 'create', from: null, to: record.status || 'draft', note: 'Created' })
      }
      return record
    },
    [mutate, actorFromSession, snapshot, audit]
  )

  const update = useCallback(
    (key, id, patch) => {
      const currentRows = dbRef.current[key] || []
      const old = currentRows.find((r) => r.id === id) || null
      mutate(key, (rows) =>
        rows.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r))
      )
      const next = { ...(old || {}), ...patch }
      const from = old ? old.status || 'draft' : undefined
      const to = next.status
      const action = actionForStatusChange(from, to)
      const statusChanged = from !== to
      const isPublic = isPublicSubmission(key)
      if (!isPublic || statusChanged) {
        if (statusChanged || (old && VERSIONED_EDIT.has(key))) {
          snapshot(key, old, action, actorFromSession())
        }
        if (!isPublic || statusChanged) {
          audit({
            ...actorFromSession(),
            entity: key,
            recordId: id,
            title: recordTitle(old || next),
            action,
            from,
            to,
            note: statusChanged ? '' : 'Content edited'
          })
        }
      }
      return next
    },
    [mutate, actorFromSession, snapshot, audit]
  )

  const remove = useCallback(
    (key, id) => {
      const old = (dbRef.current[key] || []).find((r) => r.id === id) || null
      if (old?.storagePath) deleteFromStorage(old.storagePath).catch(() => {})
      mutate(key, (rows) => rows.filter((r) => r.id !== id))
      if (old && !isPublicSubmission(key)) {
        const actor = actorFromSession()
        snapshot(key, old, 'delete', actor)
        audit({ ...actor, entity: key, recordId: id, title: recordTitle(old), action: 'delete', from: old.status, to: null, note: 'Deleted' })
      }
    },
    [mutate, actorFromSession, snapshot, audit]
  )

  const replaceAll = useCallback(
    (key, rows) => {
      const before = dbRef.current[key] || []
      mutate(key, () => rows)
      if (!isPublicSubmission(key) && JSON.stringify(before) !== JSON.stringify(rows)) {
        audit({ ...actorFromSession(), entity: key, recordId: null, title: key, action: 'bulk-update', from: null, to: null, note: 'Collection reordered or replaced' })
      }
    },
    [mutate, actorFromSession, audit]
  )

  const reorder = useCallback(
    (key, orderedIds) => {
      mutate(key, (rows) => {
        const map = Object.fromEntries(rows.map((r) => [r.id, r]))
        const ordered = orderedIds.map((id) => map[id]).filter(Boolean)
        const rest = rows.filter((r) => !orderedIds.includes(r.id))
        const merged = [...ordered, ...rest]
        return merged.map((r, i) => ({ ...r, order: i + 1 }))
      })
      audit({ ...actorFromSession(), entity: key, recordId: null, title: key, action: 'bulk-update', from: null, to: null, note: 'Items reordered' })
    },
    [mutate, actorFromSession, audit]
  )

  const getRecord = useCallback((key, id) => {
    const rows = dbRef.current[key] || []
    return rows.find((r) => r.id === id) || null
  }, [])

  const getBySlug = useCallback((key, slug) => {
    const rows = dbRef.current[key] || []
    const matches = rows.filter((r) => r.slug === slug)
    if (matches.length === 0) return null
    return matches.find((r) => r.status === 'published') || matches[0]
  }, [])

  const publishedOnly = useCallback(
    (key, sortField = null, desc = false) => {
      const rows = dbRef.current[key] || []
      return rows
        .filter((r) => (r.status === undefined || r.status === 'published') && r.isVisible !== false)
        .sort((a, b) => {
          const af = sortField ? new Date(a[sortField]).getTime() || 0 : (a.order ?? 0)
          const bf = sortField ? new Date(b[sortField]).getTime() || 0 : (b.order ?? 0)
          return desc ? bf - af : af - bf
        })
    },
    []
  )

  const saveSingle = useCallback(
    async (key, data) => {
      const previous = dbRef.current[key]
      const newDb = { ...dbRef.current, [key]: data }
      dbRef.current = newDb
      setDb(newDb)
      const result = await pushSingleToRemote(key, data)
      if (!result.ok) {
        console.warn('[data] single push failed, reverting', key, result.error)
        dbRef.current = { ...dbRef.current, [key]: previous }
        setDb({ ...dbRef.current })
        throw new Error(result.error)
      }
      try { localStorage.setItem(DB_KEY + key, JSON.stringify(data)) } catch {}
      audit({ ...actorFromSession(), entity: key, recordId: null, title: key, action: 'update', from: null, to: null, note: 'Site configuration updated' })
      return data
    },
    [actorFromSession, audit]
  )

  const getSingle = useCallback((key) => dbRef.current[key] || null, [])

  const incrementCount = useCallback((key, id, field = 'count') => {
    const record = dbRef.current[key]?.find((r) => r.id === id)
    if (!record) return
    update(key, id, { [field]: (Number(record[field]) || 0) + 1 })
  }, [update])

  const resolveMediaUrl = useCallback((media) => {
    if (!media) return ''
    if (media.url && !media.url.startsWith('blob:')) return media.url
    if (media.url && media.url.startsWith('blob:')) {
      const id = media.url.replace('blob:', '')
      const blob = getBlob(id)
      return blob || ''
    }
    return media.url || ''
  }, [])

  const addMedia = useCallback(
    async (file, folder = 'Uncategorised', toast) => {
      let url = ''
      let storagePath = null
      let name = file.name
      if (isRemoteConfigured()) {
        try {
          const res = await uploadToStorage(file)
          url = res?.url || ''
          storagePath = res?.path || null
        } catch (e) {
          console.warn('[media] Storage upload failed, falling back to base64:', e.message)
        }
      }
      if (!url) {
        const dataUrl = await compressImage(file)
        url = dataUrl.length > 500000 ? `blob:${'pending'}` : dataUrl
        if (url.startsWith('blob:') && dataUrl) {
          const id = uid('med')
          setBlob(id, dataUrl)
          url = `blob:${id}`
        }
      }
      const id = uid('med')
      const record = {
        id,
        name,
        type: file.type,
        size: file.size,
        folder: folder || 'Uncategorised',
        url,
        storagePath,
        createdAt: new Date().toISOString()
      }
      create('media', record)
      if (toast) toast('Media uploaded', 'success')
      return record
    },
    [create]
  )

  const publish = useCallback(
    (key, id, opts = {}) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized — sign in to publish'] }
      const record = dbRef.current[key]?.find((r) => r.id === id)
      if (!record) return { ok: false, errors: ['Record not found'] }
      const check = validateForPublish(record, opts.fields || [], true)
      if (!check.ok) return { ok: false, errors: check.errors }
      const now = new Date().toISOString()
      update(key, id, { status: 'published', publishAt: null, publishedAt: record.publishedAt || now, updatedAt: now })
      const next = dbRef.current[key]?.find((r) => r.id === id)
      return { ok: true, record: next || record }
    },
    [currentActor, update]
  )

  const unpublish = useCallback(
    (key, id) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized'] }
      const record = dbRef.current[key]?.find((r) => r.id === id)
      if (!record) return { ok: false, errors: ['Record not found'] }
      const target = record.status === 'published' ? 'unpublished' : 'draft'
      update(key, id, { status: target, publishAt: null, updatedAt: new Date().toISOString() })
      return { ok: true }
    },
    [currentActor, update]
  )

  const archive = useCallback(
    (key, id) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized'] }
      const record = dbRef.current[key]?.find((r) => r.id === id)
      if (!record) return { ok: false, errors: ['Record not found'] }
      update(key, id, { status: 'archived', publishAt: null, updatedAt: new Date().toISOString() })
      return { ok: true }
    },
    [currentActor, update]
  )

  const submitForReview = useCallback(
    (key, id) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized'] }
      const record = dbRef.current[key]?.find((r) => r.id === id)
      if (!record) return { ok: false, errors: ['Record not found'] }
      update(key, id, { status: 'pending', publishAt: null, updatedAt: new Date().toISOString() })
      return { ok: true }
    },
    [currentActor, update]
  )

  const schedule = useCallback(
    (key, id, publishAt) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized'] }
      if (!publishAt) return { ok: false, errors: ['Choose a publish date and time first'] }
      const record = dbRef.current[key]?.find((r) => r.id === id)
      if (!record) return { ok: false, errors: ['Record not found'] }
      update(key, id, { status: 'scheduled', publishAt: new Date(publishAt).toISOString(), updatedAt: new Date().toISOString() })
      return { ok: true }
    },
    [currentActor, update]
  )

  const restoreVersion = useCallback(
    (key, id, versionId) => {
      const actor = currentActor()
      if (!actor) return { ok: false, errors: ['Not authorized'] }
      const v = getVersion(key, id, versionId)
      if (!v) return { ok: false, errors: ['Version not found'] }
      const restored = { ...v.snapshot, id }
      const exists = (dbRef.current[key] || []).find((r) => r.id === id)
      if (exists) {
        snapshot(key, exists, 'restore', actor)
        mutate(key, (rows) =>
          rows.map((r) => (r.id === id ? { ...restored, updatedAt: new Date().toISOString() } : r))
        )
      } else {
        mutate(key, (rows) => [...rows, restored])
      }
      audit({
        ...actor,
        entity: key,
        recordId: id,
        title: recordTitle(restored),
        action: 'restore',
        from: exists?.status || null,
        to: restored.status,
        note: 'Rolled back to a previous version'
      })
      setVersions(listAllVersions())
      return { ok: true, record: restored }
    },
    [currentActor, getVersion, snapshot, mutate, audit]
  )

  const versionsOf = useCallback((key, id) => listVersions(key, id), [])

  const clearAuditLog = useCallback(() => {
    clearAudit()
    setAuditLog([])
  }, [])

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const run = () => {
      const changed = processSchedule(dbRef.current)
      if (changed.length) {
        changed.forEach(({ key }) => {
          pushCollectionToRemote(key, dbRef.current[key]).then(r => {
            if (r.ok) {
              try { saveCollection(key, dbRef.current[key]) } catch {}
            }
          }).catch(() => {})
        })
        setAuditLog(listAudit())
        setVersions(listAllVersions())
        setDb({ ...dbRef.current })
      }
    }
    run()
    const t = setInterval(run, 15000)
    return () => clearInterval(t)
  }, [])

  const resync = useCallback(async () => {
    if (!storeRemote()) return { ok: false, reason: 'remote not configured' }
    try {
      const data = await fetchAllCollectionsFromRemote()
      dbRef.current = data
      setDb({ ...data })
      setAuditLog(listAudit())
      setVersions(listAllVersions())
      return { ok: true }
    } catch (e) {
      return { ok: false, reason: e.message }
    }
  }, [])

  const value = useMemo(
    () => ({
      db,
      loading,
      auditLog,
      versions,
      create,
      update,
      remove,
      replaceAll,
      reorder,
      getRecord,
      getBySlug,
      publishedOnly,
      saveSingle,
      getSingle,
      incrementCount,
      resolveMediaUrl,
      addMedia,
      publish,
      unpublish,
      archive,
      submitForReview,
      schedule,
      restoreVersion,
      versionsOf,
      clearAuditLog,
      resync,
      now
    }),
    [
      db,
      loading,
      auditLog,
      versions,
      create,
      update,
      remove,
      replaceAll,
      reorder,
      getRecord,
      getBySlug,
      publishedOnly,
      saveSingle,
      getSingle,
      incrementCount,
      resolveMediaUrl,
      addMedia,
      publish,
      unpublish,
      archive,
      submitForReview,
      schedule,
      restoreVersion,
      versionsOf,
      clearAuditLog,
      resync,
      now
    ]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
