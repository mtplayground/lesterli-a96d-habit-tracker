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

const SEED_HISTORY_DAYS = 150

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
    createdAt: iso(SEED_HISTORY_DAYS),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-move',
    name: 'Move outside',
    color: '#16a34a',
    description: 'Walk, stretch, or bike on weekdays',
    createdAt: iso(SEED_HISTORY_DAYS),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-water',
    name: 'Drink water',
    color: '#0ea5e9',
    description: 'Hit the bottle goal before dinner',
    createdAt: iso(SEED_HISTORY_DAYS),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-meditate',
    name: 'Meditate',
    color: '#a855f7',
    description: 'Build a calm five-minute reset',
    createdAt: iso(SEED_HISTORY_DAYS),
    updatedAt: iso(0),
    archivedAt: null,
  },
  {
    id: 'seed-sleep',
    name: 'Sleep by 11',
    color: '#f97316',
    description: 'Recovering the routine one night at a time',
    createdAt: iso(SEED_HISTORY_DAYS),
    updatedAt: iso(0),
    archivedAt: null,
  },
]

const seedCheckIns = (): CheckIn[] => [
  // Hero streak: a perfect 150-day run to fill the shortened heatmap.
  ...fill('seed-read', SEED_HISTORY_DAYS, () => true),

  // Weekday rhythm: consistent movement Monday through Friday.
  ...fill('seed-move', SEED_HISTORY_DAYS, isWeekday),

  // Near-perfect: only a few misses spread through the full sample window.
  ...fill(
    'seed-water',
    SEED_HISTORY_DAYS,
    (daysBack) =>
      ![6, 17, 28, 43, 59, 74, 91, 108, 126, 141].includes(daysBack),
  ),

  // New habit ramp: sparse early starts, then several recent wins.
  ...fill(
    'seed-meditate',
    SEED_HISTORY_DAYS,
    (daysBack) =>
      [0, 1, 2, 4, 7, 11, 16, 20].includes(daysBack) ||
      daysBack % 9 === 0 ||
      daysBack % 9 === 4 ||
      daysBack === SEED_HISTORY_DAYS - 1,
  ),

  // Hardest item, recovering: older gaps with a visible recent restart.
  ...fill('seed-sleep', SEED_HISTORY_DAYS, (daysBack) =>
    [0, 1, 3, 7, 14, 23, 37, 52, 70, 88, 106, 124, 142, 149].includes(
      daysBack,
    ),
  ),
]

export const seedState = (): HabitStoreState => ({
  schemaVersion: SchemaVersion,
  habits: seedHabits.map((habit) => ({ ...habit })),
  checkIns: seedCheckIns(),
})
