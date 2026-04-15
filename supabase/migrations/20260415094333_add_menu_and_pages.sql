-- 1. TABLE MENU
create table menu (
  id_menu uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. TABLE PAGES
create table pages (
  id_page uuid primary key default gen_random_uuid(),
  title text not null,
  menu_id uuid references menu(id_menu) on delete cascade,
  data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. ENABLE RLS
alter table menu enable row level security;
alter table pages enable row level security;

-- 4. FUNCTION (admin check)
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- 5. MENU POLICIES
create policy "Public can read menu"
on menu
for select
to public
using (true);

create policy "Admins manage menu"
on menu
for all
to authenticated
using (is_admin())
with check (is_admin());

-- 6. PAGES POLICIES
create policy "Public can read pages"
on pages
for select
to public
using (true);

create policy "Admins can insert pages"
on pages
for insert
to authenticated
with check (is_admin());

create policy "Admins can update pages"
on pages
for update
to authenticated
using (is_admin())
with check (is_admin());

create policy "Admins can delete pages"
on pages
for delete
to authenticated
using (is_admin());