import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { CheckInToggle } from './CheckInToggle'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('CheckInToggle', () => {
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

  it("optimistically toggles today's check-in", () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })

    render(<CheckInToggle habitId={habit.id} todayKey="2026-05-21" />)

    fireEvent.click(screen.getByRole('button', { name: 'Check in today' }))

    expect(useHabitStore.getState().checkIns).toMatchObject([
      { habitId: habit.id, dateKey: '2026-05-21' },
    ])
    expect(
      screen.getByRole('button', { name: 'Checked today' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Checked today' }))

    expect(useHabitStore.getState().checkIns).toEqual([])
    expect(
      screen.getByRole('button', { name: 'Check in today' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not toggle while disabled', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#174d3e' })

    render(<CheckInToggle disabled habitId={habit.id} todayKey="2026-05-21" />)

    fireEvent.click(screen.getByRole('button', { name: 'Check in today' }))

    expect(useHabitStore.getState().checkIns).toEqual([])
    expect(
      screen.getByRole('button', { name: 'Check in today' }),
    ).toBeDisabled()
  })
})
