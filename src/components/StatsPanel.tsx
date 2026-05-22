import { useMemo } from 'react'

import { useHabitStore } from '../stores/habitStore'
import type { DateKey, HabitId } from '../types/habit'
import { today } from '../utils/date'
import { computeStats, statsWindows } from '../utils/stats'

export interface StatsPanelProps {
  habitId: HabitId
  todayKey?: DateKey
}

const formatCompletionRate = (completionRate: number) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    style: 'percent',
  }).format(completionRate)

export function StatsPanel({ habitId, todayKey }: StatsPanelProps) {
  const currentDateKey = todayKey ?? today()
  const checkIns = useHabitStore((state) => state.checkIns)
  const stats = useMemo(
    () =>
      computeStats(
        checkIns.filter((checkIn) => checkIn.habitId === habitId),
        currentDateKey,
      ),
    [checkIns, currentDateKey, habitId],
  )

  return (
    <section
      aria-label="Habit stats"
      className="mt-5 border-t border-line pt-4"
    >
      <h3 className="text-xs font-semibold uppercase text-ink-soft">Stats</h3>
      <dl className="mt-3 grid grid-cols-3 gap-4">
        {statsWindows.map((window) => {
          const windowStats = stats[window]

          return (
            <div className="min-w-0" key={window}>
              <dt className="text-xs font-medium text-ink-muted">
                {window} days
              </dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {windowStats.completedDays} / {windowStats.totalDays}
              </dd>
              <dd className="text-xs font-medium text-ink-soft">
                {formatCompletionRate(windowStats.completionRate)} complete
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
