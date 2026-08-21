# Personal To-Do Manager — Phase-Wise Build Prompts for Antigravity

How to use this: run these prompts **in order**, one phase per session (or one after another if Antigravity handles it well in one go). Each prompt is self-contained but assumes the previous phases are already built — paste them as-is. Don't skip Phase 1; it locks in the design system so every later phase stays visually consistent instead of drifting toward a generic template look.

---

## Phase 0 — Tech Stack Brief (context, not a prompt)

Give Antigravity this stack up front so it doesn't default to something PWA-unfriendly:

- **Framework**: React + TypeScript, scaffolded with Vite
- **Styling**: Tailwind CSS with a custom token config (no default theme colors used)
- **State**: Zustand (simple, no boilerplate, works well with persistence middleware)
- **Storage**: IndexedDB via `idb` or `Dexie.js` — not localStorage, so it scales past small string limits and works offline
- **PWA**: `vite-plugin-pwa` (Workbox under the hood) for manifest + service worker
- **Icons**: `lucide-react`
- **Dates**: `date-fns`

---

## Phase 1 — Project Scaffolding & Design System

```
Set up a new Vite + React + TypeScript project for a personal productivity/to-do app.
Install and configure Tailwind CSS, lucide-react, date-fns, and zustand.

Do NOT write any features yet. This phase only establishes the design system and
app shell. No emojis anywhere — use lucide-react icons for all visual markers.
Avoid generic AI-app defaults (no cream background + terracotta accent, no dark
mode with neon green/purple, no default Tailwind indigo-500 everywhere). The goal
is a calm, professional, ledger/planner aesthetic — something a designer would
charge for, not a template.

Design tokens to implement as CSS custom properties (in a tailwind.config.ts
theme.extend, referencing CSS variables so they're easy to retheme later):

Colors:
- --bg: soft cool paper grey, near #ECEEE8 (not warm cream)
- --surface: #FFFFFF, --surface-2: #F5F6F0 (secondary panels)
- --ink: near-black ink, #1E2320; --ink-soft: #6B716B for secondary text
- --border: #DCDFD5 (hairline borders, no heavy drop shadows)
- --accent: an indigo-violet, #4B4FE0, used ONLY for primary actions/focus states
- Priority scale (functional, not decorative — must be instantly scannable):
  --urgent: #E0483E, --high: #E8963C, --medium: #D9A62E, --low: #4FA876
  (each with a soft background tint version for chips/badges)

Typography:
- Display/headings: Space Grotesk (geometric, distinctive)
- Body: Inter
- Utility/numeric (dates, times, counts, estimates): IBM Plex Mono — used
  specifically for anything numeric so the app reads like a ledger, not a
  generic dashboard
- Load via Google Fonts, self-host or @font-face if possible for offline PWA use

Layout:
- Desktop: fixed left sidebar (approx 240px) with nav icons + labels:
  Today, Upcoming, Inbox, Plan My Day, Habits, All Tasks. Main content area
  to the right with generous padding (not edge-to-edge).
- Mobile (<768px): sidebar collapses into a fixed bottom tab bar with icons
  only, 5-6 items, safe-area padding for notched phones.
- Build a responsive AppShell component now with placeholder empty states
  for each of the 6 views (just a heading + "Nothing here yet" message,
  written in plain direct language, no filler copy).

Signature visual element: every task/habit row has a thin vertical color bar
on its left edge indicating priority (this is the primary way priority is
communicated — not badges everywhere). Keep everything else quiet: minimal
shadows, 1px borders, generous whitespace, restrained use of the accent color.

Deliverable: a running app with working navigation between 6 empty views,
fully responsive, using only the token system above (no ad-hoc hex codes
in components). Add a visible focus ring on all interactive elements for
keyboard accessibility.
```

---

## Phase 2 — Data Layer & Persistent Storage

```
Add a local-first data layer using IndexedDB (via Dexie.js) wrapped in a
Zustand store, so all data survives refresh and works fully offline.

Define these TypeScript types and Dexie tables:

Task {
  id: string
  title: string
  notes?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string        // YYYY-MM-DD, local date, no time-zone drift
  dueTime?: string        // HH:mm, optional
  category?: string
  subtasks: { id: string; text: string; done: boolean }[]
  recurring: 'none' | 'daily' | 'weekly' | 'monthly'
  estimateMinutes?: number
  completed: boolean
  completedAt?: number
  createdAt: number
}

Habit {
  id: string
  title: string
  category?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimateMinutes?: number
  createdAt: number
}

HabitLog: keyed by date string -> { [habitId: string]: boolean }
  (one row per day, tracks which habits were completed that day)

Category: just derived from distinct strings used across tasks/habits —
no separate table needed. Write a helper that deterministically maps a
category name to one of 8 predefined accent colors (hash the string, index
into the palette) so the same category always renders the same color.

Build the Zustand store with actions: addTask, updateTask, deleteTask,
toggleTaskComplete, addHabit, updateHabit, deleteHabit, toggleHabitToday,
and selectors for: tasks due today, overdue tasks, tasks in a date range,
inbox tasks (no dueDate), all distinct categories in use.

Recurring task logic: when a task with recurring != 'none' is marked
complete, do NOT just check it off — mark the current instance completed,
then create a new task with the same fields but a new id, completed:false,
and dueDate advanced by the recurring interval (daily +1 day, weekly +7 days,
monthly +1 calendar month). This keeps a clean completion history instead
of an endlessly-mutating single task.

Streak logic: write a pure function that computes a habit's current streak
(consecutive days completed, counting backwards from today; if today isn't
done yet, count backwards from yesterday so an unfinished "today" doesn't
zero out the streak).

Seed the database with a few example tasks and habits on first load only
(check an "initialized" flag) so the app isn't empty on first run.

Deliverable: fully working data layer, verifiable via a temporary debug
panel that lists raw store contents, before wiring up real UI.
```

---

## Phase 3 — Task Creation & Editing

```
Build the task editor as a slide-over panel (desktop) / full-screen sheet
(mobile), not a small centered modal — this app will be used one-handed on
a phone often, so touch targets need room.

Fields, in this order:
1. Title (autofocused text input, required)
2. Notes (expandable textarea, optional, collapsed by default)
3. Priority — four buttons in a row (Low/Medium/High/Urgent), colored per
   the token system from Phase 1, selected state clearly distinct from
   unselected (not just a color change — add a filled background + check)
4. Due date + time — a date picker plus quick-select chips: Today,
   Tomorrow, Next Week, No Date. Time is optional and only shown once a
   date is picked.
5. Category — text input with autocomplete suggestions drawn from existing
   categories in use; typing a new one creates it inline. Show the
   category's assigned color as a small dot next to the input.
6. Time estimate — number input in minutes, with quick chips (15/30/45/
   60/90/120)
7. Recurring — segmented control: None / Daily / Weekly / Monthly
8. Subtasks — a checklist builder: text input + "Add" that appends rows,
   each row has a checkbox, editable text, and a delete icon. Support
   reordering is a nice-to-have, not required.

Footer actions: Save (primary, accent color), Cancel, and Delete (only
when editing an existing task, styled as a quiet destructive action —
text-only in the urgent color, not a filled red button, with a confirm
step before it actually deletes).

Wire this editor up to the Zustand store's addTask/updateTask/deleteTask
actions. Support opening it in "create" mode (all fields empty, defaults:
medium priority, no date) and "edit" mode (prefilled).

Deliverable: a floating action button (bottom-right on mobile, top-right
on desktop) that opens the editor in create mode from anywhere in the app.
```

---

## Phase 4 — Today, Upcoming, and Inbox Views

```
Build the three core list views, all reusing a shared TaskRow component
(checkbox, left priority-color bar, title, category chip, due date/time
in monospace, subtask progress like "2/4", recurring icon if applicable).
Tapping a row opens the Phase 3 editor in edit mode. Tapping the checkbox
toggles completion without opening the editor (stop event propagation).

Today view:
- Section 1: "Overdue" — any incomplete task with dueDate before today.
  Make this visually impossible to miss: urgent-color left border on the
  section itself, due date text in the urgent color, sits above everything
  else on the page.
- Section 2: "Today" — tasks due today, sorted by priority descending
  then by due time.
- Section 3: "Habits" — every habit, rendered with a distinct row style
  (a filled/outline ring checkbox instead of a square checkbox, since
  habits aren't "completed forever," just checked for today) plus a small
  streak indicator (a number with a subtle icon, not a badge that competes
  with priority color).
- Empty state per section when nothing qualifies, written as a direct,
  useful sentence — not a joke, not filler.

Upcoming view:
- Tasks with dueDate after today, grouped under date headers (Tomorrow,
  then actual weekday + date for the next ~14 days, then a final "Later"
  group for anything beyond that window).
- Collapsible group headers, default expanded.

Inbox view:
- Tasks with no dueDate at all.
- A persistent quick-add input pinned to the top of this view specifically
  (type a title, hit Enter, task is created directly into the inbox with
  no date/category — for fast capture without deciding details yet).
- Each row gets inline triage actions: "Today," "Tomorrow," "Pick date"
  (opens a small date picker), so clearing the inbox doesn't require
  opening the full editor every time.

Deliverable: all three views fully functional against real store data,
responsive on mobile and desktop.
```

---

## Phase 5 — Plan My Day

```
Build a "Plan My Day" view styled like a ledger/schedule sheet rather than
a generic list.

Pull together: overdue tasks, today's tasks, and today's habits into one
combined, sorted list (priority descending, then by time estimate
descending as a tiebreaker).

Render as a table-like layout (can be div-based, doesn't need a literal
<table>):
- Column 1: a small filled circle in the item's priority color
- Column 2: task/habit title
- Column 3: time estimate in monospace (e.g. "2h", "45m") — if missing,
  show a subtle dash, don't show "0m"
- Row itself: checkbox to mark complete inline, strikethrough + dimmed
  text once checked, but keep the row in place rather than removing it
  immediately (so the sense of progress through the list is visible)

Above the table: a progress summary — "6 / 8 completed" plus a horizontal
progress bar. Style the progress bar as a segmented ledger-tally bar
(distinct filled/unfilled segments) rather than a smooth generic gradient
bar, matching the app's ledger motif from Phase 1.

If the combined list is empty (nothing due today, no habits), show a clear
empty state pointing the user to the Inbox or Today view instead of a
blank page.

Deliverable: fully working Plan My Day view, checkbox actions update the
same underlying task/habit completion state used elsewhere in the app
(single source of truth — no separate "plan" data model).
```

---

## Phase 6 — Habits Management

```
Build a dedicated Habits view for managing the recurring daily habit
templates themselves (separate from just checking them off, which already
works from Phase 4/5).

List all habits with: title, category chip, priority color bar, current
streak (computed via the Phase 2 streak function), and today's
completion checkbox.

Support add/edit/delete via a simpler version of the Phase 3 editor
(title, category, priority, estimate only — no due date, no recurring
selector, no subtasks, since habits are inherently daily).

Add an empty state that explains what a habit is for versus a task
(a habit is something you do every day indefinitely; a task has an end).

Deliverable: full CRUD for habits, streaks computed correctly across
multiple days of use (test by manually inserting HabitLog rows for past
dates and confirming streak count).
```

---

## Phase 7 — Search, Filters, and All Tasks

```
Build an "All Tasks" view with:
- A search input filtering by title and notes text, live as you type
- Filter controls: priority (multi-select chips), category (dropdown of
  all categories in use), status (All / Pending / Completed)
- Results grouped by category (with a "No category" group for uncategorized
  tasks), each group collapsible and showing a count
- Completed tasks render with strikethrough title and dimmed color, sorted
  to the bottom of their group

Make sure filters compose correctly (e.g., searching "assignment" with
priority=high and status=pending only shows matches on all three
conditions).

Deliverable: fast, responsive filtering with no visible lag on a
reasonably sized task list (test with 100+ synthetic tasks).
```

---

## Phase 8 — PWA: Installability & Offline Support

```
Configure vite-plugin-pwa to make this a properly installable PWA:

- manifest.json: app name, short name, theme_color and background_color
  matching the design tokens from Phase 1 (not default black/white),
  icons at 192x192 and 512x512 (generate simple icon based on the app's
  left-priority-bar signature motif), display: "standalone",
  start_url and scope set correctly.
- Service worker via Workbox: precache the app shell, runtime-cache fonts,
  and make sure the app loads and is fully usable with no network
  connection (all data already lives in IndexedDB from Phase 2, so this
  should mostly be about caching static assets correctly).
- Add the appropriate <link rel="manifest"> and apple-touch-icon /
  theme-color meta tags to index.html for both Android "Add to Home
  Screen" and iOS Safari installability.
- Test: build for production, serve the build output, confirm Chrome
  DevTools > Application > Manifest shows no errors and the install
  prompt is available; confirm Lighthouse PWA audit passes.

Deliverable: production build that installs to a phone home screen and
functions offline after first load.
```

---

## Phase 9 — Polish, Accessibility, Responsive QA

```
Do a full polish pass across every view built so far:

- Keyboard navigation: every interactive element reachable via Tab, visible
  focus rings (already defined in Phase 1 tokens), Enter/Space activate
  buttons and checkboxes, Escape closes the task editor panel.
- Screen reader basics: proper landmark roles for sidebar/nav/main,
  aria-label on icon-only buttons (especially the mobile bottom nav),
  checkbox states announced correctly.
- Reduced motion: respect prefers-reduced-motion for any transitions
  (editor slide-in, progress bar fill, etc.) — the app should work with
  animations minimized to none.
- Responsive audit: check 320px width (small phone), 768px (tablet
  breakpoint), 1024px+ (desktop) — no horizontal scroll, no overlapping
  elements, touch targets at least 44x44px on mobile.
- Loading states: brief skeleton or spinner while IndexedDB reads resolve
  on first mount, so the UI never flashes an empty state before real data
  loads.
- Error states: if a storage write fails, show a small non-blocking toast
  rather than silently failing.

Deliverable: a visually consistent, accessible, fully responsive app
ready for daily personal use.
```

---

## Phase 10 — Calendar View (later / optional)

```
Add a Calendar view as a new sidebar/nav item: month grid, each day cell
shows a small colored dot per task due that day (dot color = priority),
plus a count if more than 3 tasks land on one day. Clicking a day opens a
side panel listing that day's tasks (reusing the TaskRow component from
Phase 4) with the ability to add a new task directly onto that date.
Keep it visually consistent with the existing design tokens — no new
color system introduced just for this view.
```
