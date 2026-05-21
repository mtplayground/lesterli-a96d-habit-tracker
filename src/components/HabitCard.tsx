import type { ReactNode } from 'react'

import { useHabitStore } from '../stores/habitStore'
import type { DateKey, Habit } from '../types/habit'
import { today } from '../utils/date'

export interface HabitCardProps {
  habit: Habit
  streakBadge?: ReactNode
  todayKey?: DateKey
}

export function HabitCard({ habit, streakBadge, todayKey }: HabitCardProps) {
  const dateKey = todayKey ?? today()
  const storedHabit = useHabitStore((state) =>
    state.habits.find(({ id }) => id === habit.id),
  )
  const checkIns = useHabitStore((state) => state.checkIns)
  const toggleCheckIn = useHabitStore((state) => state.toggleCheckIn)
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)
  const currentHabit = storedHabit ?? habit
  const isArchived = currentHabit.archivedAt !== null
  const isCheckedToday = checkIns.some(
    (checkIn) =>
      checkIn.habitId === currentHabit.id && checkIn.dateKey === dateKey,
  )

  return (
    <article className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-label={`${currentHabit.name} color`}
              className="h-4 w-4 shrink-0 rounded-full border border-line"
              style={{ backgroundColor: currentHabit.color }}
            />
            <h2 className="truncate text-lg font-semibold text-ink">
              {currentHabit.name}
            </h2>
          </div>
          {currentHabit.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">
              {currentHabit.description}
            </p>
          ) : null}
        </div>

        <details className="relative shrink-0">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-line text-xl leading-none text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand">
            <span className="sr-only">Actions for {currentHabit.name}</span>⋯
          </summary>
          <div
            className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-line bg-surface-raised p-1 shadow-soft"
            role="menu"
          >
            <button
              className="w-full rounded px-3 py-2 text-left text-sm font-medium text-ink hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
              onClick={() => archiveHabit(currentHabit.id)}
              role="menuitem"
              type="button"
            >
              Archive
            </button>
            <button
              className="w-full rounded px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => deleteHabit(currentHabit.id)}
              role="menuitem"
              type="button"
            >
              Delete
            </button>
          </div>
        </details>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          aria-pressed={isCheckedToday}
          className="rounded-md border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:border-line disabled:text-ink-soft disabled:hover:bg-transparent data-[checked=true]:bg-brand data-[checked=true]:text-white"
          data-checked={isCheckedToday}
          disabled={isArchived}
          onClick={() => toggleCheckIn(currentHabit.id, dateKey)}
          type="button"
        >
          {isCheckedToday ? 'Checked today' : 'Check in today'}
        </button>

        <div className="min-h-8" aria-label="Streak">
          {streakBadge}
        </div>
      </div>

      {isArchived ? (
        <p className="mt-4 text-xs font-semibold uppercase text-ink-soft">
          Archived
        </p>
      ) : null}
    </article>
  )
}
