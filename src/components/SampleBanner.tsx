import { useHabitStore } from '../stores/habitStore'
import { SEED_PREFIX } from '../stores/seed'
import { SchemaVersion } from '../types/habit'

const emptyHabitState = {
  schemaVersion: SchemaVersion,
  habits: [],
  checkIns: [],
}

export function SampleBanner() {
  const habits = useHabitStore((state) => state.habits)
  const importHabitState = useHabitStore((state) => state.importHabitState)
  const hasSampleData = habits.some((habit) => habit.id.startsWith(SEED_PREFIX))

  if (!hasSampleData) {
    return null
  }

  return (
    <aside
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm"
      aria-label="Sample data notice"
    >
      <p className="text-sm font-semibold">
        👋 This is sample data — here's what sticking with it looks like.
      </p>
      <button
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50"
        onClick={() => importHabitState(emptyHabitState, 'replace')}
        type="button"
      >
        Clear &amp; start mine
      </button>
    </aside>
  )
}
