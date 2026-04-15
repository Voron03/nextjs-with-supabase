-- =========================
-- FIX PROFILES (SAFE RESET)
-- =========================

alter table public.profiles enable row level security;

-- удалить старые policies чтобы не конфликтовали
drop policy if exists "select own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "admin full access" on public.profiles;

-- SELECT
create policy "select own profile"
on public.profiles
for select
using (auth.uid() = id);

-- INSERT
create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- UPDATE
create policy "update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- ADMIN (если role есть)
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
