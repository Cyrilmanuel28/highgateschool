import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL || ''
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const ITEMS_TABLE = 'cms_items'
export const SINGLES_TABLE = 'cms_singles'

export const supabase = URL && ANON ? createClient(URL, ANON, { auth: { persistSession: true, autoRefreshToken: true } }) : null

export function isRemoteConfigured() {
  return Boolean(supabase)
}

export async function remoteSession() {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session || null
  } catch {
    return null
  }
}

export async function remoteSignIn(email, password) {
  if (!supabase) return { ok: false, reason: 'not-configured' }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, reason: error.message }
    return { ok: true, user: data.user }
  } catch (e) {
    return { ok: false, reason: e.message }
  }
}

export async function remoteSignOut() {
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch {}
}

const STORAGE_BUCKET = 'media'

export async function uploadToStorage(file) {
  if (!supabase) return null
  const ext = file.name.split('.').pop() || 'bin'
  const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
  return { url: urlData.publicUrl, path: data.path, name: file.name, size: file.size, type: file.type }
}

export async function deleteFromStorage(path) {
  if (!supabase || !path) return
  await supabase.storage.from(STORAGE_BUCKET).remove([path])
}

export function getStoragePublicUrl(path) {
  if (!supabase || !path) return ''
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data?.publicUrl || ''
}
