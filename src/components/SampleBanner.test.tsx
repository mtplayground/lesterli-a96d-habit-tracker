import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { seedState } from '../stores/seed'
import { SchemaVersion } from '../types/habit'
import { SampleBanner } from './SampleBanner'

describe('SampleBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-21T12:00:00'))
    localStorage.clear()
    useHabitStore.setState(seedState())
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the sample-data notice when seed habits are present', () => {
    render(<SampleBanner />)

    expect(
      screen.getByText(
        "👋 This is sample data — here's what sticking with it looks like.",
      ),
    ).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Clear & start mine' }),
    ).toHaveClass('bg-amber-600')
  })

  it('clears sample habits and check-ins through import replace', () => {
    render(<SampleBanner />)

    fireEvent.click(screen.getByRole('button', { name: 'Clear & start mine' }))

    expect(useHabitStore.getState()).toMatchObject({
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    })
    expect(
      screen.queryByLabelText('Sample data notice'),
    ).not.toBeInTheDocument()
  })

  it('does not render when habits are not sample data', () => {
    useHabitStore.setState({
      schemaVersion: SchemaVersion,
      habits: [
        {
          id: 'custom-read',
          name: 'Read',
          color: '#2563eb',
          createdAt: '2026-05-21T12:00:00.000Z',
          updatedAt: '2026-05-21T12:00:00.000Z',
          archivedAt: null,
        },
      ],
      checkIns: [],
    })

    render(<SampleBanner />)

    expect(
      screen.queryByLabelText('Sample data notice'),
    ).not.toBeInTheDocument()
  })
})
