import '@testing-library/jest-dom/vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'
import { HabitDetailPage } from './HabitDetailPage'

const renderHabitDetail = (habitId: string) =>
  render(
    <MemoryRouter initialEntries={[`/habits/${habitId}`]}>
      <Routes>
        <Route path="/habits/:id" element={<HabitDetailPage />} />
        <Route path="/" element={<p>Dashboard route</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('HabitDetailPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-21T12:00:00'))
    localStorage.clear()
    useHabitStore.setState({
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders a not found state for missing habits', () => {
    renderHabitDetail('missing')

    expect(
      screen.getByRole('heading', { name: 'Habit not found' }),
    ).toBeVisible()
  })

  it('renders heatmap and stats for a single habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#2563eb' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    renderHabitDetail(habit.id)

    expect(screen.getByRole('heading', { name: 'Read' })).toBeVisible()
    expect(screen.getByLabelText('Read check-in heatmap')).toBeVisible()
    expect(screen.getByLabelText('May 21, 2026: Completed')).toHaveStyle({
      fill: '#2563eb',
    })
    expect(screen.getByText('30 days').closest('div')).toHaveTextContent(
      '1 / 30',
    )
  })

  it('edits the habit with the inline form', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#2563eb' })

    renderHabitDetail(habit.id)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Read fiction' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('heading', { name: 'Read fiction' })).toBeVisible()
    expect(useHabitStore.getState().habits[0].name).toBe('Read fiction')
  })

  it('archives and restores the habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Workout', color: '#ea580c' })

    renderHabitDetail(habit.id)

    fireEvent.click(screen.getByRole('button', { name: 'Archive habit' }))

    expect(screen.getByText('Archived')).toBeVisible()
    expect(useHabitStore.getState().habits[0].archivedAt).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Restore habit' }))

    expect(screen.queryByText('Archived')).not.toBeInTheDocument()
    expect(useHabitStore.getState().habits[0].archivedAt).toBeNull()
  })

  it('deletes the habit and navigates back to the dashboard', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    renderHabitDetail(habit.id)

    fireEvent.click(screen.getByRole('button', { name: 'Delete habit' }))
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Delete habit',
      }),
    )

    expect(screen.getByText('Dashboard route')).toBeVisible()
    expect(useHabitStore.getState().habits).toEqual([])
    expect(useHabitStore.getState().checkIns).toEqual([])
  })
})
