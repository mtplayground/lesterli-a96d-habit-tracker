export interface EmptyStateProps {
  actionLabel?: string
  message: string
  onAction?: () => void
  title: string
}

export function EmptyState({
  actionLabel,
  message,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
        {message}
      </p>
      {actionLabel && onAction ? (
        <button
          className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
