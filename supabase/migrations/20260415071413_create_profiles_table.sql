-- 🔹 Таблица профилей
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- 🔐 Включаем RLS
alter table public.profiles enable row level security;

-- 👁️ SELECT
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- ➕ INSERT
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- ✏️ UPDATE
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- 🔄 updated_at авто-обновление
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.profiles
for each row
execute procedure public.handle_updated_at();

-- 🔥 Авто-создание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
