import { format } from 'date-fns'

import {
  type CheckIn,
  type Habit,
  type HabitStoreState,
  SchemaVersion,
} from '../types/habit'

export type HabitExportPayload = Pick<
  HabitStoreState,
  'schemaVersion' | 'habits' | 'checkIns'
>
export type HabitImportMode = 'merge' | 'replace'
export type HabitImportResult =
  | { error: string; ok: false }
  | { ok: true; payload: HabitExportPayload }

export const createHabitExportPayload = ({
  schemaVersion,
  habits,
  checkIns,
}: HabitExportPayload): HabitExportPayload => ({
  schemaVersion,
  habits,
  checkIns,
})

export const createHabitExportFileName = (date = new Date()) =>
  `habit-tracker-export-${format(date, 'yyyyMMdd')}.json`

export const downloadHabitExport = (
  state: HabitExportPayload,
  date = new Date(),
) => {
  const payload = createHabitExportPayload(state)
  const fileName = createHabitExportFileName(date)
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value)

const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value)

const isHabit = (value: unknown): value is Habit =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.name) &&
  isString(value.color) &&
  isOptionalString(value.description) &&
  isString(value.createdAt) &&
  isString(value.updatedAt) &&
  isNullableString(value.archivedAt)

const isCheckIn = (value: unknown): value is CheckIn =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.habitId) &&
  isString(value.dateKey) &&
  isString(value.createdAt)

export const validateHabitImportPayload = (
  value: unknown,
): HabitImportResult => {
  if (!isRecord(value)) {
    return { ok: false, error: 'Import file must contain a JSON object.' }
  }

  if (value.schemaVersion !== SchemaVersion) {
    return {
      ok: false,
      error: `Import file must use schema version ${SchemaVersion}.`,
    }
  }

  if (!Array.isArray(value.habits) || !Array.isArray(value.checkIns)) {
    return {
      ok: false,
      error: 'Import file must include habits and checkIns arrays.',
    }
  }

  if (!value.habits.every(isHabit)) {
    return {
      ok: false,
      error: 'Import file contains an invalid habit record.',
    }
  }

  if (!value.checkIns.every(isCheckIn)) {
    return {
      ok: false,
      error: 'Import file contains an invalid check-in record.',
    }
  }

  const habitIds = new Set(value.habits.map((habit) => habit.id))
  const hasUnknownHabitReference = value.checkIns.some(
    (checkIn) => !habitIds.has(checkIn.habitId),
  )

  if (hasUnknownHabitReference) {
    return {
      ok: false,
      error: 'Import file contains check-ins for unknown habits.',
    }
  }

  return {
    ok: true,
    payload: createHabitExportPayload({
      schemaVersion: SchemaVersion,
      habits: value.habits,
      checkIns: value.checkIns,
    }),
  }
}

export const parseHabitImportJson = (json: string): HabitImportResult => {
  try {
    return validateHabitImportPayload(JSON.parse(json) as unknown)
  } catch {
    return { ok: false, error: 'Import file must contain valid JSON.' }
  }
}

const mergeById = <Item extends { id: string }>(
  currentItems: Item[],
  importedItems: Item[],
) => {
  const merged = new Map(currentItems.map((item) => [item.id, item]))

  for (const item of importedItems) {
    merged.set(item.id, item)
  }

  return [...merged.values()]
}

export const applyHabitImport = (
  currentState: HabitExportPayload,
  importedState: HabitExportPayload,
  mode: HabitImportMode,
): HabitExportPayload => {
  if (mode === 'replace') {
    return createHabitExportPayload(importedState)
  }

  return {
    schemaVersion: SchemaVersion,
    habits: mergeById(currentState.habits, importedState.habits),
    checkIns: mergeById(currentState.checkIns, importedState.checkIns),
  }
}
