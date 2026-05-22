import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { useHabitStore } from '../stores/habitStore'
import {
  type HabitExportPayload,
  type HabitImportMode,
  parseHabitImportJson,
} from '../utils/importExport'

export function ImportControl() {
  const importHabitState = useHabitStore((state) => state.importHabitState)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<HabitImportMode>('merge')
  const [pendingImport, setPendingImport] = useState<HabitExportPayload | null>(
    null,
  )
  const [status, setStatus] = useState('')

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    setError('')
    setStatus('')
    setPendingImport(null)

    if (!file) {
      return
    }

    const result = parseHabitImportJson(await file.text())

    if (!result.ok) {
      setError(result.error)
      event.target.value = ''
      return
    }

    setPendingImport(result.payload)
    event.target.value = ''
  }

  const applyImport = () => {
    if (!pendingImport) {
      return
    }

    importHabitState(pendingImport, mode)
    setStatus(
      `Imported ${pendingImport.habits.length} habits and ${pendingImport.checkIns.length} check-ins.`,
    )
    setPendingImport(null)
  }

  return (
    <div className="space-y-3">
      <label
        className="inline-flex cursor-pointer rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-muted focus-within:ring-2 focus-within:ring-brand"
        htmlFor="habit-import-file"
      >
        Import
        <input
          accept="application/json,.json"
          className="sr-only"
          id="habit-import-file"
          onChange={handleFileChange}
          type="file"
        />
      </label>

      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {pendingImport ? (
        <div
          aria-label="Import options"
          className="space-y-3 rounded-md border border-line bg-surface-raised p-3"
        >
          <p className="text-sm text-ink-muted">
            Ready to import {pendingImport.habits.length} habits and{' '}
            {pendingImport.checkIns.length} check-ins.
          </p>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-ink">
              Import mode
            </legend>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                checked={mode === 'merge'}
                onChange={() => setMode('merge')}
                type="radio"
              />
              Merge with current data
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
                type="radio"
              />
              Replace current data
            </label>
          </fieldset>
          <button
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
            onClick={applyImport}
            type="button"
          >
            Apply import
          </button>
        </div>
      ) : null}

      {status ? (
        <p className="text-sm font-medium text-brand-dark" role="status">
          {status}
        </p>
      ) : null}
    </div>
  )
}
