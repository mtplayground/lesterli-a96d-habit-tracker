import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { HabitCard } from './HabitCard'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('HabitCard', () => {
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

  it('renders habit details, color swatch, and streak badge slot', () => {
    const habit = useHabitStore.getState().addHabit({
      name: 'Hydrate',
      color: '#28705c',
      description: 'Drink water daily',
    })

    render(<HabitCard habit={habit} streakBadge={<span>3 day streak</span>} />)

    expect(screen.getByRole('heading', { name: 'Hydrate' })).toBeVisible()
    expect(screen.getByText('Drink water daily')).toBeVisible()
    expect(screen.getByLabelText('Hydrate color')).toHaveStyle({
      backgroundColor: '#28705c',
    })
    expect(screen.getByLabelText('Streak')).toHaveTextContent('3 day streak')
  })

  it("toggles today's check-in for the habit", () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#174d3e' })

    render(<HabitCard habit={habit} todayKey="2026-05-21" />)

    const toggle = screen.getByRole('button', { name: 'Check in today' })

    fireEvent.click(toggle)

    expect(useHabitStore.getState().checkIns).toMatchObject([
      { habitId: habit.id, dateKey: '2026-05-21' },
    ])
    expect(
      screen.getByRole('button', { name: 'Checked today' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Checked today' }))

    expect(useHabitStore.getState().checkIns).toEqual([])
  })

  it('archives a habit from the actions menu', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#2563eb' })

    render(<HabitCard habit={habit} />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }))

    expect(useHabitStore.getState().habits[0]?.archivedAt).toEqual(
      expect.any(String),
    )
    expect(screen.getByText('Archived')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Check in today' }),
    ).toBeDisabled()
  })

  it('deletes a habit and its check-ins from the actions menu', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Journal', color: '#7c3aed' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    render(<HabitCard habit={habit} todayKey="2026-05-21" />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

    expect(useHabitStore.getState().habits).toEqual([])
    expect(useHabitStore.getState().checkIns).toEqual([])
  })
})
