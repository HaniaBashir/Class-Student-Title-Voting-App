create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists public.titles (
  id uuid primary key default gen_random_uuid(),
  title_name text unique not null,
  display_order int not null
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  voter_name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.submission_votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  title_id uuid not null references public.titles(id) on delete cascade,
  selected_student_name text not null,
  constraint submission_votes_submission_title_key unique (submission_id, title_id)
);

create index if not exists idx_titles_display_order on public.titles(display_order);
create index if not exists idx_submissions_created_at on public.submissions(created_at desc);
create index if not exists idx_submission_votes_title_id on public.submission_votes(title_id);
create index if not exists idx_submission_votes_selected_student on public.submission_votes(selected_student_name);
create index if not exists idx_submission_votes_title_student on public.submission_votes(title_id, selected_student_name);

alter table public.students enable row level security;
alter table public.titles enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_votes enable row level security;

drop policy if exists "Public can read students" on public.students;
create policy "Public can read students"
on public.students
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read titles" on public.titles;
create policy "Public can read titles"
on public.titles
for select
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

comment on table public.submissions is
'Simple class-project table keyed by voter_name. Real deployments should use authenticated user ids instead.';

comment on table public.submission_votes is
'Public insert/select policies are intentionally simple for demo deployment. Use proper auth for production.';
