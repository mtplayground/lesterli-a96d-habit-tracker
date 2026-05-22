import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  applyHabitImport,
  type HabitExportPayload,
  type HabitImportMode,
} from '../utils/importExport'
import {
  type CheckIn,
  type DateKey,
  type Habit,
  type HabitId,
  type HabitStoreState,
  SchemaVersion,
} from '../types/habit'

export const HABIT_STORE_STORAGE_KEY = 'habit-tracker-store'

type NewHabit = Pick<Habit, 'name' | 'color'> &
  Partial<Pick<Habit, 'description'>>
type HabitUpdate = Partial<Pick<Habit, 'name' | 'color' | 'description'>>

interface HabitStoreActions {
  addHabit: (habit: NewHabit) => Habit
  updateHabit: (habitId: HabitId, updates: HabitUpdate) => void
  archiveHabit: (habitId: HabitId) => void
  restoreHabit: (habitId: HabitId) => void
  deleteHabit: (habitId: HabitId) => void
  importHabitState: (
    importedState: HabitExportPayload,
    mode: HabitImportMode,
  ) => void
  toggleCheckIn: (habitId: HabitId, dateKey: DateKey) => void
}

export type HabitStore = HabitStoreState & HabitStoreActions

const initialState: HabitStoreState = {
  schemaVersion: SchemaVersion,
  habits: [],
  checkIns: [],
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const timestamp = () => new Date().toISOString()

const normalizeHabit = (habit: NewHabit, createdAt: string): Habit => ({
  id: createId(),
  name: habit.name.trim(),
  color: habit.color,
  description: habit.description?.trim() || undefined,
  createdAt,
  updatedAt: createdAt,
  archivedAt: null,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const arrayOrEmpty = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : []

const isHabitStoreState = (value: unknown): value is HabitStoreState =>
  isRecord(value) &&
  value.schemaVersion === SchemaVersion &&
  Array.isArray(value.habits) &&
  Array.isArray(value.checkIns)

export const migrateHabitStore = (
  persistedState: unknown,
  version: number,
): HabitStoreState => {
  if (!isRecord(persistedState)) {
    return initialState
  }

  switch (version) {
    case SchemaVersion:
      return isHabitStoreState(persistedState) ? persistedState : initialState
    default:
      return {
        schemaVersion: SchemaVersion,
        habits: arrayOrEmpty<Habit>(persistedState.habits),
        checkIns: arrayOrEmpty<CheckIn>(persistedState.checkIns),
      }
  }
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addHabit: (habit) => {
        const nextHabit = normalizeHabit(habit, timestamp())

        set((state) => ({
          schemaVersion: SchemaVersion,
          habits: [...state.habits, nextHabit],
        }))

        return nextHabit
      },

      updateHabit: (habitId, updates) => {
        const updatedAt = timestamp()

        set((state) => ({
          schemaVersion: SchemaVersion,
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  ...updates,
                  name: updates.name?.trim() ?? habit.name,
                  description:
                    updates.description === undefined
                      ? habit.description
                      : updates.description.trim() || undefined,
                  updatedAt,
                }
              : habit,
          ),
        }))
      },

      archiveHabit: (habitId) => {
        const archivedAt = timestamp()

        set((state) => ({
          schemaVersion: SchemaVersion,
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? { ...habit, archivedAt, updatedAt: archivedAt }
              : habit,
          ),
        }))
      },

      restoreHabit: (habitId) => {
        const updatedAt = timestamp()

        set((state) => ({
          schemaVersion: SchemaVersion,
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? { ...habit, archivedAt: null, updatedAt }
              : habit,
          ),
        }))
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          schemaVersion: SchemaVersion,
          habits: state.habits.filter((habit) => habit.id !== habitId),
          checkIns: state.checkIns.filter(
            (checkIn) => checkIn.habitId !== habitId,
          ),
        }))
      },

      importHabitState: (importedState, mode) => {
        set((state) => ({
          ...applyHabitImport(state, importedState, mode),
        }))
      },

      toggleCheckIn: (habitId, dateKey) => {
        const existingCheckIn = get().checkIns.find(
          (checkIn) =>
            checkIn.habitId === habitId && checkIn.dateKey === dateKey,
        )

        if (existingCheckIn) {
          set((state) => ({
            schemaVersion: SchemaVersion,
            checkIns: state.checkIns.filter(
              (checkIn) => checkIn.id !== existingCheckIn.id,
            ),
          }))
          return
        }

        const habitExists = get().habits.some((habit) => habit.id === habitId)

        if (!habitExists) {
          return
        }

        const nextCheckIn: CheckIn = {
          id: createId(),
          habitId,
          dateKey,
          createdAt: timestamp(),
        }

        set((state) => ({
          schemaVersion: SchemaVersion,
          checkIns: [...state.checkIns, nextCheckIn],
        }))
      },
    }),
    {
      name: HABIT_STORE_STORAGE_KEY,
      version: SchemaVersion,
      storage: createJSONStorage(() => localStorage),
      migrate: migrateHabitStore,
      partialize: ({ schemaVersion, habits, checkIns }) => ({
        schemaVersion,
        habits,
        checkIns,
      }),
    },
  ),
)
