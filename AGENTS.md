# AGENTS.md

Aurelia International Academy school site — React 18 + Vite SPA with a localStorage-backed CMS. Public site + `/dashboard` admin are the same app.

## Commands (Windows PowerShell 5.1)

- Execution policy blocks `npm.ps1`; use `npm.cmd` and prepend Node to PATH first:
  `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm.cmd run <script>`
- `npm.cmd run dev` → Vite on port 5173
- `npm.cmd run build` → the only real compile/typecheck gate (no ESLint/tsc exists)
- `npm.cmd run smoke` → `node scripts/smoke-test.mjs`, jsdom SSR-renders every public + CMS route and prints `ALL ROUTES RENDER`; exit 0 = pass. Output is huge (react-router `useLayoutEffect` SSR warnings); redirect to a file and grep for `OK  |FAIL|ALL ROUTES`. It logs in as admin by writing `sessionStorage.aia_session` directly.

Always run `build` then `smoke` before calling work done.

## Data layer (read this before mutating anything)

- `src/lib/store.js` is the single persistence layer. localStorage prefix `DB_KEY = aia_v1_`; 34 collections + `SINGLES` (schoolInfo, settings, theme, socialFeeds). `saveCollection(key, value)` is the only write path; `loadDb()` caches the whole DB in a module-level `cache`.
- Blobs (uploaded images/files) live under `aia_v1_blob_<id>` via `setBlob/getBlob`; use `invalidateBlob(id)` / `reloadKey(key)` for cache invalidation and cross-tab refreshes.
- `src/context/DataContext.jsx` is the mutation hub. Never call `saveCollection` from pages/components directly — go through its actions (`create`, `update`, `remove`, `replaceAll`, `reorder`, `saveSingle`) which handle audit logging, version snapshots, and the `storage`-event cross-tab sync. `dbRef.current` mirrors state for synchronous reads.
- Provider order in `main.jsx`: Toast → Data → A11y → Auth. `DataProvider` is *outside* `AuthProvider`, so DataContext cannot call `useAuth` — it reads the actor from `sessionStorage.aia_session` instead.

## Publishing workflow (don't bypass)

- Statuses: `draft | pending | scheduled | published | unpublished | archived`. Public pages hand-filter `status === 'published'`; `publishedOnly(key, sortField, desc)` also keeps `status === undefined` and `isVisible !== false`. Only published content is live.
- Use DataContext actions `publish / unpublish / archive / submitForReview / schedule / restoreVersion / versionsOf / clearAuditLog` and state `auditLog`, `versions`. `update` auto-snapshots on any status change, or on keys in `VERSIONED_EDIT` (pages, news, homeSections). Restores go through `restoreVersion` (never by writing the record directly).
- `src/lib/scheduler.js` auto-publishes scheduled rows for 18 entity types every 15s (interval lives in DataContext); it appends `system` audit entries. Add new auto-publishable entities to `SCHEDULED_ENTITIES`.
- Public submissions (`PUBLIC_SUBMISSION`: applications, jobApplications, eventRegistrations, newsletterSubscribers, messages, feedback, testimonials) are NOT audited on ordinary create/update — only on status changes. That is intentional.
- `src/lib/publishing.js` holds status metadata, `validateForPublish(item, fields, requireSlug)`, and `actionForStatusChange`. SimpleCrud and PageEdit/NewsEdit already call these; if you add a save path, run validation before setting `status: 'published'`.
- Admin login is `admin / admin123` (seed `settings.adminUser/adminPass`, changeable in Settings).

## CMS conventions

- Generic CRUD: `src/pages/cms/SimpleCrud.jsx` reads its config from `src/pages/cms/FeatureScreens.jsx` (fields, `showStatus`, required fields, `publicSlugPath`). Custom screens (PageEdit, NewsEdit, GalleryEdit, Menus, Seo, Settings, MediaLibrary) follow their own forms but still route through DataContext actions.
- Shared UI components (Btn, Field, Card, Table, StatusBadge, Select, Toggle, ConfirmDialog, Modal, ImagePicker, RichTextEditor) live in `src/components/cms/UI.jsx` and `src/components/cms/`. Reuse them; don't hand-roll buttons/cards.
- CMS nav sections are defined in `src/pages/cms/Layout.jsx`; admin routes are wired in `src/App.jsx` under `/dashboard` with the `CMS(<Component/>)` wrapper (keyed by route). Add both when creating a new admin screen.
- Utils (`cn`, `slugify`, `uid`, `formatDate`, `formatDateTime`, `timeAgo`, `toDateTimeLocal`) are in `src/lib/utils.js`.

## Gotchas

- `vite build` prints a non-fatal warning that `store.js` is both statically and dynamically imported (via `api.js`); ignore it.
- Blob/data-URL media can blow the 5MB localStorage quota; `saveCollection` throws a quota error and callers surface it. `MediaLibrary` and `ImagePicker` already cap sizes.
- Keep new records terse — match existing lowercase field naming (`publishedAt`, `publishAt`, `isVisible`, `status`).

## Supabase sync layer

- Production DB: Supabase project `ekcwfaqeyqtttfwrvapd`. Tables `public.cms_items` (one row per entity record: `key`, `id`, `data` JSONB, `status`, `slug`, `title`, `is_visible`, timestamps; PK `key,id`) and `public.cms_singles` (`key`, `value` JSONB).
- `.env` (gitignored) holds `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (browser-safe), `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN` (optional, Management API only), `SUPABASE_ADMIN_EMAIL/PASSWORD`. `.env.example` documents them. If the Vite vars are absent the app is 100% localStorage (no remote calls) — the smoke gate runs in that mode.
- `src/lib/supabase.js`: guarded `createClient`, exports `supabase`, `isRemoteConfigured()`, `remoteSession()`, `remoteSignIn/SignOut`, and the table name constants.
- `src/lib/store.js` remote functions: `syncFromRemote()` (pull all collections + singles + audit/versions into localStorage, called by `DataProvider` on mount), `schedulePush/scheduleSinglePush` (debounced 300ms remote upsert), `flushPushes` (on `pagehide`), `pushCollection`/`pushSingle`, `applyRemoteItem`/`applyRemoteSingle` (realtime event application). Rows are derived via `rowFromRecord`; the remote row `data` is the canonical record and local storage mirrors it.
- Sync is merge-safe, not clobbering: a `aia_v1_syncMeta` localStorage map records the last touch time per key (`touchSync` on schedule, `clearSync` on successful push). `syncFromRemote` keeps local rows/records that were touched more recently than the remote `updatedAt`, and `applyRemoteItem/Single` ignore events for keys with a pending push — so a refresh right after an edit never reverts it, and a failed push never loses the edit.
- Realtime: `DataProvider` subscribes to `postgres_changes` on `cms_items`/`cms_singles` so open tabs/browsers live-update. Requires both tables added to the `supabase_realtime` publication (in `supabase/migration.sql`; run the `do $$ ... alter publication` block in the SQL Editor once — without it the subscription silently delivers nothing).
- `changePassword` also calls `supabase.auth.updateUser({ password })` so the Supabase account stays in sync with the site password (remote sign-in fails otherwise and pushes get silently dropped).
- Writes flow: DataContext actions call `saveCollection` (local) + `schedulePush` (remote). Public submissions (`PUBLIC_SUBMISSION` keys) push even when logged out; everything else only pushes with a valid Supabase session (anon can only read + insert those keys).
- RLS: anon = SELECT everywhere + INSERT on submission keys only; authenticated = full CRUD; service_role bypasses (never ship it client-side).
- Auth: local `admin/admin123` remains the app-level gate; on login the app additionally signs in to Supabase Auth as `admin@aurelia.edu` / `admin123` (seed settings password) so the session enables remote writes, then `resync()`.
- Admin Supabase user: `admin@aurelia.edu` / `admin123` (password in `.env`, changeable via Dashboard > Auth > Users).
- Setup: `node scripts/supabase-setup.mjs` runs DDL + seeds + creates the admin user. Flags: `--seed-only` (skip DDL, e.g. after pasting `supabase/migration.sql` in the SQL Editor), `--sql` (print the migration), `--reset` (wipe + reseed collections). On this project the legacy `/pg/query` endpoint is gone, so either pass `SUPABASE_ACCESS_TOKEN` or run `supabase/migration.sql` manually first. Note: `createClient` must be given the root URL (no `/rest/v1`) or every call fails with "Invalid path specified in request URL".
