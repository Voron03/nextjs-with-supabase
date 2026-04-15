create table exercice (
  id_exercice uuid primary key default gen_random_uuid(),
  title text not null,
  inhale_seconds integer not null,
  hold_seconds integer not null,
  exhale_seconds integer not null,
  created_at timestamp with time zone default now(),

  check (inhale_seconds > 0),
  check (hold_seconds >= 0),
  check (exhale_seconds > 0)
);
