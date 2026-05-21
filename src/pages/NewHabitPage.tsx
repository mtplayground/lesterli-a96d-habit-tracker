import { Link, useNavigate } from 'react-router-dom'

import { HabitForm } from '../components/HabitForm'

export function NewHabitPage() {
  const navigate = useNavigate()

  return (
    <section className="max-w-2xl space-y-6" aria-labelledby="new-habit-title">
      <Link
        className="inline-flex rounded-md text-sm font-semibold text-brand transition hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand"
        to="/"
      >
        Back to dashboard
      </Link>
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase text-brand">New habit</p>
        <h1 id="new-habit-title" className="text-3xl font-semibold text-ink">
          Create a habit
        </h1>
        <p className="max-w-2xl text-base leading-7 text-ink-muted">
          Add a habit you want to track and return to the dashboard.
        </p>
      </div>

      <HabitForm
        onCancel={() => navigate('/')}
        onSaved={() => navigate('/')}
        submitLabel="Create habit"
      />
    </section>
  )
}
