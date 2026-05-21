function App() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface px-6 py-12 text-ink sm:px-10">
      <section className="max-w-3xl" aria-labelledby="app-title">
        <p className="mb-4 text-sm font-bold uppercase text-brand">
          Habit Tracker
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
