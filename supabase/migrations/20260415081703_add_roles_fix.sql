-- =========================
-- 1. PROFILES TABLE (CLEAN)
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
-- 2. ENABLE RLS
-- =========================

alter table public.profiles enable row level security;

-- =========================
-- 3. DROP OLD POLICIES
-- =========================

drop policy if exists "select own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "admin full access" on public.profiles;

-- =========================
-- 4. BASIC USER POLICIES
-- =========================

-- SELECT own profile
create policy "select own profile"
on public.profiles
for select
using (auth.uid() = id);

-- INSERT own profile (IMPORTANT for signup)
create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- UPDATE own profile
create policy "update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================
-- 5. ADMIN POLICY (SAFE, NO RECURSION)
-- =========================
-- ❗ важно: НЕ через profiles (иначе рекурсия RLS)
-- используем JWT claim

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
-- 6. TRIGGER FUNCTION (SIGNUP FIX)
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
  on conflict (id) do nothing;

  return new;
end;
$$;

-- =========================
-- 7. RECREATE TRIGGER
-- =========================

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
