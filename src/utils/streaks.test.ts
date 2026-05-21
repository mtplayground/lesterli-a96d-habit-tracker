import { describe, expect, it } from 'vitest'

import type { CheckIn, DateKey } from '../types/habit'
import { computeStreaks } from './streaks'

const checkIn = (dateKey: DateKey): CheckIn => ({
  id: `check-in-${dateKey}`,
  habitId: 'habit-1',
  dateKey,
  createdAt: `${dateKey}T12:00:00.000Z`,
})

describe('computeStreaks', () => {
  it('returns zero streaks for no check-ins', () => {
    expect(computeStreaks([], '2026-05-21')).toEqual({
      current: 0,
      longest: 0,
    })
  })

  it('computes current and longest streaks across gaps', () => {
    expect(
      computeStreaks(
        [
          checkIn('2026-05-15'),
          checkIn('2026-05-16'),
          checkIn('2026-05-17'),
          checkIn('2026-05-20'),
          checkIn('2026-05-21'),
        ],
        '2026-05-21',
      ),
    ).toEqual({
      current: 2,
      longest: 3,
    })
  })

  it('returns zero current streak when today has no check-in', () => {
    expect(
      computeStreaks(
        [checkIn('2026-05-18'), checkIn('2026-05-19'), checkIn('2026-05-20')],
        '2026-05-21',
      ),
    ).toEqual({
      current: 0,
      longest: 3,
    })
  })

  it('ignores future dates when computing streaks', () => {
    expect(
      computeStreaks(
        [checkIn('2026-05-21'), checkIn('2026-05-22'), checkIn('2026-05-23')],
        '2026-05-21',
      ),
    ).toEqual({
      current: 1,
      longest: 1,
    })
  })

  it('does not inflate streaks for duplicate or unordered dates', () => {
    expect(
      computeStreaks(
        [
          checkIn('2026-05-21'),
          checkIn('2026-05-19'),
          checkIn('2026-05-20'),
          checkIn('2026-05-21'),
        ],
        '2026-05-21',
      ),
    ).toEqual({
      current: 3,
      longest: 3,
    })
  })

  it('ignores invalid date keys', () => {
    expect(
      computeStreaks(
        [
          checkIn('2026-05-21'),
          { ...checkIn('2026-05-20'), dateKey: 'not-a-date' },
        ],
        '2026-05-21',
      ),
    ).toEqual({
      current: 1,
      longest: 1,
    })
  })
})
