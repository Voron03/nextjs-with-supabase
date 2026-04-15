alter table public.profiles
add column if not exists first_name text,
add column if not exists last_name text,
add column if not exists birthday date,
add column if not exists is_active boolean default true;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    birthday,
    is_active
  )
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    (new.raw_user_meta_data->>'birthday')::date,
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql;
