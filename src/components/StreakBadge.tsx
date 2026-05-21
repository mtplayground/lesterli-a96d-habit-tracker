export interface StreakBadgeProps {
  current: number
  longest: number
}

const formatDays = (days: number) => `${days} ${days === 1 ? 'day' : 'days'}`

export function StreakBadge({ current, longest }: StreakBadgeProps) {
  return (
    <span
      aria-label={`Current streak: ${formatDays(current)}`}
      className="inline-flex min-h-8 items-center gap-2 rounded-md border border-line bg-surface-muted px-3 py-1 text-sm font-semibold text-ink"
      title={`Longest streak: ${formatDays(longest)}`}
    >
      <span aria-hidden="true">🔥</span>
      <span>{formatDays(current)}</span>
    </span>
  )
}
