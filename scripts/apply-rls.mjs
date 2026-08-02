import { readFileSync } from 'node:fs'
import path from 'node:path'

const env = {}
for (const line of readFileSync(path.resolve(import.meta.dirname, '..', '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const URL = env.VITE_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const PROJECT = URL.replace(/^https:\/\//, '').replace(/\.supabase\.co.*$/, '')
const BASE = `https://${PROJECT}.supabase.co`

const sqlPath = path.resolve(import.meta.dirname, '..', 'supabase', 'migration.sql')
const sql = readFileSync(sqlPath, 'utf8')

// Try the Supabase SQL API (different endpoints)
const endpoints = [
  `${BASE}/pg/query`,
  `${BASE}/rest/v1/rpc/exec_sql`,
  `https://api.supabase.com/v1/projects/${PROJECT}/database/query`,
  `https://api.supabase.com/v1/projects/${PROJECT}/sql`,
]

for (const endpoint of endpoints) {
  console.log(`\nTrying: ${endpoint}`)
  try {
    const headers = { 'Content-Type': 'application/json' }
    // For project endpoints use service key, for api.supabase.com try service key too
    const isProjectEndpoint = endpoint.includes(PROJECT)
    if (isProjectEndpoint) {
      headers['apikey'] = SERVICE_KEY
      headers['Authorization'] = `Bearer ${SERVICE_KEY}`
    } else {
      headers['Authorization'] = `Bearer ${SERVICE_KEY}`
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: sql }),
    })
    const text = await res.text()
    console.log(`  Status: ${res.status}`)
    console.log(`  Response: ${text.slice(0, 300)}`)
    if (res.ok) {
      console.log('\n✅ SUCCESS! SQL applied.')
      process.exit(0)
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`)
  }
}

console.log('\n❌ None of the SQL execution endpoints worked.')
console.log('\nTo apply RLS manually:')
console.log('1. Go to https://supabase.com/dashboard/project/ekcwfaqeyqtttfwrvapd/sql/new')
console.log('2. Paste the contents of supabase/migration.sql')
console.log('3. Click "Run"\n')
console.log('Or create a personal access token:')
console.log('1. Go to https://supabase.com/dashboard/account/tokens')
console.log('2. Create a new token, copy it')
console.log('3. Add SUPABASE_ACCESS_TOKEN=<token> to your .env file')
console.log('4. Run: node scripts/supabase-setup.mjs --seed-only')
