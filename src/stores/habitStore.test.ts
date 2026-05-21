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

  it('adds a habit with normalized fields', () => {
    const habit = useHabitStore.getState().addHabit({
      name: '  Hydrate  ',
      color: '#28705c',
      description: '  Drink water  ',
    })

    expect(habit).toMatchObject({
      name: 'Hydrate',
      color: '#28705c',
      description: 'Drink water',
      archivedAt: null,
    })
    expect(habit.id).toEqual(expect.any(String))
    expect(habit.createdAt).toEqual(expect.any(String))
    expect(habit.updatedAt).toBe(habit.createdAt)
    expect(useHabitStore.getState().habits).toHaveLength(1)
  })

  it('updates a habit by id', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Hydrate', color: '#28705c' })

    useHabitStore.getState().updateHabit(habit.id, {
      name: '  Drink water  ',
      color: '#174d3e',
      description: '  Daily  ',
    })

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      id: habit.id,
      name: 'Drink water',
      color: '#174d3e',
      description: 'Daily',
    })
    expect(useHabitStore.getState().habits[0]?.updatedAt).toEqual(
      expect.any(String),
    )
  })

  it('archives a habit', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Exercise', color: '#28705c' })

    useHabitStore.getState().archiveHabit(habit.id)

    const archivedHabit = useHabitStore.getState().habits[0]

    expect(archivedHabit?.archivedAt).toEqual(expect.any(String))
    expect(archivedHabit?.updatedAt).toBe(archivedHabit?.archivedAt)
  })

  it('deletes a habit and its check-ins', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Read', color: '#28705c' })

    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    useHabitStore.getState().deleteHabit(habit.id)

    expect(useHabitStore.getState().habits).toEqual([])
    expect(useHabitStore.getState().checkIns).toEqual([])
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

  it('does not create duplicate check-ins for the same habit-date', () => {
    const habit = useHabitStore
      .getState()
      .addHabit({ name: 'Journal', color: '#28705c' })

    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')
    useHabitStore.getState().toggleCheckIn(habit.id, '2026-05-21')

    const matchingCheckIns = useHabitStore
      .getState()
      .checkIns.filter(
        (checkIn) =>
          checkIn.habitId === habit.id && checkIn.dateKey === '2026-05-21',
      )

    expect(matchingCheckIns).toHaveLength(1)
  })

  it('does not create check-ins for unknown habits', () => {
    useHabitStore.getState().toggleCheckIn('missing-habit', '2026-05-21')

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
