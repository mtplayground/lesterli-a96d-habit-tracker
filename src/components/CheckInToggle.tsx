import { useHabitStore } from '../stores/habitStore'
import type { DateKey, HabitId } from '../types/habit'
import { today } from '../utils/date'

export interface CheckInToggleProps {
  disabled?: boolean
  habitId: HabitId
  todayKey?: DateKey
}

export function CheckInToggle({
  disabled = false,
  habitId,
  todayKey,
}: CheckInToggleProps) {
  const dateKey = todayKey ?? today()
  const isChecked = useHabitStore((state) =>
    state.checkIns.some(
      (checkIn) => checkIn.habitId === habitId && checkIn.dateKey === dateKey,
    ),
  )
  const toggleCheckIn = useHabitStore((state) => state.toggleCheckIn)

  return (
    <button
      aria-pressed={isChecked}
      className="rounded-md border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:border-line disabled:text-ink-soft disabled:hover:bg-transparent data-[checked=true]:bg-brand data-[checked=true]:text-white"
      data-checked={isChecked}
      disabled={disabled}
      onClick={() => toggleCheckIn(habitId, dateKey)}
      type="button"
    >
      {isChecked ? 'Checked today' : 'Check in today'}
    </button>
  )
}
