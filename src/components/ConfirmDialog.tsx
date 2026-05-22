import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export interface ConfirmDialogProps {
  cancelLabel?: string
  children: ReactNode
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  title: string
  variant?: 'danger'
}

export function ConfirmDialog({
  cancelLabel = 'Cancel',
  children,
  confirmLabel,
  onCancel,
  onConfirm,
  title,
  variant,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelButtonRef.current?.focus()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }

  const confirmClassName =
    variant === 'danger'
      ? 'rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-surface'
      : 'rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface'

  return (
    <div
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-4"
      onKeyDown={handleKeyDown}
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-lg bg-surface-raised p-5 shadow-soft">
        <h2 id={titleId} className="text-lg font-semibold text-ink">
          {title}
        </h2>
        <div
          id={descriptionId}
          className="mt-2 text-sm leading-6 text-ink-muted"
        >
          {children}
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
            onClick={onCancel}
            ref={cancelButtonRef}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={confirmClassName}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
