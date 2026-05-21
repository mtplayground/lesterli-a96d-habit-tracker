import { Link, useParams } from 'react-router-dom'

export function HabitDetailPage() {
  const { id } = useParams()

  return (
    <section className="space-y-4" aria-labelledby="habit-detail-title">
      <Link
        className="inline-flex rounded-md text-sm font-semibold text-brand transition hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand"
        to="/"
      >
        Back to dashboard
      </Link>
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase text-brand">Habit detail</p>
        <h1 id="habit-detail-title" className="text-3xl font-semibold text-ink">
          Habit {id}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-ink-muted">
          This route is ready for habit history, editing, and statistics.
        </p>
      </div>
    </section>
  )
}
