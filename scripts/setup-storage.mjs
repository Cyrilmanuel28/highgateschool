import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of readFileSync(path.resolve(import.meta.dirname, '..', '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const url = env.VITE_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env'); process.exit(1) }
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const { data: bucket, error: bErr } = await supabase.storage.createBucket('media', {
  public: true,
  fileSizeLimit: 10 * 1024 * 1024,
  allowedMimeTypes: ['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*']
})
if (bErr && !bErr.message.includes('already exists')) {
  console.log('Bucket error:', bErr.message)
  process.exit(1)
}
console.log('Bucket: media (public, 10MB limit)')

const { data: buckets } = await supabase.storage.listBuckets()
console.log('Buckets:', buckets.map(b => b.name).join(', '))
