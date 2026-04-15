-- =========================
-- PROFILES TABLE SAFE FIX
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text,
  last_name text,
  birthday date,

  role text default 'user',
  is_active boolean default true,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =========================
-- ENABLE RLS
-- =========================

alter table public.profiles enable row level security;

-- =========================
-- DROP OLD POLICIES (SAFE RESET)
-- =========================

drop policy if exists "select own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "admin full access" on public.profiles;

-- =========================
-- USER POLICIES
-- =========================

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
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================
-- ADMIN POLICY (SAFE, NO RECURSION)
-- =========================

create policy "admin full access"
on public.profiles
for all
using (
  coalesce(auth.jwt() ->> 'role', '') = 'admin'
)
with check (
  coalesce(auth.jwt() ->> 'role', '') = 'admin'
);

-- =========================
-- FIX TRIGGER FUNCTION
-- =========================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    birthday,
    role,
    is_active
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    case
      when new.raw_user_meta_data->>'birthday' is not null
      then (new.raw_user_meta_data->>'birthday')::date
      else null
    end,
    'user',
    true
  )
  on conflict (id)
  do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    birthday = excluded.birthday;

  return new;
end;
$$;

-- =========================
-- RECREATE TRIGGER (IMPORTANT)
-- =========================

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
