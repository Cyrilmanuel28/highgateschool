import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock, GraduationCap, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import SeoHead from '../../components/SeoHead.jsx'

export default function Login() {
  const { isAuthed, login } = useAuth()
  const { db } = useData()
  const info = db.schoolInfo
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to="/dashboard" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(username.trim(), password)
    if (res.ok) navigate('/dashboard')
    else setError(res.error)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4">
      <SeoHead title="Admin Login" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-navy-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 shadow-gold">
            <GraduationCap size={30} className="text-navy-900" />
          </div>
          <h1 className="mt-5 font-serif text-3xl font-semibold text-white">Developer Dashboard</h1>
          <p className="mt-2 text-sm text-navy-200">{info?.name || 'Highgate School'} · Content Management System</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-200">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="admin"
            className="mb-5 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-navy-300 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30"
          />
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-200">Password</label>
          <div className="relative mb-2">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 pr-12 text-sm text-white placeholder-navy-300 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 transition hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-300">
              {error}
            </p>
          )}

          <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 py-3 text-sm font-bold text-navy-900 shadow-gold transition hover:bg-gold-400">
            <Lock size={15} /> Sign In
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-navy-300">
            Authentication is handled by Supabase.
          </p>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-xs text-navy-300 underline-offset-4 transition hover:text-gold-400 hover:underline">
            ← Back to public site
          </a>
        </p>
      </div>
    </div>
  )
}
