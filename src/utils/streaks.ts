import { differenceInCalendarDays, parseISO, subDays } from 'date-fns'

import type { CheckIn, DateKey } from '../types/habit'
import { toDateKey } from './date'

export interface Streaks {
  current: number
  longest: number
}

type StreakCheckIn = Pick<CheckIn, 'dateKey'>

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/

const isValidDateKey = (dateKey: string) => {
  if (!dateKeyPattern.test(dateKey)) {
    return false
  }

  return !Number.isNaN(parseISO(dateKey).getTime())
}

const previousDateKey = (dateKey: DateKey): DateKey =>
  toDateKey(subDays(parseISO(dateKey), 1))

export const computeStreaks = (
  checkIns: StreakCheckIn[],
  today: DateKey,
): Streaks => {
  if (!isValidDateKey(today)) {
    return { current: 0, longest: 0 }
  }

  const checkedDateKeys = new Set(
    checkIns
      .map((checkIn) => checkIn.dateKey)
      .filter((dateKey) => isValidDateKey(dateKey) && dateKey <= today),
  )

  const sortedDateKeys = [...checkedDateKeys].sort()

  let longest = 0
  let runLength = 0
  let previous: DateKey | undefined

  for (const dateKey of sortedDateKeys) {
    const isConsecutive =
      previous !== undefined &&
      differenceInCalendarDays(parseISO(dateKey), parseISO(previous)) === 1

    runLength = isConsecutive ? runLength + 1 : 1
    longest = Math.max(longest, runLength)
    previous = dateKey
  }

  let current = 0
  let cursor = today

  while (checkedDateKeys.has(cursor)) {
    current += 1
    cursor = previousDateKey(cursor)
  }

  return { current, longest }
}
