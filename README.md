# Taskly — Personal Productivity & To-Do Manager

Taskly is a local-first, offline-ready personal productivity web application built with **React 18**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Dexie.js** (IndexedDB). Designed with a modern visual identity featuring **Geist & Geist Mono typography**, a **Custom Light/Dark theme switcher**, **PIN password protection**, pill controls, smooth micro-interactions, and signature priority visual indicators.

![Taskly Logo](public/logo.png)

---

## 🎨 Visual Identity & Key Features

- **Custom Light/Dark Theme Switcher**: Sleek toggle button replacing standard system options with a smooth animated sliding indicator and custom dark theme token palette (`#0C0E12`).
- **PIN Password Protection**: Secure PIN lock screen protecting personal tasks and habits (Default PIN: `2506`). The PIN code is strictly enforced in state and never rendered in the UI.
- **Data Safety Net & Auto-Backups**:
  - **Manual JSON Export / Import**: Downloads a single `taskly-backup-YYYY-MM-DD.json` file containing all tasks, habits, and logs; allows full 1-click restore anytime.
  - **Automatic Rotating Local Snapshots**: Automatically records a snapshot of the last 5 write operations in a dedicated `db.backups` IndexedDB table (`version(2)`), allowing instant in-app recovery if browser data is cleared.
  - **Non-Destructive Dexie Versioning**: Dexie database schemas use explicit version upgrade migration history (`version(1)` → `version(2)`), preserving existing tables without recreate drops.
- **Categories View Page**: Dedicated category dashboard rendering tasks grouped by category domain with total counts, completion progress bars, and domain filtering.
- **Geist Typography Engine**: Uses **Geist Sans** for sleek display & body copy and **Geist Mono** for all numerical data (due dates, times, estimates, subtask progress, streak tallies, task counts).
- **Offline-First IndexedDB Storage**: Persists all tasks, habits, and completion logs in local IndexedDB via `Dexie.js` wrapped in a reactive `Zustand` store — functions cleanly with zero network connection.
- **8 Core Workflow Views**:
  - **Today**: Overdue tasks section (urgent pulse highlight), Today's scheduled tasks (sorted by priority & time), and Daily Habits section.
  - **Upcoming**: Tasks grouped under date headers (Tomorrow, upcoming weekdays) with a consolidated **"Later" bucket** for tasks scheduled past 14 days.
  - **Inbox**: Fast-capture top input banner for rapid capture plus inline one-tap triage buttons (`Today`, `Tomorrow`, and **`Pick date`** picker).
  - **Plan My Day**: Schedule sheet layout featuring priority indicator dots, title, monospace estimate tags, inline check completion, and a segmented progress bar (fully responsive on mobile).
  - **Categories**: Dedicated category cards with completion progress bars and domain breakdown.
  - **Habits & Routines**: Dedicated habit template manager displaying current consecutive day streaks, priority bars, category chips, and explanatory guidance.
  - **All Tasks & Archive**: Live multi-field search (title & notes), composed priority multi-select chips, category selector, status filter (All/Pending/Completed), and category groupings.
  - **Calendar**: Interactive month grid layout with priority-colored dots and a day agenda side panel for date-specific task management.
- **Recurring Task Engine**: Automatically schedules the next instance (`daily`, `weekly`, `monthly`) when a recurring task is completed, preserving complete task completion history.
- **Pure Function Streak Calculation**: Computes habit streaks accurately from historical `HabitLogEntry` records, correctly handling unfinished "today" states.
- **PWA & Offline Installation**: Scaffolded with `vite-plugin-pwa` and Workbox service worker caching for offline asset loading, manifest web app settings, and mobile home screen installation.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript, scaffolded with Vite
- **Styling**: Tailwind CSS with custom CSS variable tokens (`var(--bg)`, `var(--surface)`, `var(--ink)`, `var(--accent)`, priority scale)
- **Typography**: Geist Sans & Geist Mono (via Google Fonts)
- **State Management**: Zustand
- **Database**: IndexedDB via Dexie.js (`Dexie` + `dexie-react-hooks`)
- **PWA**: `vite-plugin-pwa` (Workbox)
- **Icons**: `lucide-react`
- **Date Utilities**: `date-fns`

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

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production and preview PWA capabilities:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the [LICENSE](LICENSE) file for full details.

Copyright (c) 2026 Swayam Mandhani
