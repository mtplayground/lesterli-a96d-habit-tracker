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
  // Anchor habit: a complete daily streak for an easy-to-read baseline.
  ...fill('seed-read', SEED_HISTORY_DAYS, () => true),

  // Workweek rhythm with a few travel days and low-energy Fridays missed.
  ...fill(
    'seed-move',
    SEED_HISTORY_DAYS,
    (daysBack) =>
      isWeekday(daysBack) &&
      ![8, 19, 34, 47, 63, 79, 96, 113, 128, 144].includes(daysBack),
  ),

  // High-volume hydration with scattered realistic misses instead of a grid.
  ...fill(
    'seed-water',
    SEED_HISTORY_DAYS,
    (daysBack) =>
      ![5, 12, 18, 27, 41, 56, 58, 73, 89, 101, 119, 136, 143].includes(
        daysBack,
      ),
  ),

  // Meditation ramps from sporadic attempts into a stronger recent cadence.
  ...fill(
    'seed-meditate',
    SEED_HISTORY_DAYS,
    (daysBack) =>
      daysBack === SEED_HISTORY_DAYS - 1 ||
      (daysBack <= 28 && ![3, 9, 15, 22, 27].includes(daysBack)) ||
      (daysBack > 28 && daysBack % 8 === 1) ||
      daysBack % 13 === 0,
  ),

  // Sleep remains the hardest habit: sparse wins plus a visible recent restart.
  ...fill('seed-sleep', SEED_HISTORY_DAYS, (daysBack) =>
    [0, 1, 2, 5, 9, 16, 24, 35, 49, 67, 88, 111, 132, 149].includes(
      daysBack,
    ),
  ),
]

export const seedState = (): HabitStoreState => ({
  schemaVersion: SchemaVersion,
  habits: seedHabits.map((habit) => ({ ...habit })),
  checkIns: seedCheckIns(),
})
