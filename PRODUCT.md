# Product Contract

## What This Is

Habit Tracker is a local-first habit tracking app built with Vite, React,
TypeScript, Tailwind CSS, Zustand, date-fns, and react-router. It is a static
single-page app: all habit data is stored in browser `localStorage`, and the
production build can be served from any static host with an SPA fallback to
`index.html`.

## Current Capabilities

- Dashboard route `/` lists active habits, exposes import/export controls, and
  links to habit creation.
- Create habits at `/habits/new`; successful creation returns to the dashboard.
- View and manage a single habit at `/habits/:id`, including edit form,
  heatmap, stats, archive/restore, and delete.
- Persist habits and check-ins in browser `localStorage` through a versioned
  Zustand store.
- Archive, restore, and delete habits; deleting a habit also deletes its
  check-ins.
- Toggle today's check-in and toggle past/today heatmap cells; future heatmap
  dates are disabled.
- Render a trailing 365-day calendar heatmap using `react-calendar-heatmap`;
  checked cells use the habit color, empty cells use the app muted surface, and
  tooltips show formatted date plus completion status.
- Show current/longest streaks and 30, 90, and 365 day completion stats.
- Export `{schemaVersion, habits, checkIns}` as
  `habit-tracker-export-YYYYMMDD.json`.
- Import JSON with validation, schema-version checks, and merge-or-replace
  confirmation before applying data.
- Provide accessible focus states, keyboard-operable toggles/heatmap cells, and
  Escape-cancel confirmation dialogs.

## Architecture

- `src/types/habit.ts` defines the persisted schema: `Habit`, `CheckIn`, date
  keys, IDs, and schema version.
- `src/stores/habitStore.ts` owns all habit and check-in mutations and persists
  only schema version, habits, and check-ins. Import logic applies validated
  payloads through store actions.
- `src/router.tsx` defines routes for `/`, `/habits/new`, `/habits/:id`, and a
  404 fallback; page components live under `src/pages`.
- Date, streak, stats, and import/export logic lives in pure utility modules
  under `src/utils` with focused tests.
- Components under `src/components` hold reusable UI and store-backed behavior:
  forms, habit cards/lists, check-in toggle, heatmap, stats, import/export, and
  confirmation dialogs.
- Styling uses Tailwind classes plus CSS custom properties defined in
  `src/index.css`; app palette values can be overridden with Vite environment
  variables in `src/App.tsx`.

## Conventions

- Dates are stored as local `yyyy-MM-dd` date keys.
- Check-ins are unique by habit/date at the store action level: toggling an
  existing date removes it, otherwise it creates a check-in.
- Stats and streak calculations ignore invalid and future date keys.
- Import files must match the current schema version and include valid habit and
  check-in records.
- Tests use Vitest/React Testing Library for units and components, plus
  Playwright for happy-path and axe accessibility E2E coverage.
- Verification commands are `npm run format`, `npm run lint`, `npm test`,
  `npm run build`, and `npm run test:e2e`.
