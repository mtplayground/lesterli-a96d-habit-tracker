import { describe, expect, it } from 'vitest'

import type { CheckIn, DateKey } from '../types/habit'
import { computeStats } from './stats'

const checkIn = (dateKey: DateKey): CheckIn => ({
  id: `check-in-${dateKey}`,
  habitId: 'habit-1',
  dateKey,
  createdAt: `${dateKey}T12:00:00.000Z`,
})

describe('computeStats', () => {
  it('returns empty completion stats when there are no check-ins', () => {
    expect(computeStats([], '2026-05-21')).toEqual({
      30: {
        window: 30,
        totalDays: 30,
        completedDays: 0,
        completionRate: 0,
      },
      90: {
        window: 90,
        totalDays: 90,
        completedDays: 0,
        completionRate: 0,
      },
      365: {
        window: 365,
        totalDays: 365,
        completedDays: 0,
        completionRate: 0,
      },
    })
  })

  it('computes totals and completion rates for each window', () => {
    const stats = computeStats(
      [
        checkIn('2026-05-21'),
        checkIn('2026-05-20'),
        checkIn('2026-05-10'),
        checkIn('2026-03-01'),
        checkIn('2025-07-01'),
      ],
      '2026-05-21',
    )

    expect(stats[30]).toMatchObject({
      totalDays: 30,
      completedDays: 3,
      completionRate: 3 / 30,
    })
    expect(stats[90]).toMatchObject({
      totalDays: 90,
      completedDays: 4,
      completionRate: 4 / 90,
    })
    expect(stats[365]).toMatchObject({
      totalDays: 365,
      completedDays: 5,
      completionRate: 5 / 365,
    })
  })

  it('counts the inclusive window boundary', () => {
    const stats = computeStats(
      [checkIn('2026-04-21'), checkIn('2026-04-22')],
      '2026-05-21',
    )

    expect(stats[30].completedDays).toBe(1)
  })

  it('ignores duplicate, future, and invalid date keys', () => {
    const stats = computeStats(
      [
        checkIn('2026-05-21'),
        checkIn('2026-05-21'),
        checkIn('2026-05-22'),
        { ...checkIn('2026-05-20'), dateKey: 'not-a-date' },
      ],
      '2026-05-21',
    )

    expect(stats[30]).toMatchObject({
      completedDays: 1,
      completionRate: 1 / 30,
    })
  })

  it('returns zero rates when today is invalid', () => {
    const stats = computeStats([checkIn('2026-05-21')], 'invalid-date')

    expect(stats[30].completionRate).toBe(0)
    expect(stats[90].completionRate).toBe(0)
    expect(stats[365].completionRate).toBe(0)
  })
})
