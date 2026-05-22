import { format } from 'date-fns'

import type { HabitStoreState } from '../types/habit'

export type HabitExportPayload = Pick<
  HabitStoreState,
  'schemaVersion' | 'habits' | 'checkIns'
>

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
