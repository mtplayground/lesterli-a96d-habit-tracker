import { useId, useState } from 'react'
import type { FormEvent } from 'react'

import { useHabitStore } from '../stores/habitStore'
import type { Habit } from '../types/habit'

const defaultColor = '#28705c'

const colorOptions = [
  '#28705c',
  '#174d3e',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
] as const

export interface HabitFormProps {
  habit?: Habit
  onCancel?: () => void
  onSaved?: (habit: Habit) => void
  submitLabel?: string
}

const normalizeNewDescription = (description: string) =>
  description.trim() || undefined

export function HabitForm({
  habit,
  onCancel,
  onSaved,
  submitLabel,
}: HabitFormProps) {
  const formId = useId()
  const addHabit = useHabitStore((state) => state.addHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const [name, setName] = useState(habit?.name ?? '')
  const [color, setColor] = useState(habit?.color ?? defaultColor)
  const [description, setDescription] = useState(habit?.description ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Name is required.')
      return
    }

    setError('')

    const trimmedDescription = description.trim()
    const values = {
      name: trimmedName,
      color,
    }

    if (habit) {
      updateHabit(habit.id, {
        ...values,
        description: trimmedDescription,
      })
      onSaved?.(
        useHabitStore.getState().habits.find(({ id }) => id === habit.id) ??
          habit,
      )
      return
    }

    const nextHabit = addHabit({
      ...values,
      description: normalizeNewDescription(description),
    })
    onSaved?.(nextHabit)
    setName('')
    setColor(defaultColor)
    setDescription('')
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor={`${formId}-name`}
        >
          Name
        </label>
        <input
          id={`${formId}-name`}
          className="w-full rounded-md border border-line bg-surface-raised px-3 py-2 text-base text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-describedby={error ? `${formId}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          autoComplete="off"
        />
        {error ? (
          <p
            id={`${formId}-error`}
            className="text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor={`${formId}-color`}
        >
          Color
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id={`${formId}-color`}
            className="h-10 w-12 cursor-pointer rounded-md border border-line bg-surface-raised p-1"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
          <div className="flex flex-wrap gap-2" aria-label="Preset colors">
            {colorOptions.map((option) => (
              <button
                aria-label={`Use ${option}`}
                className="h-8 w-8 rounded-full border border-line outline-none ring-offset-2 ring-offset-surface transition focus:ring-2 focus:ring-brand"
                key={option}
                onClick={() => setColor(option)}
                style={{ backgroundColor: option }}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-ink"
          htmlFor={`${formId}-description`}
        >
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          className="min-h-24 w-full resize-y rounded-md border border-line bg-surface-raised px-3 py-2 text-base text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel ? (
          <button
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
        <button
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
          type="submit"
        >
          {submitLabel ?? (habit ? 'Save habit' : 'Create habit')}
        </button>
      </div>
    </form>
  )
}
