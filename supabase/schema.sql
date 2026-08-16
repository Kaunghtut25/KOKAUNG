-- ============================================================
-- A9Travel — Supabase schema (2026-08-16)
-- Generic store shape expected by frontend/src/lib/persistentStore.ts:
--   id text PK, payload jsonb (the full app record), created_at, updated_at
-- Security: RLS enabled with NO anonymous policies. Only the server-side
--   service-role key (SUPABASE_SERVICE_ROLE_KEY) can read/write.
--   (Service role bypasses RLS; anon key is NOT deployed.)
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================

do $$
declare c text;
begin
  foreach c in array array['tours','hotels','cars','cruises','visas','insurances','blog','bookings','mingalar','site-config','settings','knowledge']
  loop
    execute format('create table if not exists public.%I (
      id text primary key,
      payload jsonb not null default ''{}''::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );', c);
    execute format('create index if not exists %I on public.%I (created_at desc);', c || '_created_idx', c);
    execute format('alter table public.%I enable row level security;', c);
  end loop;
end $$;

-- Verify: should list 12 tables
select tablename from pg_tables where schemaname = 'public' order by tablename;
