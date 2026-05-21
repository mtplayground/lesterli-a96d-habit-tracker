import { parseISO, subDays } from 'date-fns'

import type { CheckIn, DateKey } from '../types/habit'
import { toDateKey } from './date'

export const statsWindows = [30, 90, 365] as const

export type StatsWindow = (typeof statsWindows)[number]

export interface CompletionWindowStats {
  window: StatsWindow
  totalDays: StatsWindow
  completedDays: number
  completionRate: number
}

export type CompletionStats = Record<StatsWindow, CompletionWindowStats>

type StatsCheckIn = Pick<CheckIn, 'dateKey'>

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/

const isValidDateKey = (dateKey: string) => {
  if (!dateKeyPattern.test(dateKey)) {
    return false
  }

  return !Number.isNaN(parseISO(dateKey).getTime())
}

const emptyWindowStats = (window: StatsWindow): CompletionWindowStats => ({
  window,
  totalDays: window,
  completedDays: 0,
  completionRate: 0,
})

export const computeStats = (
  checkIns: StatsCheckIn[],
  today: DateKey,
): CompletionStats => {
  if (!isValidDateKey(today)) {
    return {
      30: emptyWindowStats(30),
      90: emptyWindowStats(90),
      365: emptyWindowStats(365),
    }
  }

  const checkedDateKeys = new Set(
    checkIns
      .map((checkIn) => checkIn.dateKey)
      .filter((dateKey) => isValidDateKey(dateKey) && dateKey <= today),
  )

  const computeWindow = (window: StatsWindow): CompletionWindowStats => {
    const start = toDateKey(subDays(parseISO(today), window - 1))
    const completedDays = [...checkedDateKeys].filter(
      (dateKey) => dateKey >= start && dateKey <= today,
    ).length

    return {
      window,
      totalDays: window,
      completedDays,
      completionRate: completedDays / window,
    }
  }

  return {
    30: computeWindow(30),
    90: computeWindow(90),
    365: computeWindow(365),
  }
}
