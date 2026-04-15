-- =========================
-- PROFILES TABLE
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text,
  last_name text,
  birthday date,
  is_active boolean default true,

  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- =========================
-- RLS (security)
-- =========================

alter table public.profiles enable row level security;

drop policy if exists "select own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;

create policy "select own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- =========================
-- REMOVE OLD TRIGGERS (IMPORTANT)
-- =========================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
