import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { GuestRoute, ProtectedRoute } from './guards'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AppShell = lazy(() => import('@/components/layout/AppShell'))
const DokterPage = lazy(() => import('@/pages/DokterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
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
