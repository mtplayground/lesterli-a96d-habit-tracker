import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './App'
import { createAppRoutes } from './router'
import { useHabitStore } from './stores/habitStore'
import { SchemaVersion } from './types/habit'

beforeEach(() => {
  localStorage.clear()
  useHabitStore.setState({
    schemaVersion: SchemaVersion,
    habits: [],
    checkIns: [],
  })
})

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
    useHabitStore.setState({
      schemaVersion: SchemaVersion,
      habits: [
        {
          id: 'habit-123',
          name: 'Read',
          color: '#2563eb',
          createdAt: '2026-05-21T00:00:00.000Z',
          updatedAt: '2026-05-21T00:00:00.000Z',
          archivedAt: null,
        },
      ],
      checkIns: [],
    })

    renderRoute('/habits/habit-123')

    expect(screen.getByRole('heading', { name: 'Read' })).toBeInTheDocument()
  })

  it('renders the not found route', () => {
    renderRoute('/missing')

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
