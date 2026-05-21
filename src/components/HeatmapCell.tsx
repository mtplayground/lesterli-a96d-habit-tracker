import { useHabitStore } from '../stores/habitStore'
import type { DateKey, HabitId } from '../types/habit'
import { today } from '../utils/date'

export interface HeatmapCellProps {
  color?: string
  dateKey: DateKey
  habitId: HabitId
  todayKey?: DateKey
}

export function HeatmapCell({
  color = '#28705c',
  dateKey,
  habitId,
  todayKey,
}: HeatmapCellProps) {
  const currentDateKey = todayKey ?? today()
  const isFuture = dateKey > currentDateKey
  const isChecked = useHabitStore((state) =>
    state.checkIns.some(
      (checkIn) => checkIn.habitId === habitId && checkIn.dateKey === dateKey,
    ),
  )
  const toggleCheckIn = useHabitStore((state) => state.toggleCheckIn)
  const actionLabel = isChecked ? 'Remove check-in' : 'Add check-in'

  return (
    <button
      aria-label={`${actionLabel} for ${dateKey}`}
      aria-pressed={isChecked}
      className="h-4 w-4 rounded-sm border border-line transition focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-40"
      disabled={isFuture}
      onClick={() => toggleCheckIn(habitId, dateKey)}
      style={{
        backgroundColor: isChecked ? color : 'var(--color-surface-muted)',
      }}
      title={
        isFuture ? `${dateKey} is in the future` : `${actionLabel}: ${dateKey}`
      }
      type="button"
    />
  )
}
