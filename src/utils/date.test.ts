import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { daysAgo, rangeOfDays, toDateKey, today } from './date'

describe('date helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 21, 12, 30))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats date keys in the local timezone', () => {
    expect(toDateKey(new Date(2026, 0, 2, 23, 45))).toBe('2026-01-02')
  })

  it('returns today as a local date key', () => {
    expect(today()).toBe('2026-05-21')
  })

  it('returns a past local date key', () => {
    expect(daysAgo(2)).toBe('2026-05-19')
  })

  it('returns an inclusive trailing range ending today', () => {
    expect(rangeOfDays(4)).toEqual([
      '2026-05-18',
      '2026-05-19',
      '2026-05-20',
      '2026-05-21',
    ])
  })

  it('returns an empty range for non-positive counts', () => {
    expect(rangeOfDays(0)).toEqual([])
    expect(rangeOfDays(-2)).toEqual([])
  })
})
