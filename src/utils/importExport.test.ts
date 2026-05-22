import { describe, expect, it, vi } from 'vitest'

import { SchemaVersion } from '../types/habit'
import {
  applyHabitImport,
  createHabitExportFileName,
  createHabitExportPayload,
  downloadHabitExport,
  parseHabitImportJson,
} from './importExport'

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

  return { click, createObjectURL, revokeObjectURL }
}

describe('importExport', () => {
  it('creates an export payload with persisted state only', () => {
    const payload = createHabitExportPayload({
      schemaVersion: SchemaVersion,
      habits: [
        {
          id: 'habit-1',
          name: 'Read',
          color: '#2563eb',
          createdAt: '2026-05-21T00:00:00.000Z',
          updatedAt: '2026-05-21T00:00:00.000Z',
          archivedAt: null,
        },
      ],
      checkIns: [
        {
          id: 'check-in-1',
          habitId: 'habit-1',
          dateKey: '2026-05-21',
          createdAt: '2026-05-21T12:00:00.000Z',
        },
      ],
    })

    expect(payload).toEqual({
      schemaVersion: SchemaVersion,
      habits: [expect.objectContaining({ id: 'habit-1' })],
      checkIns: [expect.objectContaining({ id: 'check-in-1' })],
    })
  })

  it('creates a dated export filename', () => {
    expect(createHabitExportFileName(new Date('2026-05-21T12:00:00'))).toBe(
      'habit-tracker-export-20260521.json',
    )
  })

  it('downloads the export as formatted JSON', async () => {
    const { click, createObjectURL, revokeObjectURL } = stubDownloadApis()

    downloadHabitExport(
      {
        schemaVersion: SchemaVersion,
        habits: [],
        checkIns: [],
      },
      new Date('2026-05-21T12:00:00'),
    )

    const blob = createObjectURL.mock.calls[0][0] as Blob
    const anchor = click.mock.contexts[0] as HTMLAnchorElement

    expect(blob.type).toBe('application/json')
    await expect(blob.text()).resolves.toBe(
      `${JSON.stringify(
        { schemaVersion: SchemaVersion, habits: [], checkIns: [] },
        null,
        2,
      )}\n`,
    )
    expect(anchor.download).toBe('habit-tracker-export-20260521.json')
    expect(anchor.href).toBe('blob:habit-export')
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:habit-export')
  })

  it('parses and validates import JSON', () => {
    const result = parseHabitImportJson(
      JSON.stringify({
        schemaVersion: SchemaVersion,
        habits: [
          {
            id: 'habit-1',
            name: 'Read',
            color: '#2563eb',
            createdAt: '2026-05-21T00:00:00.000Z',
            updatedAt: '2026-05-21T00:00:00.000Z',
            archivedAt: null,
          },
        ],
        checkIns: [
          {
            id: 'check-in-1',
            habitId: 'habit-1',
            dateKey: '2026-05-21',
            createdAt: '2026-05-21T12:00:00.000Z',
          },
        ],
      }),
    )

    expect(result).toEqual({
      ok: true,
      payload: {
        schemaVersion: SchemaVersion,
        habits: [expect.objectContaining({ id: 'habit-1' })],
        checkIns: [expect.objectContaining({ id: 'check-in-1' })],
      },
    })
  })

  it('rejects invalid JSON and unsupported schema versions', () => {
    expect(parseHabitImportJson('{')).toEqual({
      ok: false,
      error: 'Import file must contain valid JSON.',
    })
    expect(
      parseHabitImportJson(
        JSON.stringify({ schemaVersion: 999, habits: [], checkIns: [] }),
      ),
    ).toEqual({
      ok: false,
      error: `Import file must use schema version ${SchemaVersion}.`,
    })
  })

  it('rejects check-ins for habits missing from the import', () => {
    expect(
      parseHabitImportJson(
        JSON.stringify({
          schemaVersion: SchemaVersion,
          habits: [],
          checkIns: [
            {
              id: 'check-in-1',
              habitId: 'missing',
              dateKey: '2026-05-21',
              createdAt: '2026-05-21T12:00:00.000Z',
            },
          ],
        }),
      ),
    ).toEqual({
      ok: false,
      error: 'Import file contains check-ins for unknown habits.',
    })
  })

  it('applies imports by replacing current state', () => {
    const nextState = applyHabitImport(
      {
        schemaVersion: SchemaVersion,
        habits: [
          {
            id: 'current',
            name: 'Current',
            color: '#28705c',
            createdAt: '2026-05-21T00:00:00.000Z',
            updatedAt: '2026-05-21T00:00:00.000Z',
            archivedAt: null,
          },
        ],
        checkIns: [],
      },
      {
        schemaVersion: SchemaVersion,
        habits: [
          {
            id: 'imported',
            name: 'Imported',
            color: '#2563eb',
            createdAt: '2026-05-22T00:00:00.000Z',
            updatedAt: '2026-05-22T00:00:00.000Z',
            archivedAt: null,
          },
        ],
        checkIns: [],
      },
      'replace',
    )

    expect(nextState.habits).toEqual([
      expect.objectContaining({ id: 'imported' }),
    ])
  })

  it('applies imports by merging records by id', () => {
    const nextState = applyHabitImport(
      {
        schemaVersion: SchemaVersion,
        habits: [
          {
            id: 'shared',
            name: 'Old name',
            color: '#28705c',
            createdAt: '2026-05-21T00:00:00.000Z',
            updatedAt: '2026-05-21T00:00:00.000Z',
            archivedAt: null,
          },
          {
            id: 'current',
            name: 'Current',
            color: '#174d3e',
            createdAt: '2026-05-21T00:00:00.000Z',
            updatedAt: '2026-05-21T00:00:00.000Z',
            archivedAt: null,
          },
        ],
        checkIns: [],
      },
      {
        schemaVersion: SchemaVersion,
        habits: [
          {
            id: 'shared',
            name: 'Imported name',
            color: '#2563eb',
            createdAt: '2026-05-22T00:00:00.000Z',
            updatedAt: '2026-05-22T00:00:00.000Z',
            archivedAt: null,
          },
        ],
        checkIns: [],
      },
      'merge',
    )

    expect(nextState.habits).toEqual([
      expect.objectContaining({ id: 'shared', name: 'Imported name' }),
      expect.objectContaining({ id: 'current' }),
    ])
  })
})
