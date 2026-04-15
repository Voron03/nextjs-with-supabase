-- =========================
-- ADD ROLE COLUMN
-- =========================
alter table public.profiles
add column if not exists role text default 'user';

-- =========================
-- CLEAN OLD POLICIES
-- =========================
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "user can update own profile except admin fields" on public.profiles;
drop policy if exists "user update own profile" on public.profiles;
drop policy if exists "admin full access" on public.profiles;

-- =========================
-- USER: can update ONLY own profile
-- =========================
create policy "user update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================
-- USER: can read ONLY own profile
-- =========================
drop policy if exists "select own profile" on public.profiles;

create policy "select own profile"
on public.profiles
for select
using (auth.uid() = id);

-- =========================
-- ADMIN: full access
-- =========================
create policy "admin full access"
on public.profiles
for all
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);
