import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '../components/ConfirmDialog'
import { HabitForm } from '../components/HabitForm'
import { HeatmapCalendar } from '../components/HeatmapCalendar'
import { StatsPanel } from '../components/StatsPanel'
import { useHabitStore } from '../stores/habitStore'
import { today } from '../utils/date'

export function HabitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const habit = useHabitStore((state) =>
    state.habits.find((candidate) => candidate.id === id),
  )
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const restoreHabit = useHabitStore((state) => state.restoreHabit)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)
  const currentDateKey = today()

  if (!habit) {
    return (
      <section className="space-y-4" aria-labelledby="habit-not-found-title">
        <Link
          className="inline-flex rounded-md text-sm font-semibold text-brand transition hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand"
          to="/"
        >
          Back to dashboard
        </Link>
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase text-brand">Habit detail</p>
          <h1
            id="habit-not-found-title"
            className="text-3xl font-semibold text-ink"
          >
            Habit not found
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink-muted">
            This habit may have been deleted or is not available on this device.
          </p>
        </div>
      </section>
    )
  }

  const isArchived = habit.archivedAt !== null

  const handleDelete = () => {
    deleteHabit(habit.id)
    navigate('/')
  }

  return (
    <div className="space-y-8">
      <Link
        className="inline-flex rounded-md text-sm font-semibold text-brand transition hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand"
        to="/"
      >
        Back to dashboard
      </Link>

      <section
        className="flex flex-wrap items-start justify-between gap-4"
        aria-labelledby="habit-detail-title"
      >
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-bold uppercase text-brand">Habit detail</p>
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-label={`${habit.name} color`}
              className="h-5 w-5 shrink-0 rounded-full border border-line"
              role="img"
              style={{ backgroundColor: habit.color }}
            />
            <h1
              id="habit-detail-title"
              className="truncate text-3xl font-semibold text-ink"
            >
              {habit.name}
            </h1>
          </div>
          {habit.description ? (
            <p className="max-w-2xl text-base leading-7 text-ink-muted">
              {habit.description}
            </p>
          ) : null}
          {isArchived ? (
            <p className="text-xs font-semibold uppercase text-ink-soft">
              Archived
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
            onClick={() =>
              isArchived ? restoreHabit(habit.id) : archiveHabit(habit.id)
            }
            type="button"
          >
            {isArchived ? 'Restore habit' : 'Archive habit'}
          </button>
          <button
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setIsConfirmingDelete(true)}
            type="button"
          >
            Delete habit
          </button>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="habit-progress-title">
        <h2
          id="habit-progress-title"
          className="text-2xl font-semibold text-ink"
        >
          Progress
        </h2>
        <HeatmapCalendar habit={habit} todayKey={currentDateKey} />
        <StatsPanel habitId={habit.id} todayKey={currentDateKey} />
      </section>

      <section className="space-y-4" aria-labelledby="edit-habit-title">
        <h2 id="edit-habit-title" className="text-2xl font-semibold text-ink">
          Edit habit
        </h2>
        <HabitForm habit={habit} submitLabel="Save changes" />
      </section>

      {isConfirmingDelete ? (
        <ConfirmDialog
          confirmLabel="Delete habit"
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={handleDelete}
          title={`Delete ${habit.name}?`}
          variant="danger"
        >
          This removes the habit and all of its check-ins.
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
