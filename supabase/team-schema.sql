-- ============================================================
-- A9Travel — Team module migration (2026-09-22)
-- Generic store shape: id text PK, payload jsonb, created_at, updated_at
-- ============================================================

do $$
declare c text;
begin
  foreach c in array array['team_departments','team_members']
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

-- Verify
select tablename from pg_tables where schemaname = 'public' order by tablename;