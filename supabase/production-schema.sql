-- ============================================================================
-- Aurelia International Academy — Production PostgreSQL Schema
-- Compatible with Supabase (PostgreSQL 16+)
-- Generated: 2026-08-02
-- ============================================================================
-- Execution order: Run in Supabase SQL Editor as service_role
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "pg_trgm" with schema extensions;

-- ============================================================================
-- 2. HELPER FUNCTIONS
-- ============================================================================

-- Auto-update updated_at column
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Get current user ID safely
create or replace function public.uid()
returns uuid as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$ language sql stable;

-- Get current user role
create or replace function public.user_role()
returns text as $$
  select coalesce(current_setting('request.jwt.claims', true)::json->>'role', 'anon');
$$ language sql stable;

-- ============================================================================
-- 3. ENUMS
-- ============================================================================
do $$ begin
  create type public.content_status as enum (
    'draft','pending','scheduled','published','unpublished','archived'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.entity_type as enum (
    'page','news','event','gallery_album','gallery_media',
    'staff','programme','download','faq','notice',
    'vacancy','testimonial','feedback','message',
    'application','job_application','newsletter_subscriber',
    'magazine_edition','magazine_article','campus_building',
    'tour_location','calendar_event','emergency_alert',
    'media','video','department','fee_structure',
    'home_section','menu','page_section'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.priority_level as enum ('low','normal','high','urgent');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_type as enum ('image','video','document','audio','other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.chart_type as enum ('line','bar','pie','doughnut','area','scatter');
exception when duplicate_object then null;
end $$;

-- ============================================================================
-- 4. CORE TABLES — Users & Authentication
-- ============================================================================

create table if not exists public.users (
  id uuid primary key default extensions.gen_random_uuid(),
  email text unique not null,
  username text unique not null,
  display_name text,
  avatar_url text,
  password_hash text not null,
  is_active boolean not null default true,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  last_login_at timestamptz,
  login_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.users is 'System users for CMS and admin access';

create table if not exists public.roles (
  id uuid primary key default extensions.gen_random_uuid(),
  name text unique not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.roles is 'User roles for RBAC';

create table if not exists public.permissions (
  id uuid primary key default extensions.gen_random_uuid(),
  name text unique not null,
  description text,
  module text not null,
  created_at timestamptz not null default now()
);
comment on table public.permissions is 'Granular permissions for RBAC';

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists public.user_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text unique not null,
  ip_address inet,
  user_agent text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Check if user is admin (depends on user_roles, roles)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = public.uid() and r.name = 'admin'
  );
$$ language sql stable;

-- Check if user has a specific permission (depends on user_roles, role_permissions, permissions)
create or replace function public.has_permission(perm_name text)
returns boolean as $$
  select exists (
    select 1 from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = public.uid() and p.name = perm_name
  );
$$ language sql stable;

-- ============================================================================
-- 5. SCHOOL PROFILE
-- ============================================================================

create table if not exists public.school_info (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null default 'Aurelia International Academy',
  short_name text,
  tagline text,
  founded integer,
  address text,
  city text,
  state text,
  country text default 'United Kingdom',
  postal_code text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  phone text,
  email text,
  website text,
  logo_url text,
  favicon_url text,
  motto text,
  description text,
  footer_text text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  linkedin_url text,
  youtube_url text,
  tiktok_url text,
  whatsapp_number text,
  analytics_id text,
  smtp_host text,
  smtp_port integer,
  smtp_user text,
  smtp_pass text,
  smtp_from_email text,
  smtp_from_name text,
  maintenance_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.school_info is 'Single row — school profile and global settings';

-- ============================================================================
-- 6. PAGES & CONTENT
-- ============================================================================

create table if not exists public.pages (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  meta_title text,
  meta_description text,
  og_image text,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.pages is 'Dynamic CMS pages (about, history, etc.)';

create table if not exists public.page_sections (
  id uuid primary key default extensions.gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.page_sections is 'Content blocks within a page';

create table if not exists public.page_versions (
  id uuid primary key default extensions.gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  action text not null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 7. HOME SECTIONS
-- ============================================================================

create table if not exists public.home_sections (
  id text primary key,
  section_key text not null,
  type text not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.home_sections is 'Configurable home page sections';

-- ============================================================================
-- 8. NAVIGATION MENUS
-- ============================================================================

create table if not exists public.menus (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default extensions.gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  parent_id uuid references public.menu_items(id) on delete cascade,
  label text not null,
  url text,
  page_id uuid references public.pages(id) on delete set null,
  target text default '_self',
  "order" integer not null default 0,
  is_visible boolean not null default true,
  css_class text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 9. NEWS & ARTICLES
-- ============================================================================

create table if not exists public.news_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  featured_image text,
  category_id uuid references public.news_categories(id) on delete set null,
  author_id uuid references public.users(id) on delete set null,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  publish_at timestamptz,
  published_at timestamptz,
  view_count integer not null default 0,
  meta_title text,
  meta_description text,
  og_image text,
  tags text[],
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.news is 'News articles and blog posts';

-- ============================================================================
-- 10. EVENTS
-- ============================================================================

create table if not exists public.event_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  color text default '#1B3A5C',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  short_description text,
  featured_image text,
  category_id uuid references public.event_categories(id) on delete set null,
  start_date timestamptz not null,
  end_date timestamptz,
  all_day boolean not null default false,
  location text,
  venue text,
  capacity integer,
  is_registration_required boolean not null default false,
  registration_deadline timestamptz,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  meta_title text,
  meta_description text,
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 11. GALLERY
-- ============================================================================

create table if not exists public.gallery_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_albums (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cover_image text,
  category_id uuid references public.gallery_categories(id) on delete set null,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  published_at timestamptz,
  "order" integer not null default 0,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_media (
  id uuid primary key default extensions.gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  media_url text not null,
  thumbnail_url text,
  caption text,
  alt_text text,
  media_type public.media_type not null default 'image',
  file_size bigint,
  width integer,
  height integer,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 12. STAFF DIRECTORY
-- ============================================================================

create table if not exists public.departments (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  head_id uuid,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  first_name text not null,
  last_name text not null,
  display_name text,
  position text,
  department_id uuid references public.departments(id) on delete set null,
  email text,
  phone text,
  bio text,
  qualifications text[],
  photo_url text,
  social_links jsonb default '{}'::jsonb,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.staff is 'Staff directory entries';

-- Add FK for department head after staff table exists
alter table public.departments
  add constraint fk_department_head
  foreign key (head_id) references public.staff(id) on delete set null;

-- ============================================================================
-- 13. ACADEMIC PROGRAMMES
-- ============================================================================

create table if not exists public.programmes (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text,
  description text,
  featured_image text,
  duration text,
  age_range text,
  key_stages text[],
  subjects text[],
  assessment text,
  features text[],
  department_id uuid references public.departments(id) on delete set null,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  "order" integer not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 14. FEES
-- ============================================================================

create table if not exists public.fee_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_structures (
  id uuid primary key default extensions.gen_random_uuid(),
  category_id uuid not null references public.fee_categories(id) on delete cascade,
  name text not null,
  description text,
  amount numeric(10,2) not null,
  currency text not null default 'GBP',
  frequency text not null default 'annual',
  year integer not null default extract(year from now()),
  grade_level text,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 15. DOWNLOADS
-- ============================================================================

create table if not exists public.download_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_name text,
  file_size bigint,
  file_type text,
  category_id uuid references public.download_categories(id) on delete set null,
  download_count integer not null default 0,
  is_visible boolean not null default true,
  status public.content_status not null default 'published',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 16. FAQs
-- ============================================================================

create table if not exists public.faq_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default extensions.gen_random_uuid(),
  question text not null,
  answer text not null,
  category_id uuid references public.faq_categories(id) on delete set null,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 17. CONTACT SYSTEM
-- ============================================================================

create table if not exists public.contact_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  category text default 'general',
  status text not null default 'new',
  is_read boolean not null default false,
  read_at timestamptz,
  replied_at timestamptz,
  ip_address inet,
  created_at timestamptz not null default now()
);
comment on table public.contact_messages is 'Public contact form submissions';

create table if not exists public.office_locations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  department text,
  building text,
  floor text,
  room text,
  phone text,
  email text,
  hours text,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 18. NOTICES
-- ============================================================================

create table if not exists public.notices (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  content text not null,
  priority public.priority_level not null default 'normal',
  category text,
  is_pinned boolean not null default false,
  expires_at timestamptz,
  status public.content_status not null default 'published',
  is_visible boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 19. CALENDAR EVENTS
-- ============================================================================

create table if not exists public.calendar_events (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  end_date date,
  event_type text not null default 'school',
  color text default '#1B3A5C',
  is_recurring boolean not null default false,
  recurrence_rule text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 20. VIRTUAL TOUR
-- ============================================================================

create table if not exists public.tour_locations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  video_url text,
  panorama_url text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 21. CAMPUS MAP
-- ============================================================================

create table if not exists public.campus_buildings (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text,
  category text,
  image_url text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  floor_count integer,
  facilities text[],
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 22. STATISTICS
-- ============================================================================

create table if not exists public.stats (
  id uuid primary key default extensions.gen_random_uuid(),
  label text not null,
  value text not null,
  suffix text,
  icon text,
  description text,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stat_history (
  id uuid primary key default extensions.gen_random_uuid(),
  stat_label text not null,
  stat_value numeric,
  recorded_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 23. DIGITAL LIBRARY
-- ============================================================================

create table if not exists public.library_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.library_items (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  author text,
  description text,
  cover_image text,
  file_url text,
  category_id uuid references public.library_categories(id) on delete set null,
  item_type text not null default 'book',
  isbn text,
  publisher text,
  publish_year integer,
  pages integer,
  language text default 'English',
  is_available boolean not null default true,
  download_count integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 24. SCHOOL MAGAZINE
-- ============================================================================

create table if not exists public.magazine_editions (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  slug text unique not null,
  volume text,
  issue text,
  cover_image text,
  pdf_url text,
  publish_date date,
  description text,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.magazine_articles (
  id uuid primary key default extensions.gen_random_uuid(),
  edition_id uuid not null references public.magazine_editions(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  body text,
  featured_image text,
  author_name text,
  author_id uuid references public.users(id) on delete set null,
  category text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (edition_id, slug)
);

-- ============================================================================
-- 25. CAREERS
-- ============================================================================

create table if not exists public.vacancies (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  slug text unique not null,
  department text,
  location text,
  type text not null default 'full_time',
  salary_range text,
  description text,
  requirements text[],
  benefits text[],
  closing_date date,
  status public.content_status not null default 'published',
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default extensions.gen_random_uuid(),
  vacancy_id uuid not null references public.vacancies(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  cover_letter text,
  cv_url text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 26. ADMISSIONS
-- ============================================================================

create table if not exists public.admission_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text,
  age_range text,
  grade_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default extensions.gen_random_uuid(),
  category_id uuid references public.admission_categories(id) on delete set null,
  student_first_name text not null,
  student_last_name text not null,
  student_dob date,
  student_gender text,
  parent_name text not null,
  parent_email text not null,
  parent_phone text,
  current_school text,
  grade_applying_for text,
  previous_grades jsonb,
  documents jsonb default '[]'::jsonb,
  medical_info text,
  special_needs text,
  how_heard text,
  status text not null default 'pending',
  notes text,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  decision text,
  decision_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.applications is 'Student admission applications';

-- ============================================================================
-- 27. PARENT FEEDBACK
-- ============================================================================

create table if not exists public.feedback_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default extensions.gen_random_uuid(),
  category_id uuid references public.feedback_categories(id) on delete set null,
  parent_name text,
  parent_email text,
  student_name text,
  student_grade text,
  subject text not null,
  message text not null,
  rating integer check (rating >= 1 and rating <= 5),
  status text not null default 'new',
  response text,
  responded_by uuid references public.users(id) on delete set null,
  responded_at timestamptz,
  is_anonymous boolean not null default false,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 28. TESTIMONIALS
-- ============================================================================

create table if not exists public.testimonials (
  id uuid primary key default extensions.gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_image text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5),
  relationship text,
  status public.content_status not null default 'pending',
  is_visible boolean not null default false,
  featured boolean not null default false,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 29. SCHOOL TV / VIDEOS
-- ============================================================================

create table if not exists public.video_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text unique not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  thumbnail_url text,
  video_url text not null,
  video_type text not null default 'youtube',
  duration integer,
  category_id uuid references public.video_categories(id) on delete set null,
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  view_count integer not null default 0,
  "order" integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 30. EMERGENCY ALERTS
-- ============================================================================

create table if not exists public.emergency_alerts (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  message text not null,
  severity public.priority_level not null default 'high',
  category text,
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 31. NEWSLETTER
-- ============================================================================

create table if not exists public.newsletter_subscribers (
  id uuid primary key default extensions.gen_random_uuid(),
  email text unique not null,
  name text,
  is_active boolean not null default true,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  tags text[],
  created_at timestamptz not null default now()
);
comment on table public.newsletter_subscribers is 'Public newsletter subscriptions';

create table if not exists public.newsletter_campaigns (
  id uuid primary key default extensions.gen_random_uuid(),
  subject text not null,
  html_body text,
  plain_body text,
  status text not null default 'draft',
  sent_at timestamptz,
  recipient_count integer default 0,
  open_count integer default 0,
  click_count integer default 0,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 32. MEDIA LIBRARY
-- ============================================================================

create table if not exists public.media_folders (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  parent_id uuid references public.media_folders(id) on delete cascade,
  path text not null default '/',
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size bigint,
  media_type public.media_type not null default 'image',
  width integer,
  height integer,
  alt_text text,
  caption text,
  folder_id uuid references public.media_folders(id) on delete set null,
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.media is 'Central media library for all uploads';

-- ============================================================================
-- 33. SEO
-- ============================================================================

create table if not exists public.seo_settings (
  id uuid primary key default extensions.gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  og_type text default 'website',
  twitter_card text default 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  structured_data jsonb,
  no_index boolean not null default false,
  no_follow boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id)
);
comment on table public.seo_settings is 'SEO metadata for all entities';

-- ============================================================================
-- 34. THEME SETTINGS
-- ============================================================================

create table if not exists public.theme_settings (
  id uuid primary key default extensions.gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.theme_settings is 'Site theme, colors, fonts, layout settings';

-- ============================================================================
-- 35. SEARCH INDEX
-- ============================================================================

create table if not exists public.search_index (
  id uuid primary key default extensions.gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  title text not null,
  excerpt text,
  content text,
  url text,
  image text,
  tags text[],
  ts_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id)
);
comment on table public.search_index is 'Full-text search index for site-wide search';

-- ============================================================================
-- 36. AUDIT LOGS
-- ============================================================================

create table if not exists public.audit_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  user_email text,
  action text not null,
  entity_type text,
  entity_id text,
  entity_title text,
  old_value jsonb,
  new_value jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
comment on table public.audit_logs is 'Tracks all CMS changes for compliance';

-- ============================================================================
-- 37. ACTIVITY LOGS
-- ============================================================================

create table if not exists public.activity_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  description text,
  ip_address inet,
  metadata jsonb,
  created_at timestamptz not null default now()
);
comment on table public.activity_logs is 'User activity tracking (login, logout, etc.)';

-- ============================================================================
-- 38. NOTIFICATIONS
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  message text,
  type text not null default 'info',
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  read_at timestamptz,
  action_url text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 39. SCHEDULED PUBLISHING
-- ============================================================================

create table if not exists public.scheduled_publishes (
  id uuid primary key default extensions.gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  publish_at timestamptz not null,
  status text not null default 'pending',
  executed_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 40. INDEXES
-- ============================================================================

-- Users
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_username on public.users(username);
create index if not exists idx_users_is_active on public.users(is_active) where is_active = true;

-- Pages
create index if not exists idx_pages_slug on public.pages(slug);
create index if not exists idx_pages_status on public.pages(status);
create index if not exists idx_pages_is_visible on public.pages(is_visible) where is_visible = true;
create index if not exists idx_page_sections_page_id on public.page_sections(page_id);
create index if not exists idx_page_sections_order on public.page_sections(page_id, "order");

-- News
create index if not exists idx_news_slug on public.news(slug);
create index if not exists idx_news_status on public.news(status);
create index if not exists idx_news_category on public.news(category_id);
create index if not exists idx_news_published_at on public.news(published_at desc nulls last);
create index if not exists idx_news_tags on public.news using gin(tags);

-- Events
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_start_date on public.events(start_date);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_category on public.events(category_id);

-- Gallery
create index if not exists idx_gallery_albums_slug on public.gallery_albums(slug);
create index if not exists idx_gallery_albums_status on public.gallery_albums(status);
create index if not exists idx_gallery_media_album on public.gallery_media(album_id);

-- Staff
create index if not exists idx_staff_slug on public.staff(slug);
create index if not exists idx_staff_department on public.staff(department_id);
create index if not exists idx_staff_is_visible on public.staff(is_visible) where is_visible = true;

-- Programmes
create index if not exists idx_programmes_slug on public.programmes(slug);
create index if not exists idx_programmes_status on public.programmes(status);

-- Downloads
create index if not exists idx_downloads_category on public.downloads(category_id);
create index if not exists idx_downloads_status on public.downloads(status);

-- FAQs
create index if not exists idx_faqs_category on public.faqs(category_id);

-- Contact
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_contact_messages_created on public.contact_messages(created_at desc);

-- Notices
create index if not exists idx_notices_priority on public.notices(priority);
create index if not exists idx_notices_expires on public.notices(expires_at) where expires_at is not null;

-- Calendar
create index if not exists idx_calendar_date on public.calendar_events(event_date);
create index if not exists idx_calendar_type on public.calendar_events(event_type);

-- Applications
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_created on public.applications(created_at desc);

-- Jobs
create index if not exists idx_vacancies_status on public.vacancies(status);
create index if not exists idx_job_applications_vacancy on public.job_applications(vacancy_id);

-- Feedback
create index if not exists idx_feedback_status on public.feedback(status);

-- Testimonials
create index if not exists idx_testimonials_status on public.testimonials(status);
create index if not exists idx_testimonials_featured on public.testimonials(featured) where featured = true;

-- Videos
create index if not exists idx_videos_category on public.videos(category_id);
create index if not exists idx_videos_status on public.videos(status);

-- Emergency
create index if not exists idx_emergency_active on public.emergency_alerts(is_active) where is_active = true;
create index if not exists idx_emergency_expires on public.emergency_alerts(expires_at);

-- Newsletter
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);
create index if not exists idx_newsletter_active on public.newsletter_subscribers(is_active) where is_active = true;

-- Media
create index if not exists idx_media_folder on public.media(folder_id);
create index if not exists idx_media_type on public.media(media_type);

-- Search
create index if not exists idx_search_ts_vector on public.search_index using gin(ts_vector);
create index if not exists idx_search_entity on public.search_index(entity_type, entity_id);

-- Audit
create index if not exists idx_audit_user on public.audit_logs(user_id);
create index if not exists idx_audit_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- Activity
create index if not exists idx_activity_user on public.activity_logs(user_id);
create index if not exists idx_activity_created on public.activity_logs(created_at desc);

-- Notifications
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id) where is_read = false;

-- Scheduled
create index if not exists idx_scheduled_pending on public.scheduled_publishes(publish_at) where status = 'pending';

-- ============================================================================
-- 41. TRIGGERS
-- ============================================================================

-- Auto-update updated_at on all tables
create trigger set_updated_at before update on public.users for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.roles for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.school_info for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.pages for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.page_sections for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.home_sections for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.menus for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.menu_items for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.news_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.news for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.event_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.events for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.gallery_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.gallery_albums for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.departments for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.staff for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.programmes for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.fee_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.fee_structures for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.download_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.downloads for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.faq_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.faqs for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.notices for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.calendar_events for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.tour_locations for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.campus_buildings for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.stats for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.library_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.library_items for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.magazine_editions for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.magazine_articles for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.vacancies for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.job_applications for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.applications for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.feedback for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.testimonials for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.video_categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.videos for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.emergency_alerts for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.newsletter_campaigns for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.media for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.seo_settings for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.theme_settings for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.search_index for each row execute function public.update_updated_at();

-- Auto-update search_index ts_vector
create or replace function public.update_search_vector()
returns trigger as $$
begin
  new.ts_vector := to_tsvector('english',
    coalesce(new.title, '') || ' ' ||
    coalesce(new.excerpt, '') || ' ' ||
    coalesce(new.content, '') || ' ' ||
    coalesce(array_to_string(new.tags, ' '), '')
  );
  return new;
end;
$$ language plpgsql;

create trigger update_search_vector before insert or update on public.search_index
  for each row execute function public.update_search_vector();

-- Auto-update page version number
create or replace function public.set_page_version_number()
returns trigger as $$
begin
  if new.version_number is null then
    select coalesce(max(version_number), 0) + 1
    into new.version_number
    from public.page_versions
    where page_id = new.page_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_page_version before insert on public.page_versions
  for each row execute function public.set_page_version_number();

-- ============================================================================
-- 42. VIEWS
-- ============================================================================

-- Published pages view
create or replace view public.published_pages as
select * from public.pages
where status = 'published' and is_visible = true;

-- Published news view
create or replace view public.published_news as
select
  n.*,
  nc.name as category_name,
  nc.slug as category_slug,
  u.display_name as author_name
from public.news n
left join public.news_categories nc on nc.id = n.category_id
left join public.users u on u.id = n.author_id
where n.status = 'published' and n.is_visible = true;

-- Upcoming events view
create or replace view public.upcoming_events as
select
  e.*,
  ec.name as category_name,
  ec.color as category_color
from public.events e
left join public.event_categories ec on ec.id = e.category_id
where e.status = 'published'
  and e.is_visible = true
  and e.start_date >= now() - interval '1 day'
order by e.start_date asc;

-- Active emergency alerts view
create or replace view public.active_alerts as
select * from public.emergency_alerts
where is_active = true
  and starts_at <= now()
  and (expires_at is null or expires_at > now());

-- Staff with department info
create or replace view public.staff_directory as
select
  s.*,
  d.name as department_name,
  d.slug as department_slug
from public.staff s
left join public.departments d on d.id = s.department_id
where s.is_visible = true and s.status = 'published'
order by s."order", s.last_name;

-- Gallery albums with media count
create or replace view public.gallery_overview as
select
  ga.*,
  gc.name as category_name,
  (select count(*) from public.gallery_media gm where gm.album_id = ga.id) as media_count
from public.gallery_albums ga
left join public.gallery_categories gc on gc.id = ga.category_id
where ga.status = 'published' and ga.is_visible = true;

-- Dashboard stats view
create or replace view public.dashboard_stats as
select
  (select count(*) from public.pages where status = 'published') as pages_count,
  (select count(*) from public.news where status = 'published') as news_count,
  (select count(*) from public.events where start_date >= now()) as upcoming_events,
  (select count(*) from public.staff where is_visible = true) as staff_count,
  (select count(*) from public.gallery_albums where status = 'published') as albums_count,
  (select count(*) from public.applications where status = 'pending') as pending_applications,
  (select count(*) from public.contact_messages where status = 'new') as unread_messages,
  (select count(*) from public.newsletter_subscribers where is_active = true) as subscribers,
  (select count(*) from public.downloads) as downloads_count,
  (select count(*) from public.faqs) as faqs_count;

-- ============================================================================
-- 43. MATERIALIZED VIEWS
-- ============================================================================

-- Full-text search results (refresh periodically)
create materialized view if not exists public.search_results as
select
  si.id,
  si.entity_type,
  si.entity_id,
  si.title,
  si.excerpt,
  si.url,
  si.image,
  si.tags,
  ts_rank(si.ts_vector, plainto_tsquery('english', '')) as rank
from public.search_index si;

create unique index if not exists idx_search_results_id on public.search_results(id);

-- ============================================================================
-- 44. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all application tables
alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.user_sessions enable row level security;
alter table public.school_info enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.page_versions enable row level security;
alter table public.home_sections enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.news_categories enable row level security;
alter table public.news enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_media enable row level security;
alter table public.departments enable row level security;
alter table public.staff enable row level security;
alter table public.programmes enable row level security;
alter table public.fee_categories enable row level security;
alter table public.fee_structures enable row level security;
alter table public.download_categories enable row level security;
alter table public.downloads enable row level security;
alter table public.faq_categories enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.office_locations enable row level security;
alter table public.notices enable row level security;
alter table public.calendar_events enable row level security;
alter table public.tour_locations enable row level security;
alter table public.campus_buildings enable row level security;
alter table public.stats enable row level security;
alter table public.stat_history enable row level security;
alter table public.library_categories enable row level security;
alter table public.library_items enable row level security;
alter table public.magazine_editions enable row level security;
alter table public.magazine_articles enable row level security;
alter table public.vacancies enable row level security;
alter table public.job_applications enable row level security;
alter table public.admission_categories enable row level security;
alter table public.applications enable row level security;
alter table public.feedback_categories enable row level security;
alter table public.feedback enable row level security;
alter table public.testimonials enable row level security;
alter table public.video_categories enable row level security;
alter table public.videos enable row level security;
alter table public.emergency_alerts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.media_folders enable row level security;
alter table public.media enable row level security;
alter table public.seo_settings enable row level security;
alter table public.theme_settings enable row level security;
alter table public.search_index enable row level security;
alter table public.audit_logs enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.scheduled_publishes enable row level security;

-- ---------------------------------------------------------------------------
-- Public read policies (anon can read published/public content)
-- ---------------------------------------------------------------------------

-- School info: public read
create policy "school_info_select" on public.school_info for select using (true);

-- Pages: public reads published
create policy "pages_select_public" on public.pages for select
  using (status = 'published' and is_visible = true);
create policy "pages_select_auth" on public.pages for select
  using (auth.role() = 'authenticated');

-- Page sections: public reads visible
create policy "page_sections_select" on public.page_sections for select
  using (is_visible = true);
create policy "page_sections_select_auth" on public.page_sections for select
  using (auth.role() = 'authenticated');

-- Home sections: public read
create policy "home_sections_select" on public.home_sections for select using (true);
create policy "home_sections_all_auth" on public.home_sections for all
  using (auth.role() = 'authenticated');

-- Menus: public read
create policy "menus_select" on public.menus for select using (is_active = true);
create policy "menu_items_select" on public.menu_items for select using (is_visible = true);
create policy "menus_all_auth" on public.menus for all using (auth.role() = 'authenticated');
create policy "menu_items_all_auth" on public.menu_items for all using (auth.role() = 'authenticated');

-- News categories: public read
create policy "news_cat_select" on public.news_categories for select using (true);
create policy "news_cat_auth" on public.news_categories for all using (auth.role() = 'authenticated');

-- News: public reads published
create policy "news_select_public" on public.news for select
  using (status = 'published' and is_visible = true);
create policy "news_select_auth" on public.news for select
  using (auth.role() = 'authenticated');
create policy "news_all_auth" on public.news for all
  using (auth.role() = 'authenticated');

-- Event categories: public read
create policy "event_cat_select" on public.event_categories for select using (true);
create policy "event_cat_auth" on public.event_categories for all using (auth.role() = 'authenticated');

-- Events: public reads published
create policy "events_select_public" on public.events for select
  using (status = 'published' and is_visible = true);
create policy "events_select_auth" on public.events for select
  using (auth.role() = 'authenticated');
create policy "events_all_auth" on public.events for all
  using (auth.role() = 'authenticated');

-- Event registrations: anon can insert (public form)
create policy "event_reg_insert" on public.event_registrations for insert
  with check (auth.role() = 'anon');
create policy "event_reg_auth" on public.event_registrations for all
  using (auth.role() = 'authenticated');

-- Gallery categories: public read
create policy "gallery_cat_select" on public.gallery_categories for select using (true);
create policy "gallery_cat_auth" on public.gallery_categories for all using (auth.role() = 'authenticated');

-- Gallery albums: public reads published
create policy "gallery_albums_select_public" on public.gallery_albums for select
  using (status = 'published' and is_visible = true);
create policy "gallery_albums_select_auth" on public.gallery_albums for select
  using (auth.role() = 'authenticated');
create policy "gallery_albums_all_auth" on public.gallery_albums for all
  using (auth.role() = 'authenticated');

-- Gallery media: public read
create policy "gallery_media_select" on public.gallery_media for select using (true);
create policy "gallery_media_auth" on public.gallery_media for all
  using (auth.role() = 'authenticated');

-- Departments: public read
create policy "departments_select" on public.departments for select using (true);
create policy "departments_auth" on public.departments for all
  using (auth.role() = 'authenticated');

-- Staff: public reads visible
create policy "staff_select_public" on public.staff for select
  using (is_visible = true and status = 'published');
create policy "staff_select_auth" on public.staff for select
  using (auth.role() = 'authenticated');
create policy "staff_all_auth" on public.staff for all
  using (auth.role() = 'authenticated');

-- Programmes: public reads published
create policy "programmes_select_public" on public.programmes for select
  using (status = 'published' and is_visible = true);
create policy "programmes_select_auth" on public.programmes for select
  using (auth.role() = 'authenticated');
create policy "programmes_all_auth" on public.programmes for all
  using (auth.role() = 'authenticated');

-- Fee categories & structures: public read
create policy "fee_cat_select" on public.fee_categories for select using (true);
create policy "fee_struct_select" on public.fee_structures for select using (true);
create policy "fee_cat_auth" on public.fee_categories for all using (auth.role() = 'authenticated');
create policy "fee_struct_auth" on public.fee_structures for all using (auth.role() = 'authenticated');

-- Download categories: public read
create policy "dl_cat_select" on public.download_categories for select using (true);
create policy "dl_cat_auth" on public.download_categories for all using (auth.role() = 'authenticated');

-- Downloads: public reads visible
create policy "downloads_select_public" on public.downloads for select
  using (is_visible = true and status = 'published');
create policy "downloads_select_auth" on public.downloads for select
  using (auth.role() = 'authenticated');
create policy "downloads_all_auth" on public.downloads for all
  using (auth.role() = 'authenticated');

-- FAQ categories: public read
create policy "faq_cat_select" on public.faq_categories for select using (true);
create policy "faq_cat_auth" on public.faq_categories for all using (auth.role() = 'authenticated');

-- FAQs: public read
create policy "faqs_select" on public.faqs for select using (is_visible = true);
create policy "faqs_auth" on public.faqs for all using (auth.role() = 'authenticated');

-- Contact messages: anon can insert (public form)
create policy "contact_insert" on public.contact_messages for insert
  with check (auth.role() = 'anon');
create policy "contact_auth" on public.contact_messages for all
  using (auth.role() = 'authenticated');

-- Office locations: public read
create policy "office_select" on public.office_locations for select using (true);
create policy "office_auth" on public.office_locations for all using (auth.role() = 'authenticated');

-- Notices: public reads published
create policy "notices_select_public" on public.notices for select
  using (status = 'published' and is_visible = true
    and (expires_at is null or expires_at > now()));
create policy "notices_select_auth" on public.notices for select
  using (auth.role() = 'authenticated');
create policy "notices_all_auth" on public.notices for all
  using (auth.role() = 'authenticated');

-- Calendar events: public read
create policy "calendar_select" on public.calendar_events for select using (is_visible = true);
create policy "calendar_auth" on public.calendar_events for all using (auth.role() = 'authenticated');

-- Tour locations: public read
create policy "tour_select" on public.tour_locations for select using (is_visible = true);
create policy "tour_auth" on public.tour_locations for all using (auth.role() = 'authenticated');

-- Campus buildings: public read
create policy "campus_select" on public.campus_buildings for select using (is_visible = true);
create policy "campus_auth" on public.campus_buildings for all using (auth.role() = 'authenticated');

-- Stats: public read
create policy "stats_select" on public.stats for select using (is_visible = true);
create policy "stats_auth" on public.stats for all using (auth.role() = 'authenticated');

-- Stat history: auth only
create policy "stat_history_auth" on public.stat_history for all using (auth.role() = 'authenticated');

-- Library categories: public read
create policy "lib_cat_select" on public.library_categories for select using (true);
create policy "lib_cat_auth" on public.library_categories for all using (auth.role() = 'authenticated');

-- Library items: public reads published
create policy "lib_items_select" on public.library_items for select
  using (status = 'published');
create policy "lib_items_auth" on public.library_items for all
  using (auth.role() = 'authenticated');

-- Magazine editions: public reads published
create policy "mag_ed_select" on public.magazine_editions for select
  using (status = 'published' and is_visible = true);
create policy "mag_ed_auth" on public.magazine_editions for all
  using (auth.role() = 'authenticated');

-- Magazine articles: public read
create policy "mag_art_select" on public.magazine_articles for select using (true);
create policy "mag_art_auth" on public.magazine_articles for all
  using (auth.role() = 'authenticated');

-- Vacancies: public reads published
create policy "vacancies_select" on public.vacancies for select
  using (status = 'published' and is_visible = true);
create policy "vacancies_auth" on public.vacancies for all
  using (auth.role() = 'authenticated');

-- Job applications: anon can insert (public form)
create policy "job_app_insert" on public.job_applications for insert
  with check (auth.role() = 'anon');
create policy "job_app_auth" on public.job_applications for all
  using (auth.role() = 'authenticated');

-- Admission categories: public read
create policy "adm_cat_select" on public.admission_categories for select using (true);
create policy "adm_cat_auth" on public.admission_categories for all using (auth.role() = 'authenticated');

-- Applications: anon can insert (public form)
create policy "app_insert" on public.applications for insert
  with check (auth.role() = 'anon');
create policy "app_auth" on public.applications for all
  using (auth.role() = 'authenticated');

-- Feedback categories: public read
create policy "fb_cat_select" on public.feedback_categories for select using (true);
create policy "fb_cat_auth" on public.feedback_categories for all using (auth.role() = 'authenticated');

-- Feedback: anon can insert
create policy "fb_insert" on public.feedback for insert
  with check (auth.role() = 'anon');
create policy "fb_select_public" on public.feedback for select
  using (is_visible = true);
create policy "fb_auth" on public.feedback for all
  using (auth.role() = 'authenticated');

-- Testimonials: public reads visible
create policy "testimonials_select" on public.testimonials for select
  using (is_visible = true and status = 'published');
create policy "testimonials_auth" on public.testimonials for all
  using (auth.role() = 'authenticated');

-- Video categories: public read
create policy "vid_cat_select" on public.video_categories for select using (true);
create policy "vid_cat_auth" on public.video_categories for all using (auth.role() = 'authenticated');

-- Videos: public reads published
create policy "videos_select_public" on public.videos for select
  using (status = 'published' and is_visible = true);
create policy "videos_select_auth" on public.videos for select
  using (auth.role() = 'authenticated');
create policy "videos_all_auth" on public.videos for all
  using (auth.role() = 'authenticated');

-- Emergency alerts: public reads active
create policy "emergency_select" on public.emergency_alerts for select
  using (is_active = true and starts_at <= now()
    and (expires_at is null or expires_at > now()));
create policy "emergency_auth" on public.emergency_alerts for all
  using (auth.role() = 'authenticated');

-- Newsletter subscribers: anon can insert (subscribe form)
create policy "newsletter_insert" on public.newsletter_subscribers for insert
  with check (auth.role() = 'anon');
create policy "newsletter_auth" on public.newsletter_subscribers for all
  using (auth.role() = 'authenticated');

-- Newsletter campaigns: auth only
create policy "newsletter_camp_auth" on public.newsletter_campaigns for all
  using (auth.role() = 'authenticated');

-- Media folders: auth only
create policy "media_folders_auth" on public.media_folders for all
  using (auth.role() = 'authenticated');

-- Media: auth only (public reads via direct URLs)
create policy "media_auth" on public.media for all
  using (auth.role() = 'authenticated');

-- SEO settings: auth only
create policy "seo_auth" on public.seo_settings for all
  using (auth.role() = 'authenticated');

-- Theme settings: public read
create policy "theme_select" on public.theme_settings for select using (true);
create policy "theme_auth" on public.theme_settings for all
  using (auth.role() = 'authenticated');

-- Search index: public read
create policy "search_select" on public.search_index for select using (true);
create policy "search_auth" on public.search_index for all
  using (auth.role() = 'authenticated');

-- Audit logs: auth only
create policy "audit_auth" on public.audit_logs for all
  using (auth.role() = 'authenticated');

-- Activity logs: auth only
create policy "activity_auth" on public.activity_logs for all
  using (auth.role() = 'authenticated');

-- Notifications: auth reads own
create policy "notifications_select" on public.notifications for select
  using (user_id = auth.uid());
create policy "notifications_update" on public.notifications for update
  using (user_id = auth.uid());

-- Scheduled publishes: auth only
create policy "scheduled_auth" on public.scheduled_publishes for all
  using (auth.role() = 'authenticated');

-- Roles: auth read
create policy "roles_select" on public.roles for select using (true);
create policy "roles_auth" on public.roles for all using (auth.role() = 'authenticated');

-- Permissions: auth read
create policy "permissions_select" on public.permissions for select using (true);
create policy "permissions_auth" on public.permissions for all using (auth.role() = 'authenticated');

-- Role permissions: auth
create policy "role_perms_auth" on public.role_permissions for all using (auth.role() = 'authenticated');

-- User roles: auth
create policy "user_roles_select" on public.user_roles for select using (auth.role() = 'authenticated');
create policy "user_roles_auth" on public.user_roles for all using (auth.role() = 'authenticated');

-- Users: auth reads own, admin reads all
create policy "users_select_own" on public.users for select
  using (id = auth.uid());
create policy "users_select_auth" on public.users for select
  using (auth.role() = 'authenticated');

-- User sessions: auth manages own
create policy "sessions_select" on public.user_sessions for select
  using (user_id = auth.uid());
create policy "sessions_delete" on public.user_sessions for delete
  using (user_id = auth.uid());

-- ============================================================================
-- 44. SEED DATA
-- ============================================================================

-- Roles
insert into public.roles (id, name, description, is_system) values
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Full system administrator', true),
  ('a0000000-0000-0000-0000-000000000002', 'editor', 'Content editor', true),
  ('a0000000-0000-0000-0000-000000000003', 'teacher', 'Staff member', true),
  ('a0000000-0000-0000-0000-000000000004', 'viewer', 'Read-only access', true)
on conflict (id) do nothing;

-- Permissions
insert into public.permissions (name, description, module) values
  ('pages.read', 'Read pages', 'pages'),
  ('pages.write', 'Create/edit pages', 'pages'),
  ('pages.publish', 'Publish pages', 'pages'),
  ('pages.delete', 'Delete pages', 'pages'),
  ('news.read', 'Read news', 'news'),
  ('news.write', 'Create/edit news', 'news'),
  ('news.publish', 'Publish news', 'news'),
  ('news.delete', 'Delete news', 'news'),
  ('events.read', 'Read events', 'events'),
  ('events.write', 'Create/edit events', 'events'),
  ('events.publish', 'Publish events', 'events'),
  ('gallery.read', 'Read gallery', 'gallery'),
  ('gallery.write', 'Create/edit gallery', 'gallery'),
  ('staff.read', 'Read staff', 'staff'),
  ('staff.write', 'Create/edit staff', 'staff'),
  ('settings.read', 'Read settings', 'settings'),
  ('settings.write', 'Write settings', 'settings'),
  ('users.read', 'Read users', 'users'),
  ('users.write', 'Create/edit users', 'users'),
  ('media.read', 'Read media', 'media'),
  ('media.upload', 'Upload media', 'media'),
  ('media.delete', 'Delete media', 'media'),
  ('analytics.read', 'Read analytics', 'analytics'),
  ('seo.write', 'Edit SEO settings', 'seo')
on conflict (name) do nothing;

-- Admin role gets all permissions
insert into public.role_permissions (role_id, permission_id)
select 'a0000000-0000-0000-0000-000000000001', id from public.permissions
on conflict do nothing;

-- Editor role gets content permissions
insert into public.role_permissions (role_id, permission_id)
select 'a0000000-0000-0000-0000-000000000002', id from public.permissions
where name like '%.read' or name like '%.write'
on conflict do nothing;

-- Default school info
insert into public.school_info (id, name, short_name, tagline, founded, address, city, country, phone, email)
values (
  'b0000000-0000-0000-0000-000000000001',
  'Aurelia International Academy',
  'AIA',
  'Knowledge Without Borders',
  1998,
  '48 Kensington Heights, Meridian Park',
  'London',
  'United Kingdom',
  '+44 (0)20 7946 0958',
  'admissions@aurelia.edu'
) on conflict (id) do nothing;

-- Default theme settings
insert into public.theme_settings (key, value, category) values
  ('colors', '{"primary":"#1B3A5C","secondary":"#C8102E","accent":"#D4A843","background":"#FAF8F5","text":"#1A1A1A"}'::jsonb, 'colors'),
  ('fonts', '{"heading":"Cormorant Garamond","body":"Inter","accent":"Lora"}'::jsonb, 'fonts'),
  ('footer', '{"columns":3,"showNewsletter":true,"showSocial":true}'::jsonb, 'layout'),
  ('header', '{"sticky":true,"showSearch":true,"showCTA":true}'::jsonb, 'layout')
on conflict (key) do nothing;

-- Default home sections
insert into public.home_sections (id, section_key, type, title, "order", is_visible, content) values
  ('hhero', 'hero', 'hero', 'Knowledge Without Borders', 1, true,
    '{"type":"hero","title":"Knowledge Without Borders","kicker":"International Private School · Ages 3–18","subtitle":"A community of forty-two nationalities, a tradition of academic excellence, and a culture of genuine care.","image":"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80","cta1":{"to":"/admissions","label":"Explore Admissions"},"cta2":{"to":"/about","label":"Learn About Us"}}'::jsonb),
  ('hwelcome', 'welcome', 'welcome', 'Welcome to Aurelia', 2, true,
    '{"type":"welcome","title":"Welcome to Aurelia","body":"<p>Aurelia is an international day school in London for students aged 3 to 18.</p>","image":"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"}'::jsonb),
  ('hstats', 'stats', 'stats', 'Statistics', 3, true,
    '{"type":"stats","items":[{"label":"Students","value":"1,150+"},{"label":"Nationalities","value":"42"},{"label":"IB Pass Rate","value":"96%"},{"label":"Clubs & Teams","value":"40+"}]}'::jsonb),
  ('hprograms', 'programs', 'programs', 'Our Programmes', 4, true,
    '{"type":"programs","title":"One Journey, Every Stage","subtitle":"From Early Years through to the IB Diploma."}'::jsonb),
  ('hnews', 'latestNews', 'latestNews', 'Latest News', 5, true,
    '{"type":"latestNews","title":"From the Newsroom"}'::jsonb),
  ('hevents', 'upcomingEvents', 'upcomingEvents', 'Upcoming Events', 6, true,
    '{"type":"upcomingEvents","title":"Mark Your Calendar"}'::jsonb),
  ('hquote', 'quote', 'quote', 'Quote', 7, true,
    '{"type":"quote","quote":"We measure success not only in exam results but in the kindness of our corridors.","author":"Dr. Helena Moreau","role":"Head of School"}'::jsonb),
  ('hgallery', 'galleryPreview', 'galleryPreview', 'Gallery', 8, true,
    '{"type":"galleryPreview","title":"Life in Pictures"}'::jsonb),
  ('hcta', 'cta', 'cta', 'Begin Your Journey', 9, true,
    '{"type":"cta","title":"Begin Your Aurelia Journey","text":"Book a campus tour, attend an Open Morning, or start a conversation with our admissions team.","cta1":{"to":"/contact","label":"Book a Tour"},"cta2":{"to":"/admissions","label":"Explore Admissions"}}'::jsonb)
on conflict (id) do nothing;

-- Default menus
insert into public.menus (id, name, slug, location, is_active) values
  ('c0000000-0000-0000-0000-000000000001', 'Main Navigation', 'main-nav', 'header', true),
  ('c0000000-0000-0000-0000-000000000002', 'Footer Navigation', 'footer-nav', 'footer', true)
on conflict (id) do nothing;

-- Admin user (password: admin123 — bcrypt hash)
-- Note: This user is also created in Supabase Auth by the setup script
insert into public.users (id, email, username, display_name, password_hash, is_active)
values (
  'd0000000-0000-0000-0000-000000000001',
  'admin@aurelia.edu',
  'admin',
  'Administrator',
  '$2a$10$YourHashHere',
  true
) on conflict (id) do nothing;

-- Assign admin role
insert into public.user_roles (user_id, role_id)
values ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001')
on conflict do nothing;

-- ============================================================================
-- 45. REALTIME PUBLICATION
-- ============================================================================
-- Run once in SQL Editor:
-- alter publication supabase_realtime add table public.cms_items;
-- alter publication supabase_realtime add table public.cms_singles;
-- alter publication supabase_realtime add table public.home_sections;
-- alter publication supabase_realtime add table public.pages;
-- alter publication supabase_realtime add table public.news;
-- alter publication supabase_realtime add table public.events;
-- alter publication supabase_realtime add table public.notices;
-- alter publication supabase_realtime add table public.emergency_alerts;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
