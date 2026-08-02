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

const SQL = `
-- Enable RLS on cms_items and cms_singles
ALTER TABLE public.cms_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_singles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "cms_items_select" ON public.cms_items;
DROP POLICY IF EXISTS "cms_items_anon_submit" ON public.cms_items;
DROP POLICY IF EXISTS "cms_items_auth_insert" ON public.cms_items;
DROP POLICY IF EXISTS "cms_items_auth_update" ON public.cms_items;
DROP POLICY IF EXISTS "cms_items_auth_delete" ON public.cms_items;
DROP POLICY IF EXISTS "cms_singles_select" ON public.cms_singles;
DROP POLICY IF EXISTS "cms_singles_auth_insert" ON public.cms_singles;
DROP POLICY IF EXISTS "cms_singles_auth_update" ON public.cms_singles;

-- cms_items: everyone can read
CREATE POLICY "cms_items_select" ON public.cms_items FOR SELECT USING (true);

-- cms_items: anon can insert submissions
CREATE POLICY "cms_items_anon_submit" ON public.cms_items FOR INSERT
  WITH CHECK (auth.role() = 'anon' AND key IN (
    'applications','jobApplications','eventRegistrations',
    'newsletterSubscribers','messages','feedback','testimonials'
  ));

-- cms_items: authenticated can do everything
CREATE POLICY "cms_items_auth_insert" ON public.cms_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cms_items_auth_update" ON public.cms_items FOR UPDATE
  USING (auth.role() = 'authenticated');
CREATE POLICY "cms_items_auth_delete" ON public.cms_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- cms_singles: everyone can read
CREATE POLICY "cms_singles_select" ON public.cms_singles FOR SELECT USING (true);

-- cms_singles: authenticated can modify
CREATE POLICY "cms_singles_auth_insert" ON public.cms_singles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cms_singles_auth_update" ON public.cms_singles FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Storage policies (role-restricted)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_public_read' AND tablename = 'objects') THEN
    CREATE POLICY "media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_auth_insert' AND tablename = 'objects') THEN
    CREATE POLICY "media_auth_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_auth_update' AND tablename = 'objects') THEN
    CREATE POLICY "media_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_auth_delete' AND tablename = 'objects') THEN
    CREATE POLICY "media_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');
  END IF;
END $$;
`

;(async () => {
  const statements = SQL.split(';').map(s => s.trim()).filter(s => s.length > 0)
  let ok = 0, fail = 0
  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' })
    if (error) {
      console.log('WARN:', error.message, '—', stmt.substring(0, 60) + '...')
      fail++
    } else {
      ok++
    }
  }
  console.log(`Done: ${ok} ok, ${fail} skipped`)
})()
