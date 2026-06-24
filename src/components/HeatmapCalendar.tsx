import { cloneElement, useMemo } from 'react'
import type {
  CSSProperties,
  KeyboardEvent,
  ReactElement,
  SVGProps,
} from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import type { CalendarHeatmapValue } from 'react-calendar-heatmap'
import { eachDayOfInterval, format, parseISO, subDays } from 'date-fns'

import { useHabitStore } from '../stores/habitStore'
import type { DateKey, Habit } from '../types/habit'
import { toDateKey, today } from '../utils/date'

export const HEATMAP_TRAILING_DAYS = 133
export const HEATMAP_CELL_SIZE_PX = 16

const HEATMAP_BASE_CELL_SIZE = 10
const HEATMAP_GUTTER_SIZE = 3

interface HeatmapValue extends CalendarHeatmapValue {
  checked: boolean
  count: number
  date: DateKey
}

type HeatmapDayProps = Partial<SVGProps<SVGRectElement>> & {
  'data-checked': string
  'data-date': DateKey | undefined
  'data-testid': string
}

type HeatmapStyle = CSSProperties & {
  '--heatmap-width': string
}

const getHeatmapWeekCount = (startDate: Date, endDate: Date) => {
  const daysWithRange =
    HEATMAP_TRAILING_DAYS + startDate.getDay() + (6 - endDate.getDay())

  return Math.ceil(daysWithRange / 7)
}

const getHeatmapWidthPx = (startDate: Date, endDate: Date) => {
  const weekCount = getHeatmapWeekCount(startDate, endDate)
  const svgWidthUnits =
    weekCount * (HEATMAP_BASE_CELL_SIZE + HEATMAP_GUTTER_SIZE) -
    HEATMAP_GUTTER_SIZE
  const scale = HEATMAP_CELL_SIZE_PX / HEATMAP_BASE_CELL_SIZE

  return Math.round(svgWidthUnits * scale * 100) / 100
}

export interface HeatmapCalendarProps {
  habit: Habit
  todayKey?: DateKey
}

const createValues = (
  checkIns: { dateKey: DateKey; habitId: string }[],
  habitId: string,
  currentDateKey: DateKey,
): HeatmapValue[] => {
  const endDate = parseISO(currentDateKey)
  const startDate = subDays(endDate, HEATMAP_TRAILING_DAYS - 1)
  const checkedDates = new Set(
    checkIns
      .filter((checkIn) => checkIn.habitId === habitId)
      .map((checkIn) => checkIn.dateKey),
  )

  return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
    const dateKey = toDateKey(date)
    const checked = checkedDates.has(dateKey)

    return {
      checked,
      count: checked ? 1 : 0,
      date: dateKey,
    }
  })
}

const valueTitle = (value: HeatmapValue | null) => {
  if (!value) {
    return ''
  }

  const status = value.checked ? 'Completed' : 'Not completed'

  return `${format(parseISO(value.date), 'MMM d, yyyy')}: ${status}`
}

export function HeatmapCalendar({ habit, todayKey }: HeatmapCalendarProps) {
  const currentDateKey = todayKey ?? today()
  const checkIns = useHabitStore((state) => state.checkIns)
  const toggleCheckIn = useHabitStore((state) => state.toggleCheckIn)
  const values = useMemo(
    () => createValues(checkIns, habit.id, currentDateKey),
    [checkIns, currentDateKey, habit.id],
  )
  const endDate = parseISO(currentDateKey)
  const calendarStartDate = subDays(endDate, HEATMAP_TRAILING_DAYS)
  const renderedStartDate = subDays(endDate, HEATMAP_TRAILING_DAYS - 1)
  const heatmapStyle: HeatmapStyle = {
    '--heatmap-width': `${getHeatmapWidthPx(renderedStartDate, endDate)}px`,
  }

  const toggleValue = (value: HeatmapValue | null) => {
    if (!value || value.date > currentDateKey) {
      return
    }

    toggleCheckIn(habit.id, value.date)
  }

  const handleKeyDown = (
    event: KeyboardEvent<SVGRectElement>,
    value: HeatmapValue | null,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    toggleValue(value)
  }

  return (
    <div
      aria-label={`${habit.name} check-in heatmap`}
      className="habit-heatmap"
      role="group"
      style={heatmapStyle}
    >
      <CalendarHeatmap
        classForValue={(value) =>
          value?.checked
            ? 'habit-heatmap-day habit-heatmap-day--checked'
            : 'habit-heatmap-day habit-heatmap-day--empty'
        }
        endDate={endDate}
        gutterSize={HEATMAP_GUTTER_SIZE}
        onClick={toggleValue}
        showOutOfRangeDays={false}
        startDate={calendarStartDate}
        titleForValue={valueTitle}
        transformDayElement={(
          element: ReactElement<SVGProps<SVGRectElement>>,
          value: HeatmapValue | null,
        ) => {
          const dayProps: HeatmapDayProps = {
            'aria-label': valueTitle(value),
            'data-checked': value?.checked ? 'true' : 'false',
            'data-date': value?.date,
            'data-testid': 'heatmap-day',
            onKeyDown: (event: KeyboardEvent<SVGRectElement>) =>
              handleKeyDown(event, value),
            role: 'button',
            style: {
              ...element.props.style,
              fill: value?.checked ? habit.color : 'var(--color-surface-muted)',
            },
            tabIndex: 0,
          }

          return cloneElement(element, dayProps)
        }}
        values={values}
      />
    </div>
  )
}
