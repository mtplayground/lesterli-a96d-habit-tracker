import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { HeatmapCalendar, HEATMAP_TRAILING_DAYS } from './HeatmapCalendar'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('HeatmapCalendar', () => {
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

  it('renders a trailing 365-day heatmap ending today', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })

    render(<HeatmapCalendar habit={habit} todayKey="2026-05-21" />)

    expect(screen.getAllByTestId('heatmap-day')).toHaveLength(
      HEATMAP_TRAILING_DAYS,
    )
    expect(screen.getByLabelText('2025-05-22: no check-in')).toBeVisible()
    expect(screen.getByLabelText('2026-05-21: no check-in')).toBeVisible()
    expect(
      screen.queryByLabelText('2025-05-21: no check-in'),
    ).not.toBeInTheDocument()
  })

  it('fills checked dates with the habit color and leaves empty dates muted', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#174d3e' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-20')

    render(<HeatmapCalendar habit={habit} todayKey="2026-05-21" />)

    expect(screen.getByLabelText('2026-05-20: checked in')).toHaveStyle({
      fill: '#174d3e',
    })
    expect(screen.getByLabelText('2026-05-21: no check-in')).toHaveStyle({
      fill: 'var(--color-surface-muted)',
    })
  })

  it('toggles check-ins when heatmap cells are clicked or keyed', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#2563eb' })

    render(<HeatmapCalendar habit={habit} todayKey="2026-05-21" />)

    fireEvent.click(screen.getByLabelText('2026-05-20: no check-in'))

    expect(useHabitStore.getState().checkIns).toMatchObject([
      { habitId: habit.id, dateKey: '2026-05-20' },
    ])
    expect(screen.getByLabelText('2026-05-20: checked in')).toHaveAttribute(
      'data-checked',
      'true',
    )

    fireEvent.keyDown(screen.getByLabelText('2026-05-20: checked in'), {
      key: 'Enter',
    })

    expect(useHabitStore.getState().checkIns).toEqual([])
  })
})
