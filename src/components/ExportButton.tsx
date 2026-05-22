import { useHabitStore } from '../stores/habitStore'
import { downloadHabitExport } from '../utils/importExport'

export function ExportButton() {
  const schemaVersion = useHabitStore((state) => state.schemaVersion)
  const habits = useHabitStore((state) => state.habits)
  const checkIns = useHabitStore((state) => state.checkIns)

  return (
    <button
      className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
      onClick={() => downloadHabitExport({ schemaVersion, habits, checkIns })}
      type="button"
    >
      Export
    </button>
  )
}
