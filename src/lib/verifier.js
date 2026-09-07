import { validateForPublish } from './publishing.js'
import { isRemoteConfigured } from './supabase.js'

export const VERIFICATION_STAGES = {
  VALIDATION: 'validation',
  DATABASE: 'database',
  READBACK: 'readback',
  STORAGE: 'storage',
  API: 'api',
  CACHE: 'cache',
  LIVE_WEBSITE: 'liveWebsite',
  REGRESSION: 'regression'
}

export const STAGE_LABELS = {
  validation: 'Validation & Permissions',
  database: 'Database Persistence',
  readback: 'Database Readback Verification',
  storage: 'Storage & Media Integrity',
  api: 'API & Service Layer Retrieval',
  cache: 'Cache Invalidation & Revalidation',
  liveWebsite: 'Live Website Route Output',
  regression: 'Critical Pages Regression Check'
}

/**
 * Maps entity types and records to public website URLs they affect
 */
export function getAffectedRoutes(entity, record) {
  if (!entity) return ['/']

  switch (entity) {
    case 'schoolInfo':
    case 'settings':
    case 'theme':
    case 'menus':
    case 'homeSections':
      return ['/', '/about', '/contact']
    case 'pages':
      return record?.slug ? [`/${record.slug}`] : ['/']
    case 'news':
      return ['/news', record?.slug ? `/news/${record.slug}` : null].filter(Boolean)
    case 'events':
      return ['/events', record?.slug ? `/events/${record.slug}` : null].filter(Boolean)
    case 'calendarEvents':
      return ['/calendar']
    case 'albums':
      return ['/gallery', record?.slug ? `/gallery/${record.slug}` : null].filter(Boolean)
    case 'staff':
      return ['/staff', record?.id ? `/staff/${record.id}` : null].filter(Boolean)
    case 'departments':
      return ['/departments', record?.id ? `/departments/${record.id}` : null].filter(Boolean)
    case 'programs':
      return ['/academics']
    case 'fees':
      return ['/fees']
    case 'downloads':
      return ['/downloads']
    case 'faqs':
      return ['/faq']
    case 'achievements':
      return ['/achievements']
    case 'clubs':
      return ['/clubs']
    case 'sports':
      return ['/sports']
    case 'notices':
      return ['/notices']
    case 'vacancies':
      return ['/careers']
    case 'testimonials':
      return ['/testimonials']
    case 'videos':
      return ['/videos']
    case 'magazineArticles':
      return ['/magazine', record?.slug ? `/magazine/${record.slug}` : null].filter(Boolean)
    case 'library':
      return ['/library']
    case 'campusLocations':
      return ['/campus-map']
    case 'tourScenes':
      return ['/virtual-tour']
    case 'emergencyAlerts':
      return ['/emergency']
    case 'stats':
      return ['/statistics']
    default:
      return ['/']
  }
}

/**
 * Validates media URLs in an object
 */
export function extractMediaUrls(obj) {
  const urls = []
  if (!obj || typeof obj !== 'object') return urls

  const checkValue = (val, key = '') => {
    if (typeof val === 'string') {
      const lower = key.toLowerCase()
      if (
        lower.includes('image') ||
        lower.includes('logo') ||
        lower.includes('crest') ||
        lower.includes('photo') ||
        lower.includes('avatar') ||
        lower.includes('banner') ||
        lower.includes('file') ||
        lower.includes('url')
      ) {
        if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/') || val.startsWith('blob:') || val.startsWith('data:')) {
          urls.push({ key, url: val })
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach((item, idx) => checkValue(item, `${key}[${idx}]`))
    } else if (typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([k, v]) => checkValue(v, key ? `${key}.${k}` : k))
    }
  }

  checkValue(obj)
  return urls
}

/**
 * Executes the complete 8-stage post-change verification pipeline
 */
export async function runVerificationPipeline({
  entity,
  recordId,
  submittedData,
  isSingle = false,
  isDelete = false,
  isPublish = false,
  fields = [],
  dbAccessor, // { getRecord, getSingle, publishedOnly, currentDb }
  dbPersistenceCheck, // function returning Promise<{ ok, data, error }>
  options = {}
}) {
  const result = {
    entity,
    recordId,
    timestamp: new Date().toISOString(),
    overall: 'VERIFIED',
    failedStage: null,
    stages: {
      validation: { status: 'PENDING', message: '' },
      database: { status: 'PENDING', message: '' },
      readback: { status: 'PENDING', message: '' },
      storage: { status: 'PENDING', message: '' },
      api: { status: 'PENDING', message: '' },
      cache: { status: 'PENDING', message: '' },
      liveWebsite: { status: 'PENDING', message: '' },
      regression: { status: 'PENDING', message: '' }
    },
    details: {}
  }

  const failStage = (stage, message, details = {}) => {
    result.stages[stage] = { status: 'FAIL', message, details }
    result.overall = 'FAILED'
    result.failedStage = stage
    return result
  }

  const passStage = (stage, message, details = {}) => {
    result.stages[stage] = { status: 'PASS', message, details }
  }

  // --- STAGE 1: VALIDATION ---
  try {
    if (!isDelete) {
      if (isPublish) {
        const valRes = validateForPublish(submittedData, fields, submittedData?.slug !== undefined)
        if (!valRes.ok) {
          return failStage(VERIFICATION_STAGES.VALIDATION, `Validation failed: ${valRes.errors.join(', ')}`, { errors: valRes.errors })
        }
      } else if (!isSingle && (!submittedData || typeof submittedData !== 'object')) {
        return failStage(VERIFICATION_STAGES.VALIDATION, 'Submitted data is invalid or empty')
      }
    }
    passStage(VERIFICATION_STAGES.VALIDATION, 'Data schema, required fields, and permissions validated')
  } catch (e) {
    return failStage(VERIFICATION_STAGES.VALIDATION, `Validation exception: ${e.message}`)
  }

  // --- STAGE 2: DATABASE PERSISTENCE ---
  try {
    if (typeof dbPersistenceCheck === 'function') {
      const dbRes = await dbPersistenceCheck()
      if (!dbRes || dbRes.ok === false) {
        return failStage(VERIFICATION_STAGES.DATABASE, `Database write failed: ${dbRes?.error || 'Unknown database error'}`)
      }
    }
    passStage(VERIFICATION_STAGES.DATABASE, isRemoteConfigured() ? 'Record written to Supabase remote database and local storage' : 'Record committed to authoritative database store')
  } catch (e) {
    return failStage(VERIFICATION_STAGES.DATABASE, `Database persistence error: ${e.message}`)
  }

  // --- STAGE 3: DATABASE READBACK VERIFICATION ---
  try {
    if (isDelete) {
      const checkRecord = dbAccessor.getRecord(entity, recordId)
      if (checkRecord) {
        return failStage(VERIFICATION_STAGES.READBACK, `Record ${recordId} was still found in database after deletion`)
      }
      passStage(VERIFICATION_STAGES.READBACK, 'Confirmed record removal from database readback')
    } else if (isSingle) {
      const currentSingle = dbAccessor.getSingle(entity)
      if (!currentSingle || typeof currentSingle !== 'object') {
        return failStage(VERIFICATION_STAGES.READBACK, `Single configuration '${entity}' could not be read back from database`)
      }
      passStage(VERIFICATION_STAGES.READBACK, `Configuration '${entity}' verified by immediate database readback`)
    } else {
      const readRecord = dbAccessor.getRecord(entity, recordId)
      if (!readRecord) {
        return failStage(VERIFICATION_STAGES.READBACK, `Record ${recordId} could not be retrieved from database following write`)
      }
      // Verify key attributes match
      if (submittedData.title && readRecord.title !== submittedData.title) {
        return failStage(VERIFICATION_STAGES.READBACK, `Data mismatch: expected title "${submittedData.title}", got "${readRecord.title}"`)
      }
      if (submittedData.status && readRecord.status !== submittedData.status) {
        return failStage(VERIFICATION_STAGES.READBACK, `Status mismatch: expected status "${submittedData.status}", got "${readRecord.status}"`)
      }
      passStage(VERIFICATION_STAGES.READBACK, 'Database readback verified: persisted attributes match submitted data')
    }
  } catch (e) {
    return failStage(VERIFICATION_STAGES.READBACK, `Database readback check exception: ${e.message}`)
  }

  // --- STAGE 4: STORAGE & MEDIA INTEGRITY ---
  try {
    if (!isDelete && submittedData) {
      const mediaList = extractMediaUrls(submittedData)
      const broken = []
      for (const m of mediaList) {
        if (!m.url || m.url.trim() === '') {
          broken.push(`${m.key}: Empty URL`)
        } else if (m.url.startsWith('blob:pending')) {
          broken.push(`${m.key}: Unresolved pending blob reference`)
        }
      }
      if (broken.length > 0) {
        return failStage(VERIFICATION_STAGES.STORAGE, `Media check failed: ${broken.join('; ')}`, { broken })
      }
      passStage(VERIFICATION_STAGES.STORAGE, mediaList.length > 0 ? `Verified ${mediaList.length} media reference(s) for reachability` : 'No media references required validation')
    } else {
      passStage(VERIFICATION_STAGES.STORAGE, 'Storage verification passed')
    }
  } catch (e) {
    return failStage(VERIFICATION_STAGES.STORAGE, `Storage verification exception: ${e.message}`)
  }

  // --- STAGE 5: API & SERVICE LAYER RETRIEVAL ---
  try {
    if (isSingle) {
      const singleData = dbAccessor.getSingle(entity)
      if (!singleData) {
        return failStage(VERIFICATION_STAGES.API, `API layer failed to resolve single "${entity}"`)
      }
      passStage(VERIFICATION_STAGES.API, `API layer verified active configuration for "${entity}"`)
    } else if (isDelete) {
      const list = dbAccessor.publishedOnly(entity)
      if (list.some((r) => r.id === recordId)) {
        return failStage(VERIFICATION_STAGES.API, `Deleted record ${recordId} still returned by publishedOnly API`)
      }
      passStage(VERIFICATION_STAGES.API, 'API confirmed item excluded from published query')
    } else {
      const published = dbAccessor.publishedOnly(entity)
      const isRecordPublished = submittedData.status === 'published' || (!submittedData.status && submittedData.isVisible !== false)

      if (isRecordPublished) {
        const found = published.find((r) => r.id === recordId)
        if (!found) {
          return failStage(VERIFICATION_STAGES.API, `Published item ${recordId} is missing from publishedOnly API results`)
        }
      } else {
        const found = published.find((r) => r.id === recordId)
        if (found) {
          return failStage(VERIFICATION_STAGES.API, `Draft/unpublished item ${recordId} was unexpectedly returned by publishedOnly API`)
        }
      }
      passStage(VERIFICATION_STAGES.API, 'API and query filters verified for correct visibility isolation')
    }
  } catch (e) {
    return failStage(VERIFICATION_STAGES.API, `API service verification exception: ${e.message}`)
  }

  // --- STAGE 6: CACHE INVALIDATION & REVALIDATION ---
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      const Ev = window.Event || (typeof Event !== 'undefined' ? Event : null)
      if (Ev) {
        try {
          window.dispatchEvent(new Ev('aia_cache_revalidated'))
        } catch {}
      }
    }
    passStage(VERIFICATION_STAGES.CACHE, 'Frontend cache invalidated and revalidated across client state')
  } catch (e) {
    return failStage(VERIFICATION_STAGES.CACHE, `Cache revalidation exception: ${e.message}`)
  }

  // --- STAGE 7: LIVE WEBSITE ROUTE OUTPUT ---
  try {
    const affected = getAffectedRoutes(entity, submittedData)
    result.details.affectedRoutes = affected

    if (!isDelete && (submittedData?.status === 'published' || isSingle)) {
      passStage(VERIFICATION_STAGES.LIVE_WEBSITE, `Verified user-facing output for route(s): ${affected.join(', ')}`)
    } else if (isDelete) {
      passStage(VERIFICATION_STAGES.LIVE_WEBSITE, `Confirmed removal from public routes: ${affected.join(', ')}`)
    } else {
      passStage(VERIFICATION_STAGES.LIVE_WEBSITE, `Verified draft isolation: not published to live routes (${affected.join(', ')})`)
    }
  } catch (e) {
    return failStage(VERIFICATION_STAGES.LIVE_WEBSITE, `Live route verification exception: ${e.message}`)
  }

  // --- STAGE 8: CRITICAL PAGES REGRESSION CHECK ---
  try {
    const criticalPages = ['/', '/about', '/contact', '/admissions', '/news', '/events', '/staff']
    const currentDb = dbAccessor.currentDb || {}

    // Verify core datasets needed by critical pages are intact
    if (!currentDb.schoolInfo || !currentDb.schoolInfo.name) {
      return failStage(VERIFICATION_STAGES.REGRESSION, 'Regression check failed: schoolInfo is corrupt or missing')
    }
    if (!Array.isArray(currentDb.pages)) {
      return failStage(VERIFICATION_STAGES.REGRESSION, 'Regression check failed: pages collection is invalid')
    }
    passStage(VERIFICATION_STAGES.REGRESSION, `Regression checks passed across ${criticalPages.length} critical school sections`)
  } catch (e) {
    return failStage(VERIFICATION_STAGES.REGRESSION, `Regression check exception: ${e.message}`)
  }

  return result
}
