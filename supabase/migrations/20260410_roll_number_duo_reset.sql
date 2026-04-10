create extension if not exists "pgcrypto";

drop table if exists public.submission_votes;
drop table if exists public.submissions;
drop table if exists public.titles;
drop table if exists public.students;
drop table if exists public.voter_credentials;

create table public.students (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  name text not null
);

create table public.titles (
  id uuid primary key default gen_random_uuid(),
  title_name text unique not null,
  display_order int not null,
  title_type text not null default 'single' check (title_type in ('single', 'duo'))
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  student_name text not null,
  created_at timestamptz not null default now()
);

create table public.voter_credentials (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  student_name text not null,
  email text unique,
  voter_password text unique not null,
  is_used boolean not null default false,
  used_at timestamptz
);

create table public.submission_votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  title_id uuid not null references public.titles(id) on delete cascade,
  selected_student_name text not null,
  selected_student_name_2 text,
  constraint submission_votes_submission_title_key unique (submission_id, title_id)
);

create index idx_students_roll_number on public.students(roll_number);
create index idx_titles_display_order on public.titles(display_order);
create index idx_titles_type on public.titles(title_type);
create index idx_submissions_roll_number on public.submissions(roll_number);
create index idx_submissions_created_at on public.submissions(created_at desc);
create index idx_voter_credentials_roll_number on public.voter_credentials(roll_number);
create index idx_voter_credentials_is_used on public.voter_credentials(is_used);
create index idx_submission_votes_title_id on public.submission_votes(title_id);
create index idx_submission_votes_selected_student on public.submission_votes(selected_student_name);
create index idx_submission_votes_title_student on public.submission_votes(title_id, selected_student_name);

alter table public.students enable row level security;
alter table public.titles enable row level security;
alter table public.submissions enable row level security;
alter table public.voter_credentials enable row level security;
alter table public.submission_votes enable row level security;

create policy "Public can read students"
on public.students
for select
to anon, authenticated
using (true);

create policy "Public can read titles"
on public.titles
for select
to anon, authenticated
using (true);

create policy "Public can read submissions"
on public.submissions
for select
to anon, authenticated
using (true);

create policy "Public can insert submissions"
on public.submissions
for insert
to anon, authenticated
with check (true);

create policy "Public can delete own failed submission rollback"
on public.submissions
for delete
to anon, authenticated
using (true);

create policy "Public can read voter credentials"
on public.voter_credentials
for select
to anon, authenticated
using (true);

create policy "Public can update voter credentials"
on public.voter_credentials
for update
to anon, authenticated
using (true)
with check (true);

create policy "Public can read submission votes"
on public.submission_votes
for select
to anon, authenticated
using (true);

create policy "Public can insert submission votes"
on public.submission_votes
for insert
to anon, authenticated
with check (true);
