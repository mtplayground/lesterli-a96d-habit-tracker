import { Link, NavLink, Outlet } from 'react-router-dom'

const appTitle = import.meta.env.VITE_APP_TITLE || 'Habit Tracker'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand',
    isActive
      ? 'bg-brand-light text-brand-dark'
      : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  ].join(' ')

export function RootLayout() {
  return (
    <div className="min-h-svh bg-surface text-ink">
      <header className="border-b border-line bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <Link
            className="text-lg font-bold text-ink transition hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
            to="/"
          >
            {appTitle}
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1">
            <NavLink className={navLinkClassName} to="/" end>
              Dashboard
            </NavLink>
            <NavLink className={navLinkClassName} to="/habits/new">
              New habit
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
