import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { StatsPanel } from './StatsPanel'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

const getStatsWindow = (label: string) =>
  screen.getByText(label).closest('div') as HTMLElement

describe('StatsPanel', () => {
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

  it('shows totals and completion rates for 30, 90, and 365 day windows', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-20')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-10')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-03-01')
    useHabitStore.getState().toggleCheckIn(habit.id, '2025-07-01')

    render(<StatsPanel habitId={habit.id} todayKey="2026-05-21" />)

    expect(screen.getByRole('heading', { name: 'Stats' })).toBeVisible()
    expect(within(getStatsWindow('30 days')).getByText('3 / 30')).toBeVisible()
    expect(
      within(getStatsWindow('30 days')).getByText('10% complete'),
    ).toBeVisible()
    expect(within(getStatsWindow('90 days')).getByText('4 / 90')).toBeVisible()
    expect(
      within(getStatsWindow('90 days')).getByText('4% complete'),
    ).toBeVisible()
    expect(
      within(getStatsWindow('365 days')).getByText('5 / 365'),
    ).toBeVisible()
    expect(
      within(getStatsWindow('365 days')).getByText('1% complete'),
    ).toBeVisible()
  })

  it('filters check-ins to the requested habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#174d3e' })
    const otherHabit = useHabitStore
      .getState()
      .addHabit({ name: 'Walk', color: '#2563eb' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    useHabitStore.getState().toggleCheckIn(otherHabit.id, '2026-05-20')

    render(<StatsPanel habitId={habit.id} todayKey="2026-05-21" />)

    expect(within(getStatsWindow('30 days')).getByText('1 / 30')).toBeVisible()
  })
})
