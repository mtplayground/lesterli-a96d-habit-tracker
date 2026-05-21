import { beforeEach, describe, expect, it } from 'vitest'

import {
  HABIT_STORE_STORAGE_KEY,
  migrateHabitStore,
  useHabitStore,
} from './habitStore'
import { SchemaVersion } from '../types/habit'

describe('useHabitStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useHabitStore.setState({
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    })
  })

  it('adds, updates, archives, and deletes habits', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: '  Hydrate  ', color: '#28705c' })

    expect(habit.name).toBe('Hydrate')
    expect(useHabitStore.getState().habits).toHaveLength(1)

    useHabitStore
      .getState()
      .updateHabit(habit.id, { name: 'Drink water', description: 'Daily' })

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      id: habit.id,
      name: 'Drink water',
      description: 'Daily',
    })

    useHabitStore.getState().archiveHabit(habit.id)

    expect(useHabitStore.getState().habits[0]?.archivedAt).toEqual(
      expect.any(String),
    )

    useHabitStore.getState().deleteHabit(habit.id)

    expect(useHabitStore.getState().habits).toEqual([])
  })

  it('toggles check-ins for a habit and date key', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#174d3e' })

    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    expect(useHabitStore.getState().checkIns).toMatchObject([
      { habitId: habit.id, dateKey: '2026-05-21' },
    ])

    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    expect(useHabitStore.getState().checkIns).toEqual([])
  })

  it('persists state with schema version stamping', () => {
    useHabitStore.getState().addHabit({ name: 'Read', color: '#28705c' })

    const persistedState = localStorage.getItem(HABIT_STORE_STORAGE_KEY)

    expect(persistedState).toContain(`"version":${SchemaVersion}`)
    expect(persistedState).toContain(`"schemaVersion":${SchemaVersion}`)
  })

  it('keeps v1 persisted state unchanged during migration', () => {
    const persistedState = {
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    }

    expect(migrateHabitStore(persistedState, SchemaVersion)).toBe(
      persistedState,
    )
  })

  it('stamps migrated legacy state with the current schema version', () => {
    const migratedState = migrateHabitStore(
      {
        habits: [],
        checkIns: [],
      },
      0,
    )

    expect(migratedState).toEqual({
      schemaVersion: SchemaVersion,
      habits: [],
      checkIns: [],
    })
  })
})
