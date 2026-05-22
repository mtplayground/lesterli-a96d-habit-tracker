import { Link, useNavigate } from 'react-router-dom'

import { ExportButton } from '../components/ExportButton'
import { HabitList } from '../components/HabitList'
import { HeatmapCalendar } from '../components/HeatmapCalendar'
import { ImportControl } from '../components/ImportControl'
import { StreakBadge } from '../components/StreakBadge'
import { useHabitStore } from '../stores/habitStore'
import type { Habit } from '../types/habit'
import { today } from '../utils/date'
import { computeStreaks } from '../utils/streaks'

export function DashboardPage() {
  const navigate = useNavigate()
  const currentDateKey = today()
  const checkIns = useHabitStore((state) => state.checkIns)

  const renderStreakBadge = (habit: Habit) => {
    const streaks = computeStreaks(
      checkIns.filter((checkIn) => checkIn.habitId === habit.id),
      currentDateKey,
    )

    return <StreakBadge current={streaks.current} longest={streaks.longest} />
  }

  return (
    <div className="space-y-8">
      <section
        className="flex flex-wrap items-start justify-between gap-4"
        aria-labelledby="dashboard-title"
      >
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase text-brand">Dashboard</p>
          <h1 id="dashboard-title" className="text-3xl font-semibold text-ink">
            Your habits
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink-muted">
            Review your active habits, check in for today, and track your
            progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ImportControl />
          <ExportButton />
          <Link
            className="inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
            to="/habits/new"
          >
            New habit
          </Link>
        </div>
      </section>

      <HabitList
        onCreateHabit={() => navigate('/habits/new')}
        renderHabitDetails={(habit) => (
          <HeatmapCalendar habit={habit} todayKey={currentDateKey} />
        )}
        renderStreakBadge={renderStreakBadge}
        todayKey={currentDateKey}
      />
    </div>
  )
}
