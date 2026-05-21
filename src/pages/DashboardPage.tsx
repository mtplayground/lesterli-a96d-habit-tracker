export function DashboardPage() {
  return (
    <section className="space-y-3" aria-labelledby="dashboard-title">
      <p className="text-sm font-bold uppercase text-brand">Dashboard</p>
      <h1 id="dashboard-title" className="text-3xl font-semibold text-ink">
        Your habits
      </h1>
      <p className="max-w-2xl text-base leading-7 text-ink-muted">
        Review your active habits, check in for today, and track your progress.
      </p>
    </section>
  )
}
