-- Highgate School — Supabase schema
-- Apply via: Supabase Dashboard > SQL Editor, or scripts/supabase-setup.mjs
-- Requires the service_role key; RLS keeps the public site read-only and
-- restricts writes (admin = authenticated, public = submissions only).

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

-- Storage: media bucket policies (bucket "media", uploads land under uploads/)
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update" on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete" on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
