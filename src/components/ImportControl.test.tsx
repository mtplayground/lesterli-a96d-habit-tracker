import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'
import { ImportControl } from './ImportControl'

const createImportFile = (content: string) =>
  new File([content], 'habit-tracker-export.json', {
    type: 'application/json',
  })

const validImport = {
  schemaVersion: SchemaVersion,
  habits: [
    {
      id: 'imported-habit',
      name: 'Imported habit',
      color: '#2563eb',
      createdAt: '2026-05-22T00:00:00.000Z',
      updatedAt: '2026-05-22T00:00:00.000Z',
      archivedAt: null,
    },
  ],
  checkIns: [
    {
      id: 'imported-check-in',
      habitId: 'imported-habit',
      dateKey: '2026-05-22',
      createdAt: '2026-05-22T12:00:00.000Z',
    },
  ],
}

describe('ImportControl', () => {
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

  it('loads a valid file and waits for confirmation before merging', async () => {
    const currentHabit = useHabitStore
      .getState()
      .addHabit({ name: 'Current habit', color: '#28705c' })

    render(<ImportControl />)

    fireEvent.change(screen.getByLabelText('Import'), {
      target: { files: [createImportFile(JSON.stringify(validImport))] },
    })

    expect(
      await screen.findByText('Ready to import 1 habits and 1 check-ins.'),
    ).toBeVisible()
    expect(useHabitStore.getState().habits).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Apply import' }))

    expect(useHabitStore.getState().habits).toEqual([
      expect.objectContaining({ id: currentHabit.id }),
      expect.objectContaining({ id: 'imported-habit' }),
    ])
    expect(screen.getByRole('status')).toHaveTextContent(
      'Imported 1 habits and 1 check-ins.',
    )
  })

  it('replaces current data when replace mode is selected', async () => {
    useHabitStore
      .getState()
      .addHabit({ name: 'Current habit', color: '#28705c' })

    render(<ImportControl />)

    fireEvent.change(screen.getByLabelText('Import'), {
      target: { files: [createImportFile(JSON.stringify(validImport))] },
    })

    await screen.findByText('Ready to import 1 habits and 1 check-ins.')
    fireEvent.click(screen.getByLabelText('Replace current data'))
    fireEvent.click(screen.getByRole('button', { name: 'Apply import' }))

    expect(useHabitStore.getState().habits).toEqual([
      expect.objectContaining({ id: 'imported-habit' }),
    ])
  })

  it('shows validation errors without applying data', async () => {
    render(<ImportControl />)

    fireEvent.change(screen.getByLabelText('Import'), {
      target: { files: [createImportFile('{')] },
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Import file must contain valid JSON.',
    )
    expect(
      screen.queryByRole('button', { name: 'Apply import' }),
    ).not.toBeInTheDocument()
    expect(useHabitStore.getState().habits).toEqual([])
  })
})
