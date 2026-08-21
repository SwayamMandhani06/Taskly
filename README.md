# Taskly — Personal Productivity & To-Do Manager

Taskly is a local-first, offline-ready personal productivity web application built with **React 18**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Dexie.js** (IndexedDB). Designed with a modern, high-contrast visual identity featuring **Geist & Geist Mono typography**, **Light/Dark/System theme switcher**, pill controls, smooth micro-interactions, and signature priority visual indicators.

![Taskly Logo](public/favicon.svg)

---

## 🎨 Visual Identity & Key Features

- **Geist Typography Engine**: Uses **Geist Sans** for sleek display & body copy and **Geist Mono** for all numerical ledger data (due dates, times, estimates, subtask progress, streak tallies, task counts).
- **Dark / Light / System Mode Engine**: Fully customized dark mode with deep dark charcoal backgrounds (`#0C0E12`), tuned priority contrast scales, glowing accent hues (`#635BFF`), and persistent user preference state.
- **Offline-First IndexedDB Storage**: Persists all tasks, habits, and completion logs in local IndexedDB via `Dexie.js` wrapped in a reactive `Zustand` store — functions cleanly with zero network connection.
- **7 Core Workflow Views**:
  - **Today**: Overdue tasks section (urgent pulse highlight), Today's scheduled tasks (sorted by priority & time), and Daily Habits section.
  - **Upcoming**: Tasks grouped under date headers (Tomorrow, upcoming weekdays) with a consolidated **"Later" bucket** for tasks scheduled past 14 days.
  - **Inbox**: Fast-capture top input banner for rapid capture plus inline one-tap triage buttons (`Today`, `Tomorrow`, and **`Pick date`** picker).
  - **Plan My Day**: Ledger schedule sheet layout featuring priority indicator dots, title, monospace estimate tags, inline check completion, and a segmented ledger-tally progress bar.
  - **Habits & Routines**: Dedicated habit template manager displaying current consecutive day streaks, priority bars, category chips, and explanatory guidance.
  - **All Tasks & Archive**: Live multi-field search (title & notes), composed priority multi-select chips, category selector, status filter (All/Pending/Completed), and category groupings.
  - **Calendar**: Interactive month grid layout with priority-colored dots and a day agenda side panel for date-specific task management.
- **Recurring Task Engine**: Automatically schedules the next instance (`daily`, `weekly`, `monthly`) when a recurring task is completed, preserving complete task completion history.
- **Pure Function Streak Calculation**: Computes habit streaks accurately from historical `HabitLogEntry` records, correctly handling unfinished "today" states.
- **PWA & Offline Installation**: Scaffolded with `vite-plugin-pwa` and Workbox service worker caching for offline asset loading, manifest web app settings, and mobile home screen installation.
- **Micro-Interactions & Motion Accessibility**: Soft colored card shadows, hover elevation (`hover:-translate-y-0.5`), active press feedback (`active:scale-[0.97]`), and strict `@media (prefers-reduced-motion: reduce)` accessibility overrides.

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
