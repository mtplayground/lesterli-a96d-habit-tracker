import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { HeatmapCell } from './HeatmapCell'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('HeatmapCell', () => {
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

  it('toggles a past date check-in when clicked', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })

    render(
      <HeatmapCell
        dateKey="2026-05-20"
        habitId={habit.id}
        todayKey="2026-05-21"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Add check-in for 2026-05-20' }),
    )

    expect(useHabitStore.getState().checkIns).toMatchObject([
      { habitId: habit.id, dateKey: '2026-05-20' },
    ])
    expect(
      screen.getByRole('button', { name: 'Remove check-in for 2026-05-20' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove check-in for 2026-05-20' }),
    )

    expect(useHabitStore.getState().checkIns).toEqual([])
  })

  it('allows toggling today', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#174d3e' })

    render(
      <HeatmapCell
        dateKey="2026-05-21"
        habitId={habit.id}
        todayKey="2026-05-21"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Add check-in for 2026-05-21' }),
    )

    expect(useHabitStore.getState().checkIns).toHaveLength(1)
  })

  it('disallows toggling future dates', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#2563eb' })

    render(
      <HeatmapCell
        dateKey="2026-05-22"
        habitId={habit.id}
        todayKey="2026-05-21"
      />,
    )

    const futureCell = screen.getByRole('button', {
      name: 'Add check-in for 2026-05-22',
    })

    expect(futureCell).toBeDisabled()
    fireEvent.click(futureCell)

    expect(useHabitStore.getState().checkIns).toEqual([])
  })
})
