import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { RootLayout } from './layouts/RootLayout'
import { DashboardPage } from './pages/DashboardPage'
import { HabitDetailPage } from './pages/HabitDetailPage'
import { NewHabitPage } from './pages/NewHabitPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const createAppRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'habits/new',
        element: <NewHabitPage />,
      },
      {
        path: 'habits/:id',
        element: <HabitDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const createAppRouter = () => createBrowserRouter(createAppRoutes())
