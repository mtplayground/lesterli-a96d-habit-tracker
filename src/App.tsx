import type { CSSProperties } from 'react'
import { RouterProvider } from 'react-router-dom'

import { createAppRouter } from './router'

type AppColorVariable =
  | '--color-ink'
  | '--color-ink-muted'
  | '--color-ink-soft'
  | '--color-surface'
  | '--color-surface-raised'
  | '--color-surface-muted'
  | '--color-brand'
  | '--color-brand-dark'
  | '--color-brand-light'
  | '--color-line'

const appPalette: CSSProperties & Record<AppColorVariable, string> = {
  '--color-ink': import.meta.env.VITE_COLOR_INK || '#17201b',
  '--color-ink-muted': import.meta.env.VITE_COLOR_INK_MUTED || '#4b5b51',
  '--color-ink-soft': import.meta.env.VITE_COLOR_INK_SOFT || '#66756c',
  '--color-surface': import.meta.env.VITE_COLOR_SURFACE || '#f7faf7',
  '--color-surface-raised':
    import.meta.env.VITE_COLOR_SURFACE_RAISED || '#ffffff',
  '--color-surface-muted':
    import.meta.env.VITE_COLOR_SURFACE_MUTED || '#edf3ee',
  '--color-brand': import.meta.env.VITE_COLOR_BRAND || '#28705c',
  '--color-brand-dark': import.meta.env.VITE_COLOR_BRAND_DARK || '#174d3e',
  '--color-brand-light': import.meta.env.VITE_COLOR_BRAND_LIGHT || '#dcefe7',
  '--color-line': import.meta.env.VITE_COLOR_LINE || '#d7e1da',
}

const router = createAppRouter()

function App() {
  return (
    <div style={appPalette}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
