create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  student_name text not null
);

create table if not exists public.titles (
  id uuid primary key default gen_random_uuid(),
  title_name text unique not null,
  display_order int not null,
  title_type text not null default 'single' check (title_type in ('single', 'duo'))
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  student_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.voter_credentials (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  student_name text not null,
  voter_password text unique not null,
  is_used boolean not null default false,
  used_at timestamptz
);

create table if not exists public.submission_votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  title_id uuid not null references public.titles(id) on delete cascade,
  selected_student_name text not null,
  selected_student_name_2 text,
  constraint submission_votes_submission_title_key unique (submission_id, title_id)
);

create index if not exists idx_students_roll_number on public.students(roll_number);
create index if not exists idx_titles_display_order on public.titles(display_order);
create index if not exists idx_titles_type on public.titles(title_type);
create index if not exists idx_submissions_roll_number on public.submissions(roll_number);
create index if not exists idx_submissions_created_at on public.submissions(created_at desc);
create index if not exists idx_voter_credentials_roll_number on public.voter_credentials(roll_number);
create index if not exists idx_voter_credentials_is_used on public.voter_credentials(is_used);
create index if not exists idx_submission_votes_title_id on public.submission_votes(title_id);
create index if not exists idx_submission_votes_selected_student on public.submission_votes(selected_student_name);
create index if not exists idx_submission_votes_title_student on public.submission_votes(title_id, selected_student_name);

alter table public.students enable row level security;
alter table public.titles enable row level security;
alter table public.submissions enable row level security;
alter table public.voter_credentials enable row level security;
alter table public.submission_votes enable row level security;

drop policy if exists "Public can read students" on public.students;
create policy "Public can read students"
on public.students
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert students" on public.students;
create policy "Public can insert students"
on public.students
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update students" on public.students;
create policy "Public can update students"
on public.students
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete students" on public.students;
create policy "Public can delete students"
on public.students
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can read titles" on public.titles;
create policy "Public can read titles"
on public.titles
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert titles" on public.titles;
create policy "Public can insert titles"
on public.titles
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update titles" on public.titles;
create policy "Public can update titles"
on public.titles
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete titles" on public.titles;
create policy "Public can delete titles"
on public.titles
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can read submissions" on public.submissions;
create policy "Public can read submissions"
on public.submissions
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert submissions" on public.submissions;
create policy "Public can insert submissions"
on public.submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can delete own failed submission rollback" on public.submissions;
create policy "Public can delete own failed submission rollback"
on public.submissions
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can update submissions" on public.submissions;
create policy "Public can update submissions"
on public.submissions
for update
to anon, authenticated
using (true)
with check (true);

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

drop policy if exists "Public can insert voter credentials" on public.voter_credentials;
create policy "Public can insert voter credentials"
on public.voter_credentials
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can delete voter credentials" on public.voter_credentials;
create policy "Public can delete voter credentials"
on public.voter_credentials
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can read submission votes" on public.submission_votes;
create policy "Public can read submission votes"
on public.submission_votes
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert submission votes" on public.submission_votes;
create policy "Public can insert submission votes"
on public.submission_votes
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update submission votes" on public.submission_votes;
create policy "Public can update submission votes"
on public.submission_votes
for update
to anon, authenticated
using (true)
with check (true);

comment on table public.submissions is
'Class-project submission table keyed by roll_number.';

comment on table public.voter_credentials is
'Simple one-time password table for class voting. Emails are generated only during export and are not stored permanently.';

comment on table public.submission_votes is
'Stores one selected student for normal titles, and an optional second selected student for duo titles such as Best Duo.';
