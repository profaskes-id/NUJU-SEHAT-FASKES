import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const AppShell = lazy(() => import('@/components/layout/AppShell'))
const DokterPage = lazy(() => import('@/pages/DokterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: 'dokter',
        element: <DokterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
