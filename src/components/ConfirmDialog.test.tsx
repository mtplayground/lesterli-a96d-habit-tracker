import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  afterEach(() => {
    cleanup()
  })

  it('labels the dialog and focuses cancel by default', () => {
    render(
      <ConfirmDialog
        confirmLabel="Delete habit"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Hydrate?"
        variant="danger"
      >
        This removes the habit and all of its check-ins.
      </ConfirmDialog>,
    )

    expect(
      screen.getByRole('dialog', { name: 'Delete Hydrate?' }),
    ).toHaveAccessibleDescription(
      'This removes the habit and all of its check-ins.',
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('supports Escape cancel and confirm actions', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        confirmLabel="Delete habit"
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="Delete Hydrate?"
        variant="danger"
      >
        This removes the habit and all of its check-ins.
      </ConfirmDialog>,
    )

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Delete habit' }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
