export const SchemaVersion = 1 as const

export type HabitId = string
export type CheckInId = string
export type DateKey = string
export type ISODateTime = string

export interface Habit {
  id: HabitId
  name: string
  color: string
  description?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
  archivedAt: ISODateTime | null
}

export interface CheckIn {
  id: CheckInId
  habitId: HabitId
  dateKey: DateKey
  createdAt: ISODateTime
}

export interface HabitStoreState {
  schemaVersion: typeof SchemaVersion
  habits: Habit[]
  checkIns: CheckIn[]
}
