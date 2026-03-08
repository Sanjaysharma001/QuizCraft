-- ============================================
-- Run this in Supabase → SQL Editor
-- Adds plan tracking to QuizCraft
-- ============================================

-- Add plan column to track free vs pro users
create table profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text,
  plan       text default 'free',   -- 'free' or 'pro'
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Users can read their own profile
create policy "Own profile" on profiles
  for all using (auth.uid() = id);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger fires on every new signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
