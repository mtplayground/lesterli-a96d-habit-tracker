# Product Contract

## What This Is

Habit Tracker is a local-first habit tracking app built with Vite, React,
TypeScript, Tailwind CSS, Zustand, and date-fns. The current root app still
renders a simple branded shell, while the merged codebase contains the core
habit data model, local persistence, and reusable tracking components that will
compose the full product experience.

## Current Capabilities

- Create and edit habits with a name, optional description, and selectable
  color.
- Persist habits and check-ins in browser `localStorage` through a versioned
  Zustand store.
- Archive, restore, and delete habits; deleting a habit also deletes its
  check-ins.
- Toggle today's check-in and toggle past/today heatmap cells; future heatmap
  dates are disabled.
- Render habit cards with actions, check-in state, current/longest streaks, and
  completion stats.
- Render a trailing 365-day calendar heatmap using `react-calendar-heatmap`;
  checked cells use the habit color, empty cells use the app muted surface, and
  tooltips show formatted date plus completion status.
- Show stats for 30, 90, and 365 day windows as completed days and completion
  rate.

## Architecture

- `src/types/habit.ts` defines the persisted schema: `Habit`, `CheckIn`, date
  keys, IDs, and schema version.
- `src/stores/habitStore.ts` owns all habit and check-in mutations and persists
  only schema version, habits, and check-ins.
- Date, streak, and stats logic lives in pure utility modules under `src/utils`
  with focused tests.
- Components under `src/components` are reusable and store-backed where useful:
  `HabitForm`, `HabitList`, `HabitCard`, `CheckInToggle`, `HeatmapCalendar`,
  `HeatmapCell`, `StreakBadge`, and `StatsPanel`.
- Styling uses Tailwind classes plus CSS custom properties defined in
  `src/index.css`; app palette values can be overridden with Vite environment
  variables in `src/App.tsx`.

## Conventions

- Dates are stored as local `yyyy-MM-dd` date keys.
- Check-ins are unique by habit/date at the store action level: toggling an
  existing date removes it, otherwise it creates a check-in.
- Stats and streak calculations ignore invalid and future date keys.
- Tests use Vitest and React Testing Library, with explicit store reset and
  cleanup in component tests.
- Verification commands are `npm run format`, `npm run lint`, `npm test`, and
  `npm run build`.
