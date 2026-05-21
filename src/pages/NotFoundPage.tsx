import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="space-y-4" aria-labelledby="not-found-title">
      <p className="text-sm font-bold uppercase text-brand">404</p>
      <h1 id="not-found-title" className="text-3xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="max-w-2xl text-base leading-7 text-ink-muted">
        The page you requested does not exist.
      </p>
      <Link
        className="inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
        to="/"
      >
        Go to dashboard
      </Link>
    </section>
  )
}
