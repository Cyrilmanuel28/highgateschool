import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  seedSchoolInfo, seedSettings, seedTheme, seedMenus, seedPages, seedDepartments, seedStaff,
  seedPrograms, seedNews, seedEvents, seedAlbums, seedVideos, seedDownloads, seedFaqs,
  seedAchievements, seedClubs, seedSports, seedHomeSections, seedFees, seedCalendarEvents,
  seedMessages, seedMedia, seedNotices, seedApplications, seedLibrary, seedMagazineArticles,
  seedVacancies, seedJobApplications, seedFeedback, seedTestimonials, seedNewsletterSubscribers,
  seedNewsletterCampaigns, seedCampusLocations, seedTourScenes, seedEmergencyAlerts,
  seedEventRegistrations, seedStats, seedSocialFeeds
} from '../src/data/seed.js'

const env = {}
for (const line of readFileSync(path.resolve(import.meta.dirname, '..', '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const URL = env.VITE_SUPABASE_URL || ''
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || ''
const ACCESS_TOKEN = env.SUPABASE_ACCESS_TOKEN || ''
const ADMIN_EMAIL = env.SUPABASE_ADMIN_EMAIL || ''
const ADMIN_PASSWORD = env.SUPABASE_ADMIN_PASSWORD || ''

if (!URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const PROJECT = URL.replace(/^https:\/\//, '').replace(/\.supabase\.co.*$/, '')
const BASE = `https://${PROJECT}.supabase.co`

const COLLECTIONS = [
  'pages', 'menus', 'staff', 'departments', 'news', 'events', 'albums', 'videos',
  'programs', 'downloads', 'faqs', 'achievements', 'clubs', 'sports', 'homeSections',
  'fees', 'calendarEvents', 'messages', 'media',
  'notices', 'applications', 'library', 'magazineArticles', 'vacancies', 'jobApplications',
  'feedback', 'testimonials', 'newsletterSubscribers', 'newsletterCampaigns',
  'campusLocations', 'tourScenes', 'emergencyAlerts', 'eventRegistrations', 'stats'
]

const SINGLES = {
  schoolInfo: seedSchoolInfo,
  settings: seedSettings,
  theme: seedTheme,
  socialFeeds: seedSocialFeeds
}

const seeders = {
  pages: seedPages, menus: seedMenus, staff: seedStaff, departments: seedDepartments,
  news: seedNews, events: seedEvents, albums: seedAlbums, videos: seedVideos,
  programs: seedPrograms, downloads: seedDownloads, faqs: seedFaqs,
  achievements: seedAchievements, clubs: seedClubs, sports: seedSports,
  homeSections: seedHomeSections, fees: seedFees, calendarEvents: seedCalendarEvents,
  messages: seedMessages, media: seedMedia, notices: seedNotices,
  applications: seedApplications, library: seedLibrary, magazineArticles: seedMagazineArticles,
  vacancies: seedVacancies, jobApplications: seedJobApplications, feedback: seedFeedback,
  testimonials: seedTestimonials, newsletterSubscribers: seedNewsletterSubscribers,
  newsletterCampaigns: seedNewsletterCampaigns, campusLocations: seedCampusLocations,
  tourScenes: seedTourScenes, emergencyAlerts: seedEmergencyAlerts,
  eventRegistrations: seedEventRegistrations, stats: seedStats
}

const MIGRATION = `
create table if not exists public.cms_items (
  key text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  status text,
  slug text,
  title text,
  is_visible boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (key, id)
);
create index if not exists cms_items_key_idx on public.cms_items (key);
create index if not exists cms_items_slug_idx on public.cms_items (slug);

create table if not exists public.cms_singles (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cms_items enable row level security;
alter table public.cms_singles enable row level security;

drop policy if exists "cms_items_select" on public.cms_items;
create policy "cms_items_select" on public.cms_items for select using (true);
drop policy if exists "cms_singles_select" on public.cms_singles;
create policy "cms_singles_select" on public.cms_singles for select using (true);

drop policy if exists "cms_items_anon_submit" on public.cms_items;
create policy "cms_items_anon_submit" on public.cms_items for insert
  with check (auth.role() = 'anon' and key in (
    'messages','applications','jobApplications','eventRegistrations',
    'newsletterSubscribers','feedback','testimonials'
  ));

drop policy if exists "cms_items_auth_insert" on public.cms_items;
create policy "cms_items_auth_insert" on public.cms_items for insert
  with check (auth.role() = 'authenticated');
drop policy if exists "cms_items_auth_update" on public.cms_items;
create policy "cms_items_auth_update" on public.cms_items for update
  using (auth.role() = 'authenticated');
drop policy if exists "cms_items_auth_delete" on public.cms_items;
create policy "cms_items_auth_delete" on public.cms_items for delete
  using (auth.role() = 'authenticated');

drop policy if exists "cms_singles_auth_insert" on public.cms_singles;
create policy "cms_singles_auth_insert" on public.cms_singles for insert
  with check (auth.role() = 'authenticated');
drop policy if exists "cms_singles_auth_update" on public.cms_singles;
create policy "cms_singles_auth_update" on public.cms_singles for update
  using (auth.role() = 'authenticated');

-- Realtime: broadcast cms changes to open tabs/browsers (enables live updates)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cms_items') then
    alter publication supabase_realtime add table public.cms_items;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cms_singles') then
    alter publication supabase_realtime add table public.cms_singles;
  end if;
end $$;
`

function titleOf(r) {
  return (
    r?.title || r?.name || r?.question || r?.level || r?.subject || r?.label ||
    r?.email || r?.id || ''
  )
}

function rowFromRecord(key, record) {
  return {
    key,
    id: record?.id || '',
    data: record,
    status: record?.status ?? null,
    slug: record?.slug ?? null,
    title: titleOf(record),
    is_visible: record?.isVisible === undefined ? null : Boolean(record.isVisible),
    created_at: record?.createdAt || new Date().toISOString(),
    updated_at: record?.updatedAt || new Date().toISOString()
  }
}

async function pgQuery(sql) {
  if (ACCESS_TOKEN) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT}/database/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql })
    })
    if (!res.ok) {
      throw new Error(`Management API ${res.status}: ${await res.text()}`)
    }
    return res.json()
  }
  const res = await fetch(`${BASE}/pg/query?query=${encodeURIComponent(sql)}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  })
  if (!res.ok) {
    throw new Error(
      `pg/query ${res.status}: ${await res.text()}\n\n` +
      'The project-domain pg/query endpoint is unavailable on this project.\n' +
      'Provide a Supabase personal access token as SUPABASE_ACCESS_TOKEN in .env\n' +
      '(App > Account > Access Tokens), or run supabase/migration.sql in the\n' +
      'Dashboard > SQL Editor and re-run this script to seed.'
    )
  }
  return res.json()
}

const reset = process.argv.includes('--reset')
const seedOnly = process.argv.includes('--seed-only')
const supabase = createClient(BASE, SERVICE_KEY, { auth: { autoRefreshToken: false } })

if (process.argv.includes('--sql')) {
  console.log(MIGRATION)
  process.exit(0)
}

console.log(`Targeting project ${PROJECT}${reset ? ' with --reset' : ''}${seedOnly ? ' (seed only)' : ''}`)

if (seedOnly) {
  console.log('Skipping DDL (apply supabase/migration.sql manually via the SQL Editor)')
} else {
  console.log('Running migration (DDL + RLS)...')
  await pgQuery(MIGRATION)
  console.log('Migration OK')
}

if (reset) {
  for (const key of COLLECTIONS) {
    const { error } = await supabase.from('cms_items').delete().eq('key', key)
    if (error) console.error(`  reset ${key}:`, error.message)
  }
  const { error: sErr } = await supabase.from('cms_singles').delete().gte('updated_at', '1970-01-01T00:00:00Z')
  if (sErr) console.error('  reset singles:', sErr.message)
}

let total = 0
for (const key of COLLECTIONS) {
  const records = seeders[key]() || []
  if (!records.length) continue
  const rows = records.map((r) => rowFromRecord(key, r))
  const { error } = await supabase.from('cms_items').upsert(rows, { onConflict: 'key,id' })
  if (error) {
    console.error(`  seed ${key} FAILED:`, error.message)
    process.exit(1)
  }
  total += rows.length
  console.log(`  seeded ${key}: ${rows.length} rows`)
}

for (const [key, value] of Object.entries(SINGLES)) {
  const { error } = await supabase.from('cms_singles').upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )
  if (error) {
    console.error(`  seed single ${key} FAILED:`, error.message)
    process.exit(1)
  }
  console.log(`  seeded single ${key}`)
}

const { data: adminUsers, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 50 })
if (listErr) console.error('  list users:', listErr.message)
const existing = (adminUsers?.users || []).find((u) => u.email === ADMIN_EMAIL)
if (existing) {
  console.log(`Admin user already exists: ${ADMIN_EMAIL} (${existing.id})`)
} else {
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true
  })
  if (createErr) {
    console.error('  create admin user FAILED:', createErr.message)
  } else {
    console.log(`Admin user created: ${created.user.email} (${created.user.id})`)
  }
}

const { data: pagesData, error: pageErr } = await supabase.from('cms_items').select('id').eq('key', 'pages')
const { data: singleData, error: singleErr } = await supabase.from('cms_singles').select('key')
if (pageErr) console.error('  verify count:', pageErr.message)
else console.log(`Verify: cms_items pages=${pagesData?.length || 0}, cms_singles=${singleData?.length || 0}${singleErr ? ' (' + singleErr.message + ')' : ''}`)

console.log(`\nSetup complete. Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
