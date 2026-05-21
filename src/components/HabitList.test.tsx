import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HabitList } from './HabitList'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('HabitList', () => {
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

  it('renders an empty state with a create CTA', () => {
    const onCreateHabit = vi.fn()

    render(<HabitList onCreateHabit={onCreateHabit} />)

    expect(screen.getByRole('heading', { name: 'No habits yet' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Create first habit' }))

    expect(onCreateHabit).toHaveBeenCalledOnce()
  })

  it('lists active habits and filters archived habits by default', () => {
    useHabitStore.getState().addHabit({ name: 'Hydrate', color: '#28705c' })
    const archivedHabit = useHabitStore
      .getState()
      .addHabit({ name: 'Old routine', color: '#174d3e' })
    useHabitStore.getState().archiveHabit(archivedHabit.id)

    render(<HabitList />)

    expect(screen.getByRole('heading', { name: 'Hydrate' })).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'Old routine' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('1 active · 2 total')).toBeVisible()
  })

  it('shows archived habits when the toggle is enabled', () => {
    useHabitStore.getState().addHabit({ name: 'Read', color: '#2563eb' })
    const archivedHabit = useHabitStore
      .getState()
      .addHabit({ name: 'Archived habit', color: '#7c3aed' })
    useHabitStore.getState().archiveHabit(archivedHabit.id)

    render(<HabitList />)

    fireEvent.click(screen.getByLabelText('Show archived habits'))

    expect(screen.getByRole('heading', { name: 'Read' })).toBeVisible()
    expect(
      screen.getByRole('heading', { name: 'Archived habit' }),
    ).toBeVisible()
  })

  it('renders streak badge slots for each habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#ea580c' })

    render(
      <HabitList
        renderStreakBadge={({ id }) => (id === habit.id ? '5 days' : null)}
      />,
    )

    expect(screen.getByLabelText('Streak')).toHaveTextContent('5 days')
  })
})
