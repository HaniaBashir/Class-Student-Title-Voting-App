alter table public.submission_votes
add column if not exists selected_student_name_2 text;

comment on column public.submission_votes.selected_student_name_2 is
'Optional second student for pair titles such as Best Couple.';
