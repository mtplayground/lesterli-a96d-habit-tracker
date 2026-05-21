import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StreakBadge } from './StreakBadge'

describe('StreakBadge', () => {
  it('shows the current streak with a flame icon and longest streak tooltip', () => {
    render(<StreakBadge current={2} longest={5} />)

    const badge = screen.getByLabelText('Current streak: 2 days')

    expect(badge).toHaveTextContent('🔥')
    expect(badge).toHaveTextContent('2 days')
    expect(badge).toHaveAttribute('title', 'Longest streak: 5 days')
  })

  it('uses singular day labels', () => {
    render(<StreakBadge current={1} longest={1} />)

    expect(screen.getByLabelText('Current streak: 1 day')).toHaveAttribute(
      'title',
      'Longest streak: 1 day',
    )
  })
})
