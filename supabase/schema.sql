-- ==========================================
-- TASKLY SUPABASE DATABASE SCHEMA MIGRATION
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tasks Table
create table if not exists public.tasks (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date text,
  due_time text,
  category text,
  subtasks jsonb default '[]'::jsonb,
  recurring text default 'none',
  estimate_minutes integer,
  completed boolean default false,
  completed_at bigint,
  created_at bigint not null,
  updated_at timestamptz default now() not null
);

-- 2. Habits Table
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  estimate_minutes integer,
  created_at bigint not null,
  updated_at timestamptz default now() not null
);

-- 3. Habit Logs Table
create table if not exists public.habit_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  completed_habits jsonb default '{}'::jsonb,
  updated_at timestamptz default now() not null,
  constraint habit_logs_user_date_key unique (user_id, date)
);

-- 4. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- 5. RLS Policies
-- Tasks Policies
drop policy if exists "Users can select own tasks" on public.tasks;
create policy "Users can select own tasks" on public.tasks for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tasks" on public.tasks;
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own tasks" on public.tasks;
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- Habits Policies
drop policy if exists "Users can select own habits" on public.habits;
create policy "Users can select own habits" on public.habits for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own habits" on public.habits;
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own habits" on public.habits;
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own habits" on public.habits;
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

-- Habit Logs Policies
drop policy if exists "Users can select own habit_logs" on public.habit_logs;
create policy "Users can select own habit_logs" on public.habit_logs for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own habit_logs" on public.habit_logs;
create policy "Users can insert own habit_logs" on public.habit_logs for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own habit_logs" on public.habit_logs;
create policy "Users can update own habit_logs" on public.habit_logs for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own habit_logs" on public.habit_logs;
create policy "Users can delete own habit_logs" on public.habit_logs for delete using (auth.uid() = user_id);

-- 6. Realtime Publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'habits'
  ) then
    alter publication supabase_realtime add table public.habits;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'habit_logs'
  ) then
    alter publication supabase_realtime add table public.habit_logs;
  end if;
end $$;
