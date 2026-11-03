# Taskly — Personal Productivity & To-Do Manager

Taskly is a local-first, offline-ready personal productivity web application built with **React 18**, **TypeScript**, **Tailwind CSS**, **Zustand**, **Dexie.js** (IndexedDB), and **Supabase** (Auth, Postgres, Realtime Sync). Designed with a modern visual identity featuring **Geist & Geist Mono typography**, a **Custom Light/Dark theme switcher**, pill controls, smooth micro-interactions, and signature priority visual indicators.

![Taskly Logo](public/logo.png)

---

## ⚡ Cross-Device Supabase Cloud Sync & Auth

Taskly features full cross-device synchronization powered by Supabase while preserving instant offline usability:

- **Supabase Email/Password Auth**: Secure user authentication. Once logged in, your session persists across browser visits.
- **Offline-First IndexedDB Cache**: Local writes to Dexie IndexedDB happen immediately so the UI stays instant even without network connectivity.
- **Conflict-Free Cloud Sync**: Tasks, habits, and habit logs sync seamlessly with Supabase in the background while safely preserving local offline records.
- **Realtime Multi-Device Updates**: Changes made on your laptop reflect on your phone within seconds via Supabase Realtime subscriptions.
- **Offline Queue**: Operations performed offline are queued locally and automatically flushed to Supabase when connectivity returns (`navigator.onLine`).
- **One-Time Data Migration**: Existing local IndexedDB data is automatically seeded to Supabase on your first login.

---

## 🎨 Key Features

- **Custom Light/Dark Theme Switcher**: Sleek toggle button with smooth animated sliding indicator and custom dark theme token palette (`#0C0E12`).
- **Data Safety Net & Auto-Backups**:
  - **Manual JSON Export / Import**: Downloads `taskly-backup-YYYY-MM-DD.json` containing all tasks, habits, and logs.
  - **Automatic Local Snapshots**: Records a rotating snapshot of the last 5 write operations in IndexedDB (`db.backups`).
- **Enlarged Mobile FAB**: 60x60px thumb-sized floating quick-add button positioned safely above mobile tab navigation.
- **8 Core Workflow Views**: Today, Upcoming, Inbox, Plan My Day, Categories, Habits & Routines, All Tasks & Archive, and Calendar.

---

## ⚙️ Environment Configuration & Deployment Setup

### 1. Environment Variables (`.env`)

Add your Supabase project credentials to `.env` (refer to `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

> ⚠️ **Vercel Deployment Settings**: Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are added under **Project Settings > Environment Variables** in your Vercel dashboard.

---

### 2. Supabase SQL Database Migration Script

To set up your Postgres database tables, Row Level Security (RLS) policies, and Realtime publications, copy and run the SQL migration script from [supabase/schema.sql](file:///d:/Projects/Taskly/supabase/schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

```sql
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

-- 4. Enable RLS
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- 5. RLS Policies
create policy "Users can select own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

create policy "Users can select own habits" on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

create policy "Users can select own habit_logs" on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own habit_logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own habit_logs" on public.habit_logs for update using (auth.uid() = user_id);
create policy "Users can delete own habit_logs" on public.habit_logs for delete using (auth.uid() = user_id);

-- 6. Realtime Publication
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_logs;
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript, scaffolded with Vite
- **Backend & Realtime**: Supabase (`@supabase/supabase-js`)
- **Offline Storage**: IndexedDB via Dexie.js (`Dexie` + `dexie-react-hooks`)
- **Styling**: Tailwind CSS with custom CSS variable tokens (`var(--bg)`, `var(--surface)`, `var(--ink)`, `var(--accent)`)
- **Typography**: Geist Sans & Geist Mono
- **State Management**: Zustand
- **PWA**: `vite-plugin-pwa` (Workbox)
- **Icons**: `lucide-react`

---

## 🚦 Getting Started

### Installation & Local Run

1. Clone or navigate to the repository directory:
   ```bash
   cd Taskly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` with your Supabase credentials.

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the [LICENSE](LICENSE) file for full details.

Copyright (c) 2026 Swayam Mandhani
