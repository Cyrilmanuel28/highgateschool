import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isRemoteConfigured, remoteSignIn, remoteSignOut, remoteSession, supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

const SESSION_KEY = 'aia_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  const login = useCallback(
    async (email, password) => {
      if (isRemoteConfigured()) {
        const res = await remoteSignIn(email, password)
        if (!res.ok) return { ok: false, error: 'Invalid email or password' }
        const u = { username: email, role: 'admin', loginAt: new Date().toISOString() }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(u))
        setUser(u)
        return { ok: true }
      }
      return { ok: false, error: 'Remote authentication not configured' }
    },
    []
  )

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
    if (isRemoteConfigured()) remoteSignOut()
  }, [])

  const changePassword = useCallback(
    async (_current, next) => {
      if (!supabase) return { ok: false, error: 'Not connected' }
      const { error } = await supabase.auth.updateUser({ password: next })
      if (error) return { ok: false, error: error.message }
      return { ok: true }
    },
    []
  )

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Restore session from Supabase refresh token on mount.
  // Supabase client persists the session (including refresh token) in its own
  // localStorage key. If the refresh token is valid, getSession() returns a
  // fresh access token without needing the user's password.
  useEffect(() => {
    if (!isRemoteConfigured()) return
    let cancelled = false
    const restore = async () => {
      let existing = null
      try { existing = sessionStorage.getItem(SESSION_KEY) } catch {}
      if (!existing) return
      try {
        const session = await remoteSession()
        if (cancelled) return
        if (session) return
      } catch {
        if (cancelled) return
      }
      // Refresh token expired or password was changed — clear local session
      sessionStorage.removeItem(SESSION_KEY)
      if (!cancelled) setUser(null)
    }
    restore()
    return () => { cancelled = true }
  }, [])

  const value = useMemo(() => ({ user, isAuthed: Boolean(user), login, logout, changePassword }), [user, login, logout, changePassword])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
