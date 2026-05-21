import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'
import { createAppRoutes } from './router'

afterEach(() => {
  cleanup()
})

const renderRoute = (path: string) => {
  const router = createMemoryRouter(createAppRoutes(), {
    initialEntries: [path],
  })

  render(<RouterProvider router={router} />)
}

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)

    expect(screen.getByText('Habit Tracker')).toBeInTheDocument()
  })

  it('renders the dashboard route at root', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: 'Your habits' }),
    ).toBeInTheDocument()
  })

  it('renders the new habit route', () => {
    renderRoute('/habits/new')

    expect(
      screen.getByRole('heading', { name: 'Create a habit' }),
    ).toBeInTheDocument()
  })

  it('renders the habit detail route', () => {
    renderRoute('/habits/habit-123')

    expect(
      screen.getByRole('heading', { name: 'Habit habit-123' }),
    ).toBeInTheDocument()
  })

  it('renders the not found route', () => {
    renderRoute('/missing')

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
