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
const { loadDb } = await server.ssrLoadModule('/src/lib/store.js')

const db = loadDb()
console.log('seed version:', db.settings?.seedVersion, '| collections:', Object.keys(db).filter((k) => Array.isArray(db[k])).length)

const routes = [
  '/', '/about', '/history', '/vision-mission', '/administration', '/board',
  '/student-life', '/admissions', '/academics', '/programs', '/programs/prg1',
  '/privacy-policy', '/terms',
  '/staff', '/staff/helena-moreau', '/departments', '/fees', '/calendar', '/news', '/events',
  '/gallery', '/albums', '/videos', '/achievements', '/clubs', '/sports', '/downloads',
  '/faq', '/contact', '/login', '/no-such-page',
  '/notices', '/apply', '/library', '/magazine', '/magazine/quiet-revolution-science-labs',
  '/careers', '/testimonials', '/emergency', '/campus-map', '/virtual-tour',
  '/statistics', '/feedback', '/search?q=mathematics'
]

const cmsRoutes = [
  '/dashboard', '/dashboard/pages', '/dashboard/pages/new', '/dashboard/pages/about',
  '/dashboard/menus', '/dashboard/news', '/dashboard/news/new', '/dashboard/news/n1',
  '/dashboard/events', '/dashboard/events/new', '/dashboard/events/evt1',
  '/dashboard/gallery', '/dashboard/gallery/new', '/dashboard/gallery/al1',
  '/dashboard/videos/new', '/dashboard/downloads/new', '/dashboard/faq/new',
  '/dashboard/achievements/new', '/dashboard/clubs/new', '/dashboard/sports/new',
  '/dashboard/staff/new', '/dashboard/departments/new', '/dashboard/academics/new',
  '/dashboard/fees/new', '/dashboard/calendar/new', '/dashboard/media',
  '/dashboard/seo', '/dashboard/contact-messages', '/dashboard/settings',
  '/dashboard/events/nonexistent-id',
  '/dashboard/notices', '/dashboard/notices/new', '/dashboard/applications/new',
  '/dashboard/library/new', '/dashboard/magazine/new', '/dashboard/vacancies/new',
  '/dashboard/job-applications/new', '/dashboard/feedback/new', '/dashboard/testimonials/new',
  '/dashboard/newsletter-subscribers/new', '/dashboard/newsletter-campaigns/new',
  '/dashboard/campus/new', '/dashboard/tour/new', '/dashboard/emergency/new',
  '/dashboard/event-registrations/new', '/dashboard/stats/new',
  '/dashboard/audit', '/dashboard/versions', '/dashboard/health', '/dashboard/consistency'
]

sessionStorage.setItem('aia_session', JSON.stringify({ username: 'admin', role: 'admin', loginAt: new Date().toISOString() }))

let failures = 0
for (const r of [...routes, ...cmsRoutes]) {
  try {
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [r] },
        React.createElement(ToastProvider, null,
          React.createElement(DataProvider, null,
            React.createElement(A11yProvider, null,
              React.createElement(AuthProvider, null,
                React.createElement(App))))))
    )
    const root = dom.window.document.createElement('div')
    root.innerHTML = html
    const text = root.textContent.replace(/\s+/g, ' ').trim()
    const bad = /error/i.test(text) && !/Contains no errors|error handler|no errors/i.test(text)
    console.log(`${bad ? 'WARN' : 'OK  '} ${r}  (${text.length} chars)`)
    if (bad) failures++
  } catch (e) {
    failures++
    console.log(`FAIL ${r}: ${e.message}`)
  }
}
await server.close()
console.log(failures === 0 ? '\nALL ROUTES RENDER' : `\n${failures} ROUTES FAILED`)
process.exit(failures === 0 ? 0 : 1)
