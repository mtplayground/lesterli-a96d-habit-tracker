import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HabitForm } from './HabitForm'
import { useHabitStore } from '../stores/habitStore'
import { SchemaVersion } from '../types/habit'

describe('HabitForm', () => {
  beforeEach(() => {
    localStorage.clear()
    useHabitStore.setState({
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('creates a habit from controlled fields', () => {
    const onSaved = vi.fn()

    render(<HabitForm onSaved={onSaved} />)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: '  Hydrate  ' },
    })
    fireEvent.change(screen.getByLabelText('Color'), {
      target: { value: '#174d3e' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '  Drink water daily  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create habit' }))

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      name: 'Hydrate',
      color: '#174d3e',
      description: 'Drink water daily',
    })
    expect(onSaved).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Hydrate' }),
    )
  })

  it('validates that name is required', () => {
    render(<HabitForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Create habit' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.')
    expect(useHabitStore.getState().habits).toEqual([])
  })

  it('updates an existing habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#28705c', description: 'Books' })
    const onSaved = vi.fn()

    render(<HabitForm habit={habit} onSaved={onSaved} />)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Read fiction' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Use #7c3aed' }))
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save habit' }))

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      id: habit.id,
      name: 'Read fiction',
      color: '#7c3aed',
      description: undefined,
    })
    expect(onSaved).toHaveBeenCalledWith(
      expect.objectContaining({ id: habit.id, name: 'Read fiction' }),
    )
  })

  it('calls onCancel without submitting', () => {
    const onCancel = vi.fn()

    render(<HabitForm onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(useHabitStore.getState().habits).toEqual([])
  })
})
