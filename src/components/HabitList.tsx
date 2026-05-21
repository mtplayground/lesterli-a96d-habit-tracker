import { useState } from 'react'
import type { ReactNode } from 'react'

import { useHabitStore } from '../stores/habitStore'
import type { DateKey, Habit } from '../types/habit'
import { EmptyState } from './EmptyState'
import { HabitCard } from './HabitCard'

export interface HabitListProps {
  onCreateHabit?: () => void
  renderHabitDetails?: (habit: Habit) => ReactNode
  renderStreakBadge?: (habit: Habit) => ReactNode
  todayKey?: DateKey
}

export function HabitList({
  onCreateHabit,
  renderHabitDetails,
  renderStreakBadge,
  todayKey,
}: HabitListProps) {
  const [showArchived, setShowArchived] = useState(false)
  const habits = useHabitStore((state) => state.habits)
  const activeHabits = habits.filter((habit) => habit.archivedAt === null)
  const visibleHabits = showArchived ? habits : activeHabits
  const hasArchivedHabits = habits.length > activeHabits.length

  return (
    <section className="space-y-5" aria-labelledby="habit-list-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="habit-list-title" className="text-2xl font-semibold text-ink">
            Habits
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {activeHabits.length} active · {habits.length} total
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            checked={showArchived}
            className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
            disabled={!hasArchivedHabits}
            onChange={(event) => setShowArchived(event.target.checked)}
            type="checkbox"
          />
          Show archived habits
        </label>
      </div>

      {visibleHabits.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {visibleHabits.map((habit) => (
            <li className="space-y-3" key={habit.id}>
              <HabitCard
                habit={habit}
                streakBadge={renderStreakBadge?.(habit)}
                todayKey={todayKey}
              />
              {renderHabitDetails?.(habit)}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          actionLabel="Create first habit"
          message={
            habits.length === 0
              ? 'Start by creating a habit you want to track every day.'
              : 'Archived habits are hidden. Show archived habits to review them.'
          }
          onAction={onCreateHabit}
          title={habits.length === 0 ? 'No habits yet' : 'No active habits'}
        />
      )}
    </section>
  )
}
