import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { GuestRoute, ProtectedRoute } from './guards'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AppShell = lazy(() => import('@/components/layout/AppShell'))
const DokterPage = lazy(() => import('@/pages/DokterPage'))
const DokterDetailPage = lazy(() => import('@/pages/DokterDetailPage'))
const MarginDiskonPage = lazy(() => import('@/pages/MarginDiskonPage'))
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
      {
        path: 'dokter/:id',
        element: <DokterDetailPage />,
      },
      {
        path: 'keuangan/margin',
        element: <MarginDiskonPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
