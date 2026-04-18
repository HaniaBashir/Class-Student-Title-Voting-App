do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'name'
  ) then
    alter table public.students rename column name to student_name;
  end if;
end $$;

alter table public.voter_credentials
drop column if exists email;

drop index if exists idx_voter_credentials_student_name;
create index if not exists idx_voter_credentials_roll_number
  on public.voter_credentials(roll_number);

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

drop policy if exists "Public can update submissions" on public.submissions;
create policy "Public can update submissions"
on public.submissions
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

drop policy if exists "Public can update submission votes" on public.submission_votes;
create policy "Public can update submission votes"
on public.submission_votes
for update
to anon, authenticated
using (true)
with check (true);

comment on table public.voter_credentials is
'Simple one-time password table for class voting. Emails are generated only during export and are not stored permanently.';
