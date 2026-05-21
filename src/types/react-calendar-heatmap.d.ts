declare module 'react-calendar-heatmap' {
  import type { MouseEvent, ReactElement, SVGProps } from 'react'

  export interface CalendarHeatmapValue {
    date: Date | number | string
    [key: string]: unknown
  }

  export interface CalendarHeatmapProps<TValue extends CalendarHeatmapValue> {
    classForValue?: (value: TValue | null) => string
    endDate?: Date | number | string
    gutterSize?: number
    horizontal?: boolean
    monthLabels?: string[]
    numDays?: number
    onClick?: (value: TValue | null) => void
    onMouseLeave?: (
      event: MouseEvent<SVGRectElement>,
      value: TValue | null,
    ) => void
    onMouseOver?: (
      event: MouseEvent<SVGRectElement>,
      value: TValue | null,
    ) => void
    showMonthLabels?: boolean
    showOutOfRangeDays?: boolean
    showWeekdayLabels?: boolean
    startDate?: Date | number | string
    titleForValue?: (value: TValue | null) => string
    tooltipDataAttrs?:
      | Record<string, string>
      | ((value: TValue | null) => Record<string, string>)
    transformDayElement?: (
      element: ReactElement<SVGProps<SVGRectElement>>,
      value: TValue | null,
      index: number,
    ) => ReactElement<SVGProps<SVGRectElement>>
    values: TValue[]
    weekdayLabels?: string[]
  }

  export default function CalendarHeatmap<TValue extends CalendarHeatmapValue>(
    props: CalendarHeatmapProps<TValue>,
  ): ReactElement | null
}
