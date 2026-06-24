import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { seedState } from '../stores/seed'
import { SchemaVersion } from '../types/habit'
import { DashboardPage } from './DashboardPage'

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/habits/new" element={<p>Create habit route</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('DashboardPage', () => {
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

  it('renders a top-right new habit CTA', () => {
    renderDashboard()

    expect(screen.getByRole('link', { name: 'New habit' })).toHaveAttribute(
      'href',
      '/habits/new',
    )
  })

  it('renders the sample banner above the habit list when seeded', () => {
    useHabitStore.setState(seedState())

    renderDashboard()

    const banner = screen.getByLabelText('Sample data notice')
    const habitListTitle = screen.getByRole('heading', { name: 'Habits' })

    expect(banner).toBeVisible()
    expect(
      banner.compareDocumentPosition(habitListTitle) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('navigates to new habit from the empty state CTA', () => {
    renderDashboard()

    fireEvent.click(screen.getByRole('button', { name: 'Create first habit' }))

    expect(screen.getByText('Create habit route')).toBeVisible()
  })

  it('composes habit cards with streak badges and per-habit heatmaps', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#2563eb' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-20')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    renderDashboard()

    expect(screen.getByRole('heading', { name: 'Read' })).toBeVisible()
    expect(screen.getByLabelText('Current streak: 2 days')).toBeVisible()
    expect(screen.getByLabelText('Read check-in heatmap')).toBeVisible()
    expect(screen.getByLabelText('May 21, 2026: Completed')).toHaveStyle({
      fill: '#2563eb',
    })
  })
})
