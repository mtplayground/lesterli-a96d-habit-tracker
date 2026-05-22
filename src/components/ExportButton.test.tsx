import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'
import { ExportButton } from './ExportButton'

const stubDownloadApis = () => {
  const createObjectURL = vi.fn((blob: Blob) => {
    void blob
    return 'blob:habit-export'
  })
  const revokeObjectURL = vi.fn((url: string) => {
    void url
  })
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => undefined)

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectURL,
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: revokeObjectURL,
  })

  return { click, createObjectURL }
}

describe('ExportButton', () => {
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
    vi.restoreAllMocks()
  })

  it('exports the current store state', async () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    const { click, createObjectURL } = stubDownloadApis()

    render(<ExportButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Export' }))

    const blob = createObjectURL.mock.calls[0][0] as Blob
    const anchor = click.mock.contexts[0] as HTMLAnchorElement
    const json = JSON.parse(await blob.text()) as {
      habits: { name: string }[]
      checkIns: { dateKey: string }[]
    }

    expect(anchor.download).toBe('habit-tracker-export-20260521.json')
    expect(json.habits).toEqual([expect.objectContaining({ name: 'Hydrate' })])
    expect(json.checkIns).toEqual([
      expect.objectContaining({ dateKey: '2026-05-21' }),
    ])
  })
})
