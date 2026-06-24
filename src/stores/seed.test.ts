import { describe, expect, it } from 'vitest'

import { SchemaVersion } from '../types/habit'
import { daysAgo } from '../utils/date'
import { SEED_PREFIX, seedHabits, seedState } from './seed'

describe('seedState', () => {
  it('exports the seed prefix and five sample habits', () => {
    const state = seedState()

    expect(SEED_PREFIX).toBe('seed-')
    expect(state.schemaVersion).toBe(SchemaVersion)
    expect(state.habits.map((habit) => habit.id)).toEqual([
      'seed-read',
      'seed-move',
      'seed-water',
      'seed-meditate',
      'seed-sleep',
    ])
  })

  it('includes the completed read habit from the product notes', () => {
    expect(seedHabits[0]).toMatchObject({
      id: 'seed-read',
      name: 'Read 30 min',
      color: '#6366f1',
      description: 'Every night before bed',
      archivedAt: null,
    })
    expect(seedHabits[0]?.createdAt).toEqual(expect.any(String))
    expect(seedHabits[0]?.updatedAt).toEqual(expect.any(String))
  })

  it('creates typed check-ins for the sample habit patterns', () => {
    const state = seedState()
    const habitIds = new Set(state.habits.map((habit) => habit.id))
    const checkInIds = new Set(state.checkIns.map((checkIn) => checkIn.id))

    expect(state.checkIns.length).toBeGreaterThan(70)
    expect(checkInIds.size).toBe(state.checkIns.length)
    expect(
      state.checkIns.every((checkIn) => habitIds.has(checkIn.habitId)),
    ).toBe(true)
    expect(
      state.checkIns.every((checkIn) =>
        /^\d{4}-\d{2}-\d{2}$/.test(checkIn.dateKey),
      ),
    ).toBe(true)
  })

  it('models the expected sample rhythms', () => {
    const state = seedState()

    const readDates = state.checkIns
      .filter((checkIn) => checkIn.habitId === 'seed-read')
      .map((checkIn) => checkIn.dateKey)

    expect(readDates).toHaveLength(24)
    expect(readDates).toContain(daysAgo(0))
    expect(readDates).toContain(daysAgo(23))
    expect(readDates).not.toContain(daysAgo(24))

    expect(
      state.checkIns.filter((checkIn) => checkIn.habitId === 'seed-meditate'),
    ).toHaveLength(8)
    expect(
      state.checkIns.filter((checkIn) => checkIn.habitId === 'seed-sleep'),
    ).toHaveLength(10)
  })

  it('returns fresh arrays and habit objects for each initial state', () => {
    const first = seedState()
    const second = seedState()

    expect(first).not.toBe(second)
    expect(first.habits).not.toBe(second.habits)
    expect(first.habits[0]).not.toBe(second.habits[0])
    expect(first.checkIns).not.toBe(second.checkIns)
  })
})
