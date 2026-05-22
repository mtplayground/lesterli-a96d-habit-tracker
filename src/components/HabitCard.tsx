import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { useHabitStore } from '../stores/habitStore'
import type { DateKey, Habit } from '../types/habit'
import { today } from '../utils/date'
import { computeStreaks } from '../utils/streaks'
import { CheckInToggle } from './CheckInToggle'
import { ConfirmDialog } from './ConfirmDialog'
import { StatsPanel } from './StatsPanel'
import { StreakBadge } from './StreakBadge'

export interface HabitCardProps {
  habit: Habit
  streakBadge?: ReactNode
  todayKey?: DateKey
}

export function HabitCard({ habit, streakBadge, todayKey }: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const storedHabit = useHabitStore((state) =>
    state.habits.find(({ id }) => id === habit.id),
  )
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const restoreHabit = useHabitStore((state) => state.restoreHabit)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)
  const checkIns = useHabitStore((state) => state.checkIns)
  const currentHabit = storedHabit ?? habit
  const isArchived = currentHabit.archivedAt !== null
  const currentDateKey = todayKey ?? today()
  const streaks = useMemo(
    () =>
      computeStreaks(
        checkIns.filter((checkIn) => checkIn.habitId === currentHabit.id),
        currentDateKey,
      ),
    [checkIns, currentDateKey, currentHabit.id],
  )

  return (
    <article className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-label={`${currentHabit.name} color`}
              className="h-4 w-4 shrink-0 rounded-full border border-line"
              role="img"
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
            {isArchived ? (
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-medium text-ink hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
                onClick={() => restoreHabit(currentHabit.id)}
                role="menuitem"
                type="button"
              >
                Restore
              </button>
            ) : (
              <button
                className="w-full rounded px-3 py-2 text-left text-sm font-medium text-ink hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
                onClick={() => archiveHabit(currentHabit.id)}
                role="menuitem"
                type="button"
              >
                Archive
              </button>
            )}
            <button
              className="w-full rounded px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => setIsConfirmingDelete(true)}
              role="menuitem"
              type="button"
            >
              Delete
            </button>
          </div>
        </details>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <CheckInToggle
          disabled={isArchived}
          habitId={currentHabit.id}
          todayKey={currentDateKey}
        />

        <div className="min-h-8" aria-label="Streak">
          {streakBadge ?? (
            <StreakBadge current={streaks.current} longest={streaks.longest} />
          )}
        </div>
      </div>

      <StatsPanel habitId={currentHabit.id} todayKey={currentDateKey} />

      {isArchived ? (
        <p className="mt-4 text-xs font-semibold uppercase text-ink-soft">
          Archived
        </p>
      ) : null}

      {isConfirmingDelete ? (
        <ConfirmDialog
          confirmLabel="Delete habit"
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={() => {
            deleteHabit(currentHabit.id)
            setIsConfirmingDelete(false)
          }}
          title={`Delete ${currentHabit.name}?`}
          variant="danger"
        >
          This removes the habit and all of its check-ins.
        </ConfirmDialog>
      ) : null}
    </article>
  )
}
