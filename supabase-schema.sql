-- ============================================
-- QuizCraft Database Schema
-- Run this in: Supabase → SQL Editor → New Query
-- ============================================

-- 1. QUIZZES table
create table quizzes (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade,
  title          text not null,
  share_id       text unique not null,
  published      boolean default false,
  question_count int default 0,
  created_at     timestamptz default now()
);

-- 2. QUESTIONS table
create table questions (
  id       uuid default gen_random_uuid() primary key,
  quiz_id  uuid references quizzes(id) on delete cascade,
  text     text not null,
  options  text[] not null,
  correct  int not null,
  "order"  int default 0
);

-- 3. RESULTS table (student submissions)
create table results (
  id           uuid default gen_random_uuid() primary key,
  quiz_id      uuid references quizzes(id) on delete cascade,
  student_name text,
  answers      jsonb,
  score        int,
  correct      int,
  total        int,
  created_at   timestamptz default now()
);

-- ============================================
-- Row Level Security (RLS) — keeps data safe
-- ============================================

alter table quizzes   enable row level security;
alter table questions enable row level security;
alter table results   enable row level security;

-- Teachers can only see/edit their own quizzes
create policy "Own quizzes" on quizzes
  for all using (auth.uid() = user_id);

-- Teachers can manage questions for their quizzes
create policy "Own questions" on questions
  for all using (
    quiz_id in (select id from quizzes where user_id = auth.uid())
  );

-- Anyone can read questions for a published quiz (students)
create policy "Public questions" on questions
  for select using (
    quiz_id in (select id from quizzes where published = true)
  );

-- Anyone can read published quizzes (students need quiz info)
create policy "Public quizzes" on quizzes
  for select using (published = true);

-- Anyone can submit results
create policy "Submit results" on results
  for insert with check (true);

-- Teachers can view results for their quizzes
create policy "Own results" on results
  for select using (
    quiz_id in (select id from quizzes where user_id = auth.uid())
  );
