create extension if not exists "pgcrypto";

create table if not exists public.voter_credentials (
  id uuid primary key default gen_random_uuid(),
  student_name text unique not null,
  email text unique,
  voter_password text unique not null,
  is_used boolean not null default false,
  used_at timestamptz
);

create index if not exists idx_voter_credentials_student_name
  on public.voter_credentials(student_name);

create index if not exists idx_voter_credentials_is_used
  on public.voter_credentials(is_used);

alter table public.voter_credentials enable row level security;

drop policy if exists "Public can read voter credentials" on public.voter_credentials;
create policy "Public can read voter credentials"
on public.voter_credentials
for select
to anon, authenticated
using (true);

drop policy if exists "Public can update voter credentials" on public.voter_credentials;
create policy "Public can update voter credentials"
on public.voter_credentials
for update
to anon, authenticated
using (true)
with check (true);
