import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import path from 'node:path'

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
const { DataProvider } = await server.ssrLoadModule('/src/context/DataContext.jsx')
const { A11yProvider } = await server.ssrLoadModule('/src/context/A11yContext.jsx')
const { AuthProvider } = await server.ssrLoadModule('/src/context/AuthContext.jsx')
const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { loadDb, saveCollection, saveSingle } = await server.ssrLoadModule('/src/lib/store.js')

function renderRoute(url) {
  return renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [url] },
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          DataProvider,
          null,
          React.createElement(
            A11yProvider,
            null,
            React.createElement(AuthProvider, null, React.createElement(App, null))
          )
        )
      )
    )
  )
}

console.log('--- STARTING DASHBOARD -> DATABASE -> WEBSITE VERIFICATION ---')

const db = loadDb()

// Test 1: News Article Update
const originalNews = db.news ? [...db.news] : []
const testArticle = originalNews[0]
if (!testArticle) {
  console.error('FAIL: No news articles found in database')
  process.exit(1)
}

const originalTitle = testArticle.title
const updatedTitle = 'TEST_VERIFIED: Breakthrough STEAM Research Project'
testArticle.title = updatedTitle
testArticle.status = 'published'

saveCollection('news', originalNews)
console.log('✓ Step 1: Updated article title in database:', updatedTitle)

const newsHtml = renderRoute('/news')
if (newsHtml.includes(updatedTitle)) {
  console.log('✓ Step 2: Public /news page displays updated title successfully')
} else {
  console.error('FAIL: /news page did not reflect updated title')
  process.exit(1)
}

const articleHtml = renderRoute(`/news/${testArticle.slug}`)
if (articleHtml.includes(updatedTitle)) {
  console.log('✓ Step 3: Dynamic detail page /news/:slug displays updated title successfully')
} else {
  console.error('FAIL: /news/:slug did not reflect updated title')
  process.exit(1)
}

// Restore article title
testArticle.title = originalTitle
saveCollection('news', originalNews)
console.log('✓ Step 4: Reverted article title to original:', originalTitle)

// Test 2: School Info Tagline Update
const originalInfo = { ...db.schoolInfo }
const updatedTagline = 'TEST_VERIFIED: Inspiring Global Minds Since 1998'
saveSingle('schoolInfo', { ...originalInfo, tagline: updatedTagline })
console.log('✓ Step 5: Updated schoolInfo tagline in database:', updatedTagline)

const homeHtml = renderRoute('/')
if (homeHtml.includes(updatedTagline)) {
  console.log('✓ Step 6: Public homepage displays updated tagline successfully')
} else {
  console.error('FAIL: Homepage did not reflect updated tagline')
  process.exit(1)
}

// Restore schoolInfo
saveSingle('schoolInfo', originalInfo)
console.log('✓ Step 7: Reverted schoolInfo to original state')

// Final check: Confirm restoration
const finalHome = renderRoute('/')
if (finalHome.includes(originalInfo.tagline)) {
  console.log('✓ Step 8: Confirmed clean persistence and restoration on live homepage')
} else {
  console.error('FAIL: Final home restoration failed')
  process.exit(1)
}

console.log('--- ALL DASHBOARD -> DATABASE -> LIVE WEBSITE VERIFICATIONS PASSED ---')
process.exit(0)
