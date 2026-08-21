# Taskly — Personal Productivity & To-Do List Manager

Taskly is a local-first, offline-ready personal productivity web application built with **React**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Dexie.js** (IndexedDB). Designed with a calm, professional ledger and planner aesthetic, Taskly avoids generic template looks in favor of sharp typography, strict functional design tokens, and signature priority indicators.

![Taskly Overview](public/favicon.svg)

---

## ✨ Features

- **Offline-First & Local Persistence**: All data is stored locally in IndexedDB via `Dexie.js` wrapped in a reactive `Zustand` store — scaling past string size limits and functioning with zero network connection.
- **7 Core Workflow Views**:
  - **Today**: Overdue tasks section (urgent highlight), Today's scheduled tasks (sorted by priority & time), and Daily Habits section.
  - **Upcoming**: Grouped by date headers (Tomorrow, upcoming weekdays, Later) with collapsible date sections.
  - **Inbox**: Fast-capture top input banner for quick entry plus inline one-click triage buttons (`Today`, `Tomorrow`).
  - **Plan My Day**: Ledger schedule sheet layout featuring priority indicator dots, title, monospace estimate tags, inline check completion, and a segmented ledger-tally progress bar.
  - **Habits & Routines**: Dedicated habit template manager displaying current consecutive day streaks, priority bars, category chips, and explanatory guidance.
  - **All Tasks & Archive**: Live search across titles & notes, composed priority multi-select chips, category selector, status filter (All/Pending/Completed), and category groupings.
  - **Calendar**: Interactive month grid layout with priority-colored dots and a day agenda side panel for date-specific task management.
- **Recurring Task Engine**: Automatically schedules the next instance (`daily`, `weekly`, `monthly`) when a recurring task is completed, preserving complete task completion history.
- **Pure Function Streak Calculation**: Computes habit streaks accurately, correctly handling unfinished "today" states so an active day doesn't reset your progress.
- **PWA & Offline Installation**: Scaffolded with `vite-plugin-pwa` and Workbox service worker caching for offline asset loading and home screen installation.
- **Accessibility & Polish**: Full keyboard navigation (`Tab` focus rings, `Esc` modal dismiss), landmark ARIA roles, and a non-blocking toast feedback system.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript, scaffolded with Vite
- **Styling**: Tailwind CSS with custom CSS variables (`var(--bg)`, `var(--surface)`, `var(--ink)`, `var(--accent)`, priority scale)
- **State Management**: Zustand
- **Database**: IndexedDB via Dexie.js (`Dexie` + `dexie-react-hooks`)
- **PWA**: `vite-plugin-pwa` (Workbox)
- **Icons**: `lucide-react`
- **Date Utilities**: `date-fns`

---

## 🎨 Design System Tokens

- **Background**: Soft cool paper grey (`#ECEEE8`)
- **Panels**: Primary `#FFFFFF`, Secondary `#F5F6F0`
- **Ink**: Near-black ink `#1E2320`, Secondary text `#6B716B`
- **Accent**: Indigo-violet `#4B4FE0`
- **Priority Scale**:
  - `Urgent`: `#E0483E` (Soft tint `#FCEBEA`)
  - `High`: `#E8963C` (Soft tint `#FDF4E7`)
  - `Medium`: `#D9A62E` (Soft tint `#FAF5E5`)
  - `Low`: `#4FA876` (Soft tint `#EEF7F2`)
- **Typography**:
  - Display / Headings: `Space Grotesk`
  - Body: `Inter`
  - Numeric / Ledger: `IBM Plex Mono`

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd Taskly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production and test PWA capabilities:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📦 Project Structure

```
Taskly/
├── public/                  # PWA icons & manifest assets
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── scripts/                 # Asset generation scripts
│   └── generate-icons.js
├── src/
│   ├── components/
│   │   ├── common/          # Reusable ledger components (PriorityBar, CategoryChip, etc.)
│   │   ├── debug/           # Raw IndexedDB store inspector modal
│   │   ├── habits/          # HabitRow & HabitEditorModal
│   │   ├── layout/          # AppShell, Sidebar, MobileNav
│   │   └── tasks/           # TaskRow, TaskEditorModal, SubtaskBuilder
│   ├── db/                  # Dexie.js database schema & initialization
│   ├── store/               # Zustand store wrapping IndexedDB CRUD
│   ├── types/               # Data interfaces (Task, Habit, HabitLog, ViewMode)
│   ├── utils/               # Category color hashing, streak calculator, date helpers
│   ├── views/               # 7 View components (Today, Upcoming, Inbox, Plan, Habits, All, Calendar)
│   ├── App.tsx              # Root component
│   ├── index.css            # Design tokens & CSS variables
│   └── main.tsx             # Application entrypoint
├── index.html               # Font imports & HTML shell
├── package.json
├── tailwind.config.js       # Custom design system token bindings
├── tsconfig.json
└── vite.config.ts           # Vite + PWA plugin setup
```

---

## 🧪 Phase Breakdown Status

- [x] **Phase 0 — Tech Stack Brief**: Vite, React, TS, Tailwind CSS, Zustand, Dexie, vite-plugin-pwa, Lucide, date-fns locked in.
- [x] **Phase 1 — Project Scaffolding & Design System**: Custom token system, Space Grotesk/Inter/IBM Plex Mono fonts, AppShell responsive sidebar/tab bar.
- [x] **Phase 2 — Data Layer & Persistent Storage**: Dexie IndexedDB + Zustand store, recurring task engine, habit streak calculator, DB seeding & debug panel.
- [x] **Phase 3 — Task Creation & Editing**: Slide-over panel editor with priority selector, date/time chips, category hash color autocomplete, estimate chips, recurring controls, subtasks, delete confirmation.
- [x] **Phase 4 — Today, Upcoming, and Inbox Views**: Overdue section, Today tasks, Habits with ring checkboxes, Upcoming date headers, Inbox fast capture & inline triage.
- [x] **Phase 5 — Plan My Day**: Ledger schedule sheet, priority dots, monospace time estimates, inline check completion, segmented progress bar.
- [x] **Phase 6 — Habits Management**: Dedicated Habits CRUD view, streak indicators, category chips, habits vs tasks explanation banner.
- [x] **Phase 7 — Search, Filters, and All Tasks**: Live search title & notes, composed priority multi-select, category selector, status filter, category groupings.
- [x] **Phase 8 — PWA: Installability & Offline Support**: Web app manifest, service worker precaching static assets & Google Web Fonts.
- [x] **Phase 9 — Polish, Accessibility, Responsive QA**: Keyboard navigation (`Tab`, `Esc`, `Enter`), ARIA roles, toast notification system, 320px–1024px+ layout audit.
- [x] **Phase 10 — Calendar View**: Interactive month grid with priority indicator dots & date agenda side panel.

---

## 📄 License

MIT License. Designed for personal productivity.
