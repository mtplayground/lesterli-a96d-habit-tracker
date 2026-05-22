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
    expect(screen.getByLabelText('Current streak: 1 day')).toHaveAttribute(
      'title',
      'Longest streak: 1 day',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Checked today' }))

    expect(useHabitStore.getState().checkIns).toEqual([])
  })

  it('renders the current and longest streak badge for the habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Walk', color: '#28705c' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-15')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-16')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-17')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-20')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    render(<HabitCard habit={habit} todayKey="2026-05-21" />)

    const badge = screen.getByLabelText('Current streak: 2 days')

    expect(badge).toHaveTextContent('🔥')
    expect(badge).toHaveTextContent('2 days')
    expect(badge).toHaveAttribute('title', 'Longest streak: 3 days')
    expect(screen.getByText('30 days').closest('div')).toHaveTextContent(
      '5 / 30',
    )
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

  it('restores an archived habit from the actions menu', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#2563eb' })
    useHabitStore.getState().archiveHabit(habit.id)

    render(<HabitCard habit={habit} />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Restore' }))

    expect(useHabitStore.getState().habits[0]?.archivedAt).toBeNull()
    expect(screen.queryByText('Archived')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check in today' })).toBeEnabled()
  })

  it('deletes a habit and its check-ins from the actions menu', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Journal', color: '#7c3aed' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    render(<HabitCard habit={habit} todayKey="2026-05-21" />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

    expect(
      screen.getByRole('dialog', { name: 'Delete Journal?' }),
    ).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Delete habit' }))

    expect(useHabitStore.getState().habits).toEqual([])
    expect(useHabitStore.getState().checkIns).toEqual([])
  })

  it('cancels delete confirmation without deleting', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Journal', color: '#7c3aed' })

    render(<HabitCard habit={habit} />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useHabitStore.getState().habits).toHaveLength(1)
  })

  it('cancels delete confirmation with Escape', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Journal', color: '#7c3aed' })

    render(<HabitCard habit={habit} />)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useHabitStore.getState().habits).toHaveLength(1)
  })
})
