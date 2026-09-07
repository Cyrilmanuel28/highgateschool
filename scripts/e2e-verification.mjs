import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import path from 'node:path'

console.log('====================================================')
console.log('🚀 RUNNING END-TO-END POST-PUBLISH VERIFICATION SUITE')
console.log('====================================================\n')

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/'
})
global.window = dom.window
global.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
global.localStorage = dom.window.localStorage
global.sessionStorage = dom.window.sessionStorage
global.HTMLElement = dom.window.HTMLElement
global.Element = dom.window.Element
global.DOMParser = dom.window.DOMParser
global.Node = dom.window.Node
global.location = dom.window.location

const origError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('useLayoutEffect does nothing on the server')) return
  origError(...args)
}

const server = await createServer({
  root: path.resolve(import.meta.dirname, '..'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
})

const { renderToString } = await import('react-dom/server')
const { default: React } = await import('react')
const { MemoryRouter } = await import('react-router-dom')
const { ToastProvider } = await server.ssrLoadModule('/src/context/ToastContext.jsx')
const { DataProvider, useData } = await server.ssrLoadModule('/src/context/DataContext.jsx')
const { A11yProvider } = await server.ssrLoadModule('/src/context/A11yContext.jsx')
const { AuthProvider } = await server.ssrLoadModule('/src/context/AuthContext.jsx')
const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { loadDb, saveCollection, DB_KEY } = await server.ssrLoadModule('/src/lib/store.js')
const { runVerificationPipeline } = await server.ssrLoadModule('/src/lib/verifier.js')
const { recordChange, CHANGE_STATUSES } = await server.ssrLoadModule('/src/lib/changeTracker.js')

sessionStorage.setItem('aia_session', JSON.stringify({ username: 'admin', role: 'admin', loginAt: new Date().toISOString() }))

function renderRoute(route) {
  const html = renderToString(
    React.createElement(MemoryRouter, { initialEntries: [route] },
      React.createElement(ToastProvider, null,
        React.createElement(DataProvider, null,
          React.createElement(A11yProvider, null,
            React.createElement(AuthProvider, null,
              React.createElement(App))))))
  )
  const root = dom.window.document.createElement('div')
  root.innerHTML = html
  return { html, text: root.textContent.replace(/\s+/g, ' ').trim() }
}

let testNumber = 1
let passes = 0
let failures = 0

function printChangeReport(changeNum, feature, stages, overall) {
  console.log(`----------------------------------------`)
  console.log(`CHANGE #${changeNum}`)
  console.log(`Feature: ${feature}`)
  console.log(`Database:     ${stages.database?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.database?.message}`)
  console.log(`Storage:      ${stages.storage?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.storage?.message}`)
  console.log(`API:          ${stages.api?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.api?.message}`)
  console.log(`Frontend:     ${stages.validation?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.validation?.message}`)
  console.log(`Cache:        ${stages.cache?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.cache?.message}`)
  console.log(`Live Website: ${stages.liveWebsite?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.liveWebsite?.message}`)
  console.log(`Regression:   ${stages.regression?.status === 'PASS' ? '✓ PASS' : '✗ FAIL: ' + stages.regression?.message}`)
  console.log(`Overall:      ${overall === 'VERIFIED' ? '✓ VERIFIED' : '✗ FAILED'}`)
  console.log(`----------------------------------------\n`)
}

// =======================================================
// SCENARIO 1: Update School Name & Verify Across All 8 Stages
// =======================================================
console.log('TEST 1: Update School Name via Developer Dashboard and Verify Chain')
const initialDb = loadDb()
const originalName = initialDb.schoolInfo?.name || 'Highgate School'
const updatedName = 'Highgate Academy of Excellence'

// 1. Save to DB
const updatedSchoolInfo = { ...initialDb.schoolInfo, name: updatedName }
localStorage.setItem(DB_KEY + 'schoolInfo', JSON.stringify(updatedSchoolInfo))

// 2. Run 8-stage verification pipeline
const v1 = await runVerificationPipeline({
  entity: 'schoolInfo',
  isSingle: true,
  submittedData: updatedSchoolInfo,
  dbAccessor: {
    getRecord: (k, id) => (loadDb()[k] || []).find(r => r.id === id) || null,
    getSingle: (k) => loadDb()[k] || null,
    publishedOnly: (k) => (loadDb()[k] || []).filter(r => r.status === undefined || r.status === 'published'),
    currentDb: loadDb()
  }
})

// 3. Verify Live Website DOM Output
const homeRender = renderRoute('/')
const liveReflects = homeRender.text.includes(updatedName)

if (!liveReflects) {
  v1.stages.liveWebsite.status = 'FAIL'
  v1.stages.liveWebsite.message = 'Live homepage DOM did not reflect the updated school name'
  v1.overall = 'FAILED'
} else {
  v1.stages.liveWebsite.status = 'PASS'
  v1.stages.liveWebsite.message = `Verified "${updatedName}" rendered in live homepage Navbar and DOM`
}

printChangeReport(1001, 'School Profile / School Name', v1.stages, v1.overall)
if (v1.overall === 'VERIFIED') passes++; else failures++

// Restore original school name
localStorage.setItem(DB_KEY + 'schoolInfo', JSON.stringify(initialDb.schoolInfo))

// =======================================================
// SCENARIO 2: Create Draft News Article (Verify Draft Isolation)
// =======================================================
console.log('TEST 2: Draft Article Isolation (DRAFT != LIVE)')
const testDraftId = 'nw_test_draft_99'
const cleanBaseNews = (loadDb().news || []).filter(n => n.id !== testDraftId)
saveCollection('news', cleanBaseNews)

const draftArticle = {
  id: testDraftId,
  title: 'Top Secret Expansion Announcement',
  slug: 'top-secret-expansion',
  body: '<p>This should never be visible to visitors while in draft status.</p>',
  status: 'draft',
  isVisible: true
}

saveCollection('news', [...cleanBaseNews, draftArticle])

// Render public news index
const newsRender1 = renderRoute('/news')
const draftLeaked = newsRender1.text.includes('Top Secret Expansion')

console.log(`Draft in database: YES`)
console.log(`Draft visible on public /news: ${draftLeaked ? 'YES (LEAKED!)' : 'NO (CORRECTLY ISOLATED)'}`)

if (!draftLeaked) {
  console.log('✓ PASS: Draft is completely isolated from live website\n')
  passes++
} else {
  console.error('✗ FAIL: Draft leaked into public website!\n')
  failures++
}

// =======================================================
// SCENARIO 3: Publish News Article & Verify Live Website Route
// =======================================================
console.log('TEST 3: Publish News Article with Complete Post-Publish Verification')
const publishedArticle = {
  ...draftArticle,
  status: 'published',
  publishedAt: new Date().toISOString()
}

saveCollection('news', [...cleanBaseNews, publishedArticle])

const v2 = await runVerificationPipeline({
  entity: 'news',
  recordId: testDraftId,
  submittedData: publishedArticle,
  isPublish: true,
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'body', label: 'Body', required: true }
  ],
  dbAccessor: {
    getRecord: (k, id) => (loadDb()[k] || []).find(r => r.id === id) || null,
    getSingle: (k) => loadDb()[k] || null,
    publishedOnly: (k) => (loadDb()[k] || []).filter(r => r.status === undefined || r.status === 'published'),
    currentDb: loadDb()
  }
})

// Verify live route output
const newsRender2 = renderRoute('/news')
const articlePageRender = renderRoute(`/news/${publishedArticle.slug}`)
const liveAppeared = newsRender2.text.includes('Top Secret Expansion') && articlePageRender.text.includes('Top Secret Expansion')

if (liveAppeared) {
  v2.stages.liveWebsite.status = 'PASS'
  v2.stages.liveWebsite.message = `Verified article rendered on /news and /news/${publishedArticle.slug}`
} else {
  v2.stages.liveWebsite.status = 'FAIL'
  v2.stages.liveWebsite.message = 'Article failed to render on public news routes'
  v2.overall = 'FAILED'
}

printChangeReport(1002, 'News Article Publication', v2.stages, v2.overall)
if (v2.overall === 'VERIFIED') passes++; else failures++

// =======================================================
// SCENARIO 4: Delete Verification (Ensure Removed from Live)
// =======================================================
console.log('TEST 4: Delete Verification (Ensure Complete Removal from Live Site)')
saveCollection('news', cleanBaseNews) // Revert news array

const newsRender3 = renderRoute('/news')
const stillVisible = newsRender3.text.includes('Top Secret Expansion')

const v3 = await runVerificationPipeline({
  entity: 'news',
  recordId: testDraftId,
  isDelete: true,
  submittedData: publishedArticle,
  dbAccessor: {
    getRecord: (k, id) => (loadDb()[k] || []).find(r => r.id === id) || null,
    getSingle: (k) => loadDb()[k] || null,
    publishedOnly: (k) => (loadDb()[k] || []).filter(r => r.status === undefined || r.status === 'published'),
    currentDb: loadDb()
  }
})

if (!stillVisible && v3.overall === 'VERIFIED') {
  console.log('✓ PASS: Deleted article successfully purged from database and live website\n')
  passes++
} else {
  console.error('✗ FAIL: Deleted article still found on live website!\n')
  failures++
}

// =======================================================
// SCENARIO 5: Critical Pages Regression Testing
// =======================================================
console.log('TEST 5: Critical Pages Regression Suite')
const criticalRoutes = [
  '/', '/about', '/contact', '/admissions', '/news', '/events',
  '/staff', '/departments', '/fees', '/gallery', '/downloads'
]

let regPass = true
for (const cr of criticalRoutes) {
  try {
    const res = renderRoute(cr)
    if (res.text.length < 100) {
      console.error(`✗ Regression failure on ${cr}: insufficient content rendered`)
      regPass = false
    }
  } catch (e) {
    console.error(`✗ Regression crash on ${cr}: ${e.message}`)
    regPass = false
  }
}

if (regPass) {
  console.log(`✓ PASS: All ${criticalRoutes.length} critical school website routes rendered cleanly with no regressions\n`)
  passes++
} else {
  failures++
}

await server.close()

console.log('====================================================')
console.log(`VERIFICATION RESULTS: ${passes} PASSED, ${failures} FAILED`)
console.log(`STATUS: ${failures === 0 ? '🟢 FULLY VERIFIED / PRODUCTION READY' : '🔴 VERIFICATION FAILED'}`)
console.log('====================================================')

process.exit(failures === 0 ? 0 : 1)
