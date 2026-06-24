import { subDays } from 'date-fns'

import {
  type CheckIn,
  type Habit,
  type HabitId,
  type HabitStoreState,
  SchemaVersion,
} from '../types/habit'
import { daysAgo } from '../utils/date'

export const SEED_PREFIX = 'seed-'

const iso = (days: number) => subDays(new Date(), days).toISOString()

const checkInId = (habitId: HabitId, daysBack: number) =>
  `${habitId}-check-in-${daysBack}`

const fill = (
  habitId: HabitId,
  days: number,
  keep: (daysBack: number) => boolean,
): CheckIn[] =>
  Array.from({ length: days }, (_, daysBack) => daysBack)
    .filter(keep)
    .map((daysBack) => ({
      id: checkInId(habitId, daysBack),
      habitId,
      dateKey: daysAgo(daysBack),
      createdAt: iso(daysBack),
    }))

const isWeekday = (daysBack: number) => {
  const day = subDays(new Date(), daysBack).getDay()
  return day !== 0 && day !== 6
}

export const seedHabits: Habit[] = [
  {
    id: 'seed-read',
    name: 'Read 30 min',
    color: '#6366f1',
    description: 'Every night before bed',
    createdAt: iso(90),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-move',
    name: 'Move outside',
    color: '#16a34a',
    description: 'Walk, stretch, or bike on weekdays',
    createdAt: iso(75),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-water',
    name: 'Drink water',
    color: '#0ea5e9',
    description: 'Hit the bottle goal before dinner',
    createdAt: iso(60),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-meditate',
    name: 'Meditate',
    color: '#a855f7',
    description: 'Build a calm five-minute reset',
    createdAt: iso(21),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-sleep',
    name: 'Sleep by 11',
    color: '#f97316',
    description: 'Recovering the routine one night at a time',
    createdAt: iso(120),
    updatedAt: iso(0),
    archivedAt: null,
  },
]

const seedCheckIns = (): CheckIn[] => [
  // Hero streak: a perfect 24-day run.
  ...fill('seed-read', 24, () => true),

  // Weekday rhythm: consistent movement Monday through Friday.
  ...fill('seed-move', 42, isWeekday),

  // Near-perfect: only a few misses in the recent window.
  ...fill('seed-water', 35, (daysBack) => ![6, 17, 28].includes(daysBack)),

  // New habit ramp: sparse start, then several recent wins.
  ...fill('seed-meditate', 21, (daysBack) =>
    [0, 1, 2, 4, 7, 11, 16, 20].includes(daysBack),
  ),

  // Hardest item, recovering: older gaps with a visible recent restart.
  ...fill('seed-sleep', 90, (daysBack) =>
    [0, 1, 3, 7, 14, 23, 37, 52, 70, 88].includes(daysBack),
  ),
]

export const seedState = (): HabitStoreState => ({
  schemaVersion: SchemaVersion,
  habits: seedHabits.map((habit) => ({ ...habit })),
  checkIns: seedCheckIns(),
})
