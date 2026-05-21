import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'
import { NewHabitPage } from './NewHabitPage'

const renderNewHabitPage = () =>
  render(
    <MemoryRouter initialEntries={['/habits/new']}>
      <Routes>
        <Route path="/habits/new" element={<NewHabitPage />} />
        <Route path="/" element={<p>Dashboard route</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('NewHabitPage', () => {
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

  it('creates a habit and redirects to the dashboard', () => {
    renderNewHabitPage()

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Hydrate' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Drink water daily' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create habit' }))

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      name: 'Hydrate',
      description: 'Drink water daily',
    })
    expect(screen.getByText('Dashboard route')).toBeVisible()
  })

  it('keeps the user on the page when validation fails', () => {
    renderNewHabitPage()

    fireEvent.click(screen.getByRole('button', { name: 'Create habit' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.')
    expect(screen.queryByText('Dashboard route')).not.toBeInTheDocument()
  })

  it('returns to the dashboard when canceled', () => {
    renderNewHabitPage()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Dashboard route')).toBeVisible()
    expect(useHabitStore.getState().habits).toEqual([])
  })
})
