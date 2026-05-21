import type { CSSProperties } from 'react'

const appTitle = import.meta.env.VITE_APP_TITLE || 'Habit Tracker'

type AppColorVariable =
  | '--color-ink'
  | '--color-ink-muted'
  | '--color-ink-soft'
  | '--color-surface'
  | '--color-surface-raised'
  | '--color-surface-muted'
  | '--color-brand'
  | '--color-brand-dark'
  | '--color-brand-light'
  | '--color-line'

const appPalette: CSSProperties & Record<AppColorVariable, string> = {
  '--color-ink': import.meta.env.VITE_COLOR_INK || '#17201b',
  '--color-ink-muted': import.meta.env.VITE_COLOR_INK_MUTED || '#4b5b51',
  '--color-ink-soft': import.meta.env.VITE_COLOR_INK_SOFT || '#66756c',
  '--color-surface': import.meta.env.VITE_COLOR_SURFACE || '#f7faf7',
  '--color-surface-raised':
    import.meta.env.VITE_COLOR_SURFACE_RAISED || '#ffffff',
  '--color-surface-muted':
    import.meta.env.VITE_COLOR_SURFACE_MUTED || '#edf3ee',
  '--color-brand': import.meta.env.VITE_COLOR_BRAND || '#28705c',
  '--color-brand-dark': import.meta.env.VITE_COLOR_BRAND_DARK || '#174d3e',
  '--color-brand-light': import.meta.env.VITE_COLOR_BRAND_LIGHT || '#dcefe7',
  '--color-line': import.meta.env.VITE_COLOR_LINE || '#d7e1da',
}

function App() {
  return (
    <main
      className="flex min-h-svh items-center justify-center bg-surface px-6 py-12 text-ink sm:px-10"
      style={appPalette}
    >
      <section className="max-w-3xl" aria-labelledby="app-title">
        <p className="mb-4 text-sm font-bold uppercase text-brand">
          {appTitle}
        </p>
        <h1
          id="app-title"
          className="mb-6 max-w-3xl text-5xl font-semibold leading-none text-ink sm:text-6xl lg:text-7xl"
        >
          Build steady routines, one check-in at a time.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-ink-muted">
          This Vite, React, and TypeScript foundation is ready for the habit
          tracking features planned in the upcoming issues.
        </p>
      </section>
    </main>
  )
}

export default App
