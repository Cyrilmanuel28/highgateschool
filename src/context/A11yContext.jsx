import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const A11yContext = createContext(null)
const STORAGE_KEY = 'aia_a11y'

export function useA11y() {
  return useContext(A11yContext)
}

function initialSettings() {
  const stored = { light: { mode: 'light', highContrast: false, fontSize: 1, reduceMotion: false } }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { light: stored.light, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  const dark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return { light: stored.light, mode: dark ? 'dark' : 'light', highContrast: false, fontSize: 1, reduceMotion: false }
}

export function A11yProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', settings.mode === 'dark')
    root.classList.toggle('high-contrast', settings.highContrast)
    root.classList.toggle('reduce-motion', settings.reduceMotion)
    root.classList.remove('font-scale-1', 'font-scale-2')
    if (settings.fontSize !== 1) root.classList.add(`font-scale-${settings.fontSize}`)
  }, [settings])

  const set = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), [])

  const value = useMemo(() => ({ ...settings, set, toggleDark: () => set({ mode: settings.mode === 'dark' ? 'light' : 'dark' }) }), [settings, set])

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}
