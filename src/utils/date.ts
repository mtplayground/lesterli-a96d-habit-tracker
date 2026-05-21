import { eachDayOfInterval, format, subDays } from 'date-fns'

import type { DateKey } from '../types/habit'

export const toDateKey = (date: Date): DateKey => format(date, 'yyyy-MM-dd')

export const today = (): DateKey => toDateKey(new Date())

export const daysAgo = (days: number): DateKey =>
  toDateKey(subDays(new Date(), days))

export const rangeOfDays = (days: number): DateKey[] => {
  if (!Number.isInteger(days) || days <= 0) {
    return []
  }

  const end = new Date()
  const start = subDays(end, days - 1)

  return eachDayOfInterval({ start, end }).map(toDateKey)
}
